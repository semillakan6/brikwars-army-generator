"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Download, Upload } from "lucide-react"
import { useState } from "react"
import { squadFields } from "@/config/squad-fields"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function Home() {
  const [armyName, setArmyName] = useState("")
  const [squads, setSquads] = useState([])
  const [newSquadName, setNewSquadName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSquad, setSelectedSquad] = useState(null)
  
  // Initialize unit form with default values from squadFields
  const initialUnitForm = squadFields.reduce((acc, field) => {
    acc[field.id] = field.type === "switch" ? false : ""
    return acc
  }, {})
  
  const [unitForm, setUnitForm] = useState(initialUnitForm)

  const handleAddSquad = () => {
    if (newSquadName.trim()) {
      const newSquad = { 
        name: newSquadName, 
        units: [],
        id: Date.now()
      }
      setSquads([...squads, newSquad])
      setNewSquadName("")
      setIsDialogOpen(false)
      setSelectedSquad(newSquad.id)
    }
  }

  const handleAddUnit = (e) => {
    e.preventDefault()
    if (!selectedSquad) return

    const updatedSquads = squads.map(squad => {
      if (squad.id === selectedSquad) {
        return {
          ...squad,
          units: [...squad.units, { ...unitForm, id: Date.now() }]
        }
      }
      return squad
    })
    setSquads(updatedSquads)
    setUnitForm(initialUnitForm)
  }

  const handleDeleteUnit = (squadId, unitId) => {
    const updatedSquads = squads.map(squad => {
      if (squad.id === squadId) {
        return {
          ...squad,
          units: squad.units.filter(unit => unit.id !== unitId)
        }
      }
      return squad
    })
    setSquads(updatedSquads)
  }

  // Calculate total points for a unit
  const calculateUnitPoints = (unit) => {
    return parseInt(unit.value || 0)
  }

  // Calculate total points for a squad
  const calculateSquadPoints = (squad) => {
    return squad.units.reduce((total, unit) => total + calculateUnitPoints(unit), 0)
  }

  // Calculate total army points
  const calculateTotalPoints = () => {
    return squads.reduce((total, squad) => total + calculateSquadPoints(squad), 0)
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    const totalPoints = calculateTotalPoints()
    
    // Add army title centered
    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text(`${armyName || "Unnamed Army"} - ${totalPoints}pts.`, doc.internal.pageSize.getWidth() / 2, 20, { align: "center" })
    
    let yPosition = 30
    
    squads.forEach((squad, index) => {
      const squadPoints = calculateSquadPoints(squad)
      
      // Add squad name with points
      doc.setFontSize(16)
      doc.text(`${index + 1}. ${squad.name} (${squadPoints}pts)`, 14, yPosition)
      yPosition += 10
      
      if (squad.units.length > 0) {
        // Prepare table data
        const tableData = squad.units.map(unit => {
          return squadFields
            .filter(field => field.type !== "switch")
            .map(field => {
              if (field.type === "select") {
                const selectedOption = field.options
                  .flatMap(group => group.items)
                  .find(item => item.value === unit[field.id])
                return selectedOption ? selectedOption.label : unit[field.id]
              }
              return unit[field.id] || ""
            })
        })
        
        // Add table
        autoTable(doc, {
          startY: yPosition,
          head: [squadFields
            .filter(field => field.type !== "switch")
            .map(field => field.label)
          ],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] },
          styles: { fontSize: 10 }
        })
        
        yPosition = doc.lastAutoTable.finalY + 10
      } else {
        doc.setFontSize(12)
        doc.text("No units in this squad", 14, yPosition)
        yPosition += 20
      }
    })
    
    doc.save("brikwars-army-list.pdf")
  }

  const handleExportJSON = () => {
    const armyData = {
      name: armyName,
      squads: squads
    }
    const dataStr = JSON.stringify(armyData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${armyName || 'army'}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImportJSON = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          setArmyName(data.name || "")
          setSquads(data.squads || [])
        } catch (error) {
          alert('Error importing file. Please make sure it is a valid army file.')
        }
      }
      reader.readAsText(file)
    }
  }

  const selectedSquadData = squads.find(squad => squad.id === selectedSquad)

  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "number":
        return (
          <Input
            type={field.type}
            id={field.id}
            value={unitForm[field.id]}
            onChange={(e) => setUnitForm({...unitForm, [field.id]: e.target.value})}
            placeholder={field.placeholder}
            required={field.required}
          />
        )
      case "switch":
        return (
          <div className="flex items-center gap-2">
            <Switch 
              checked={unitForm[field.id]}
              onCheckedChange={(checked) => setUnitForm({...unitForm, [field.id]: checked})}
            />
            <Label>{field.label}</Label>
          </div>
        )
      case "select":
        return (
          <Select
            value={unitForm[field.id]}
            onValueChange={(value) => setUnitForm({...unitForm, [field.id]: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map(group => (
                <SelectGroup key={group.group}>
                  <SelectLabel>{group.group}</SelectLabel>
                  {group.items.map(item => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return null
    }
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Army List Builder
          </h1>
          <div className="flex items-center gap-4">
            <Label htmlFor="armyName">Army Name:</Label>
            <Input
              id="armyName"
              value={armyName}
              onChange={(e) => setArmyName(e.target.value)}
              placeholder="Enter army name"
              className="w-64"
            />
            <div className="text-lg font-semibold">
              Total Points: {calculateTotalPoints()}pts
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {squads.length > 0 && (
            <>
              <Button onClick={handleExportJSON} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export JSON
              </Button>
              <Button onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </>
          )}
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
              id="import-file"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('import-file').click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Army
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Unit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Unit Management</CardTitle>
            <CardDescription>
              {selectedSquadData 
                ? `Add or modify units for ${selectedSquadData.name}`
                : "Select a squad to add units"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSquadData ? (
              <form onSubmit={handleAddUnit} className="space-y-4">
                {squadFields.map(field => (
                  <div key={field.id} className="space-y-2">
                    {field.type !== "switch" && (
                      <Label htmlFor={field.id}>{field.label}</Label>
                    )}
                    {renderField(field)}
                  </div>
                ))}
                <Button type="submit" className="w-full">
                  Add Unit
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Select a squad to add units
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column - Squads List */}
        <div className="space-y-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Squad
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Squad</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="squadName">Squad Name</Label>
                  <Input
                    id="squadName"
                    value={newSquadName}
                    onChange={(e) => setNewSquadName(e.target.value)}
                    placeholder="Enter squad name"
                  />
                </div>
                <Button onClick={handleAddSquad}>Create Squad</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Card>
            <CardHeader>
              <CardTitle>Squads</CardTitle>
              <CardDescription>Your army composition</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Squad Name</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {squads.map((squad) => (
                    <TableRow 
                      key={squad.id}
                      className={selectedSquad === squad.id ? "bg-muted" : ""}
                      onClick={() => setSelectedSquad(squad.id)}
                    >
                      <TableCell className="font-medium">{squad.name}</TableCell>
                      <TableCell>{squad.units.length}</TableCell>
                      <TableCell>{calculateSquadPoints(squad)}pts</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Add squad deletion logic here if needed
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {squads.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No squads created yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Units List for Selected Squad */}
          {selectedSquadData && selectedSquadData.units.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Units in {selectedSquadData.name}</CardTitle>
                <CardDescription>Total Points: {calculateSquadPoints(selectedSquadData)}pts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {squadFields
                        .filter(field => field.type !== "switch")
                        .map(field => (
                          <TableHead key={field.id}>{field.label}</TableHead>
                        ))}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSquadData.units.map((unit) => (
                      <TableRow key={unit.id}>
                        {squadFields
                          .filter(field => field.type !== "switch")
                          .map(field => (
                            <TableCell key={field.id}>
                              {field.type === "select" 
                                ? field.options
                                    .flatMap(group => group.items)
                                    .find(item => item.value === unit[field.id])?.label || unit[field.id]
                                : unit[field.id]}
                            </TableCell>
                          ))}
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteUnit(selectedSquadData.id, unit.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
