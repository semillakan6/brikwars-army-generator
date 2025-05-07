"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Download, Upload } from "lucide-react";
import { useState } from "react";
import { squadFields } from "@/config/squad-fields";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { weaponTypes } from "@/config/weapons";
import React from "react";
import PowerIcon from "@/assets/icons/power.svg";
import SizeIcon from "@/assets/icons/size.svg";
import ValueIcon from "@/assets/icons/value.svg";
import ArmorIcon from "@/assets/icons/armour.svg";
import ActionIcon from "@/assets/icons/mind.svg";
import MoveRangeIcon from "@/assets/icons/move_range.svg";

export default function Home() {
  const [armyName, setArmyName] = useState("");
  const [armyRules, setArmyRules] = useState("");
  const [squads, setSquads] = useState([]);
  const [newSquadName, setNewSquadName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [weaponForm, setWeaponForm] = useState({
    type: "",
    size: 1,
    amount: 1,
    name: "",
    use: 0,
    range: 0,
    damage: "",
  });
  const [showBastardWeapons, setShowBastardWeapons] = useState(false);

  // Initialize unit form with default values from squadFields
  const initialUnitForm = squadFields.reduce((acc, field) => {
    acc[field.id] = field.type === "switch" ? false : "";
    return acc;
  }, {});

  const [unitForm, setUnitForm] = useState(initialUnitForm);

  const handleAddSquad = () => {
    if (newSquadName.trim()) {
      const newSquad = {
        name: newSquadName,
        units: [],
        id: Date.now(),
      };
      setSquads([...squads, newSquad]);
      setNewSquadName("");
      setIsDialogOpen(false);
      setSelectedSquad(newSquad.id);
    }
  };

  const handleDeleteSquad = (squadId) => {
    setSquads(squads.filter((squad) => squad.id !== squadId));
    if (selectedSquad === squadId) {
      setSelectedSquad(null);
      setSelectedUnit(null);
    }
  };

  const handleAddUnit = (e) => {
    e.preventDefault();
    if (!selectedSquad) return;

    const newUnit = {
      ...unitForm,
      id: Date.now(),
      weapons: [], // Initialize empty weapons array
    };

    const updatedSquads = squads.map((squad) => {
      if (squad.id === selectedSquad) {
        return {
          ...squad,
          units: [...squad.units, newUnit],
        };
      }
      return squad;
    });
    setSquads(updatedSquads);
    setUnitForm(initialUnitForm);
    setSelectedUnit(newUnit.id); // Select the newly created unit
  };

  const handleUpdateUnit = (e) => {
    e.preventDefault();
    if (!selectedSquad || !selectedUnit) return;

    const updatedSquads = squads.map((squad) => {
      if (squad.id === selectedSquad) {
        return {
          ...squad,
          units: squad.units.map((unit) =>
            unit.id === selectedUnit ? { ...unitForm, id: unit.id } : unit
          ),
        };
      }
      return squad;
    });
    setSquads(updatedSquads);
    setUnitForm(initialUnitForm);
    setSelectedUnit(null);
  };

  const handleDeleteUnit = (squadId, unitId) => {
    const updatedSquads = squads.map((squad) => {
      if (squad.id === squadId) {
        return {
          ...squad,
          units: squad.units.filter((unit) => unit.id !== unitId),
        };
      }
      return squad;
    });
    setSquads(updatedSquads);
    if (selectedUnit === unitId) {
      setSelectedUnit(null);
      setUnitForm(initialUnitForm);
    }
  };

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit.id);
    // Ensure all fields have defined values by merging with initialUnitForm
    setUnitForm({
      ...initialUnitForm,
      ...unit,
    });
  };

  const handleUnselectUnit = () => {
    setSelectedUnit(null);
    setUnitForm(initialUnitForm);
  };

  // Calculate total points for a unit
  const calculateUnitPoints = (unit) => {
    return parseInt(unit.value || 0);
  };

  // Calculate total points for a squad
  const calculateSquadPoints = (squad) => {
    return squad.units.reduce(
      (total, unit) => total + (calculateUnitPoints(unit) * (parseInt(unit.unit_number) || 1)),
      0
    );
  };

  // Calculate total army points
  const calculateTotalPoints = () => {
    return squads.reduce(
      (total, squad) => total + calculateSquadPoints(squad),
      0
    );
  };

  const calculateWeaponStats = (weaponType, size) => {
    const type = weaponTypes.find((w) => w.name === weaponType);
    if (!type) return { use: 0, range: 0, damage: "" };

    const use = type.sizeUse * size + type.baseUse;
    const range = type.sizeRange * size + type.baseRange;
    const damage = type.damageMulSize ? `${size}${type.damage}` : type.damage;

    return { use, range, damage };
  };

  const handleWeaponTypeChange = (type) => {
    const selectedWeapon = weaponTypes.find(w => w.name === type);
    const stats = calculateWeaponStats(type, selectedWeapon?.size || weaponForm.size);
    setWeaponForm({
      ...weaponForm,
      type,
      size: selectedWeapon?.size || weaponForm.size,
      use: stats.use,
      range: stats.range,
      damage: stats.damage,
    });
  };

  const handleWeaponSizeChange = (size) => {
    const selectedWeapon = weaponTypes.find(w => w.name === weaponForm.type);
    if (selectedWeapon?.size) return; // Don't allow size change for fixed size weapons
    const stats = calculateWeaponStats(weaponForm.type, size);
    setWeaponForm({
      ...weaponForm,
      size,
      use: stats.use,
      range: stats.range,
      damage: stats.damage,
    });
  };

  const handleAddWeapon = (e) => {
    e.preventDefault();
    if (!selectedSquad || !selectedUnit) return;

    const updatedSquads = squads.map((squad) => {
      if (squad.id === selectedSquad) {
        return {
          ...squad,
          units: squad.units.map((unit) => {
            if (unit.id === selectedUnit) {
              return {
                ...unit,
                weapons: [
                  ...(unit.weapons || []),
                  { ...weaponForm, id: Date.now() },
                ],
              };
            }
            return unit;
          }),
        };
      }
      return squad;
    });
    setSquads(updatedSquads);
    setWeaponForm({
      type: "",
      size: 1,
      amount: 1,
      name: "",
      use: 0,
      range: 0,
      damage: "",
    });
  };

  const handleDeleteWeapon = (weaponId) => {
    if (!selectedSquad || !selectedUnit) return;

    const updatedSquads = squads.map((squad) => {
      if (squad.id === selectedSquad) {
        return {
          ...squad,
          units: squad.units.map((unit) => {
            if (unit.id === selectedUnit) {
              return {
                ...unit,
                weapons: unit.weapons.filter((w) => w.id !== weaponId),
              };
            }
            return unit;
          }),
        };
      }
      return squad;
    });
    setSquads(updatedSquads);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 32;
    let y = 48;
    const lineHeight = 18;
    const cardPadding = 12;
    const cardSpacing = 18;
    const tableHeaderBg = [240, 240, 240];
    const tableHeaderText = 40;
    const cardBg = [252, 252, 252];
    const cardBorder = [200, 200, 200];

    // --- HEADER ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(30, 30, 30);
    doc.text(`${armyName || 'Unnamed Army'} • ${calculateTotalPoints()}pts`, margin, y);
    y += lineHeight + 6;

    // --- SQUADS/UNITS ---
    squads.forEach((squad) => {
      // Card background
      const cardStartY = y;
      let cardHeight = 0;
      let cardContentY = y + cardPadding + 2;
      const squadPoints = calculateSquadPoints(squad);

      // Squad header
      doc.setFillColor(...cardBg);
      doc.setDrawColor(...cardBorder);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 0, 8, 8, 'F'); // Height 0 for now, will fill later
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(30, 30, 30);
      doc.text(`${squad.name} [${squad.units.length}] • ${squadPoints}pts`, margin + cardPadding, cardContentY);
      cardContentY += lineHeight;

      // Units
      squad.units.forEach((unit) => {
        // Unit name and keywords
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text(`${unit.name || 'Unit'}${unit.unit_number ? ` [${unit.unit_number}]` : ''}`, margin + cardPadding + 8, cardContentY);
        cardContentY += lineHeight - 2;
        // Keywords (from switches)
        const keywords = squadFields.filter(f => f.type === 'switch' && f.id !== 'isMinifigure' && unit[f.id]).map(f => f.label).join(', ');
        if (keywords) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(keywords, margin + cardPadding + 16, cardContentY);
          cardContentY += 13;
        }
        // --- UNIT STATS TABLE ---
        const statFields = squadFields.filter(f => f.type !== 'switch' && f.id !== 'equipment');
        const statLabels = statFields.map(f => f.label);
        const statValues = statFields.map(f => {
          if (f.type === 'select') {
            const selectedOption = f.options.flatMap(g => g.items).find(i => i.value === unit[f.id]);
            return selectedOption ? selectedOption.label : unit[f.id];
          }
          return unit[f.id] || '';
        });
        autoTable(doc, {
          startY: cardContentY,
          head: [statLabels],
          body: [statValues],
          theme: 'grid',
          headStyles: {
            fillColor: tableHeaderBg,
            textColor: tableHeaderText,
            fontStyle: 'bold',
            fontSize: 9,
          },
          styles: {
            fontSize: 9,
            textColor: 60,
            cellPadding: 2.5,
            halign: 'center',
            valign: 'middle',
            lineColor: 220,
            lineWidth: 0.1,
          },
          margin: { left: margin + cardPadding + 8, right: margin + cardPadding + 8 },
        });
        let lastTableY = doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY + 2 : cardContentY + 24;
        cardContentY = lastTableY;
        // --- WEAPONS TABLE ---
        if (unit.weapons?.length > 0) {
          const weaponsData = unit.weapons.map((weapon) => [
            weapon.name || weapon.type,
            weapon.size,
            weapon.amount,
            weapon.use,
            weapon.range,
            weapon.damage,
          ]);
          autoTable(doc, {
            startY: cardContentY,
            head: [["Weapon", "Size", "Amount", "Use", "Range", "Damage"]],
            body: weaponsData,
            theme: 'grid',
            headStyles: {
              fillColor: tableHeaderBg,
              textColor: tableHeaderText,
              fontStyle: 'bold',
              fontSize: 8,
            },
            styles: {
              fontSize: 8,
              textColor: 80,
              cellPadding: 2,
              lineColor: 220,
              lineWidth: 0.1,
            },
            margin: { left: margin + cardPadding + 24, right: margin + cardPadding + 8 },
          });
          lastTableY = doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY + 2 : cardContentY + 20;
        }
        // Always set cardContentY to the max of itself and lastTableY
        cardContentY = Math.max(cardContentY, lastTableY);
        cardContentY += 10;
      });
      // Draw card border with correct height
      cardHeight = cardContentY - cardStartY + cardPadding;
      doc.setDrawColor(...cardBorder);
      doc.roundedRect(margin, cardStartY, pageWidth - margin * 2, cardHeight, 8, 8);
      y = cardStartY + cardHeight + cardSpacing;
      // Add new page if close to bottom
      if (y > doc.internal.pageSize.getHeight() - 120) {
        doc.addPage();
        y = 48;
      }
    });

    // --- SPECIAL RULES SECTION (at end) ---
    if (armyRules.trim()) {
      y += 16;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text('Special Rules', margin, y);
      y += lineHeight;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60);
      // Bold rule names if formatted as "Name: Description"
      const rulesLines = armyRules.split(/\n|\r/).filter(Boolean);
      rulesLines.forEach(line => {
        const match = line.match(/^(\w[\w\s\-\(\)]+):\s*(.*)$/);
        if (match) {
          doc.setFont('helvetica', 'bold');
          doc.text(match[1] + ':', margin, y);
          doc.setFont('helvetica', 'normal');
          doc.text(match[2], margin + 60, y);
        } else {
          doc.setFont('helvetica', 'normal');
          doc.text(line, margin, y);
        }
        y += 14;
      });
    }

    doc.save(`${armyName || 'army'}_list.pdf`);
  };

  const handleExportJSON = () => {
    const armyData = {
      name: armyName,
      rules: armyRules,
      squads: squads,
    };
    const dataStr = JSON.stringify(armyData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${armyName || "army"}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImportJSON = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setArmyName(data.name || "");
          setArmyRules(data.rules || "");
          setSquads(data.squads || []);
        } catch (error) {
          alert(
            "Error importing file. Please make sure it is a valid army file."
          );
        }
      };
      reader.readAsText(file);
    }
  };

  const selectedSquadData = squads.find((squad) => squad.id === selectedSquad);

  const renderLabel = (field) => {
    const getIcon = () => {
      switch (field.icon) {
        case "/icons/power.svg":
          return <PowerIcon className="w-4 h-4" />;
        case "/icons/size.svg":
          return <SizeIcon className="w-4 h-4" />;
        case "/icons/armour.svg":
          return <ArmorIcon className="w-4 h-4" />;
        case "/icons/mind.svg":
          return <ActionIcon className="w-4 h-4" />;
        case "/icons/value.svg":
          return <ValueIcon className="w-4 h-4" />;
        case "/icons/move_range.svg":
          return <MoveRangeIcon className="w-4 h-4" />;
        default:
          return null;
      }
    };

    return (
      <div className="flex items-center gap-2">
        {field.icon && getIcon()}
        <span>{field.label}</span>
      </div>
    );
  };
  
  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "number":
        return (
          <div className="flex flex-col gap-1">
            <Label htmlFor={field.id}>{renderLabel(field)}</Label>
            <Input
              type={field.type}
              id={field.id}
              value={field.id === "power" && unitForm.isMinifigure ? "1" : unitForm[field.id]}
              onChange={(e) =>
                setUnitForm({ ...unitForm, [field.id]: e.target.value })
              }
              placeholder={field.placeholder}
              required={field.required}
              disabled={field.id === "power" && unitForm.isMinifigure}
            />
          </div>
        );
      case "switch":
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={unitForm[field.id]}
              onCheckedChange={(checked) => {
                setUnitForm({ 
                  ...unitForm, 
                  [field.id]: checked,
                  // When isMinifigure is toggled on, set power to 1
                  ...(field.id === "isMinifigure" && checked ? { power: "1" } : {})
                });
              }}
            />
            <Label>{renderLabel(field)}</Label>
          </div>
        );
      case "select":
        return (
          <div className="flex flex-col gap-1">
            <Label htmlFor={field.id}>{renderLabel(field)}</Label>
            <Select
              value={unitForm[field.id]}
              onValueChange={(value) =>
                setUnitForm({ ...unitForm, [field.id]: value })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={`Select ${field.label.toLowerCase()}`}
                />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((group) => (
                  <SelectGroup key={group.group}>
                    <SelectLabel>{group.group}</SelectLabel>
                    {group.items.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };
  

  return (
    <main className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="space-y-2 w-full md:w-auto">
          <div className="flex items-center justify-between gap-4">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Army List Builder - Total Points: {calculateTotalPoints()}Ü
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex flex-col gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-4">
                <Label htmlFor="armyName">Army Name:</Label>
                <Input
                  id="armyName"
                  value={armyName}
                  onChange={(e) => setArmyName(e.target.value)}
                  placeholder="Enter army name"
                  className="w-full sm:w-64"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="armyRules">Army Special Rules:</Label>
                <textarea
                  id="armyRules"
                  value={armyRules}
                  onChange={(e) => setArmyRules(e.target.value)}
                  placeholder="Enter any special rules for your army"
                  className="w-full min-h-[100px] p-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {squads.length > 0 && (
            <>
              <Button onClick={handleExportJSON} variant="outline" className="flex-1 sm:flex-none">
                <Download className="mr-2 h-4 w-4" />
                Export Army
              </Button>
              <Button onClick={handleExportPDF} className="flex-1 sm:flex-none">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </>
          )}
          <div className="relative flex-1 sm:flex-none">
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
              id="import-file"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("import-file").click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Army
            </Button>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 ${selectedUnit ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
        {/* Left Column - Unit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Unit Management</CardTitle>
            <CardDescription>
              {selectedSquadData
                ? selectedUnit
                  ? `Edit unit in ${selectedSquadData.name}`
                  : `Add new unit to ${selectedSquadData.name}`
                : "Select a squad to add units"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSquadData ? (
              <div className="space-y-6">
                <form
                  onSubmit={selectedUnit ? handleUpdateUnit : handleAddUnit}
                  className="space-y-4"
                >
                  {squadFields
                    .filter((field) => field.id !== "equipment")
                    .map((field) => (
                      <div key={field.id} className="space-y-2">
                        {renderField(field)}
                      </div>
                    ))}

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {selectedUnit ? "Update Unit" : "Add Unit"}
                    </Button>
                    {selectedUnit && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleUnselectUnit}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Select a squad to add units
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Middle Column - Squads and Units List */}
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
                      <TableCell className="font-medium">
                        {squad.name}
                      </TableCell>
                      <TableCell>{squad.units.length}</TableCell>
                      <TableCell>{calculateSquadPoints(squad)}Ü</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSquad(squad.id);
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
          {selectedSquadData && (
            <Card>
              <CardHeader>
                <CardTitle>Units in {selectedSquadData.name}</CardTitle>
                <CardDescription>
                  Total Points: {calculateSquadPoints(selectedSquadData)}Ü
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {squadFields
                        .filter(
                          (field) =>
                            field.type !== "switch" && field.id !== "equipment"
                        )
                        .map((field) => (
                          <TableHead key={field.id}>{field.label}</TableHead>
                        ))}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSquadData.units.map((unit) => (
                      <React.Fragment key={unit.id}>
                        <TableRow
                          className={selectedUnit === unit.id ? "bg-muted" : ""}
                          onClick={() => handleUnitClick(unit)}
                        >
                          {squadFields
                            .filter(
                              (field) =>
                                field.type !== "switch" &&
                                field.id !== "equipment"
                            )
                            .map((field) => (
                              <TableCell key={field.id}>
                                {field.type === "select"
                                  ? field.options
                                      .flatMap((group) => group.items)
                                      .find(
                                        (item) => item.value === unit[field.id]
                                      )?.label || unit[field.id]
                                  : unit[field.id]}
                              </TableCell>
                            ))}
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUnit(selectedSquadData.id, unit.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        {unit.weapons?.length > 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={
                                squadFields.filter(
                                  (field) =>
                                    field.type !== "switch" &&
                                    field.id !== "equipment"
                                ).length + 1
                              }
                            >
                              <div className="pl-4">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Weapon</TableHead>
                                      <TableHead>Size</TableHead>
                                      <TableHead>Amount</TableHead>
                                      <TableHead>Use</TableHead>
                                      <TableHead>Range</TableHead>
                                      <TableHead>Damage</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {unit.weapons.map((weapon) => (
                                      <TableRow key={weapon.id}>
                                        <TableCell>
                                          {weapon.name || weapon.type}
                                        </TableCell>
                                        <TableCell>{weapon.size}</TableCell>
                                        <TableCell>{weapon.amount}</TableCell>
                                        <TableCell>{weapon.use}</TableCell>
                                        <TableCell>{weapon.range}</TableCell>
                                        <TableCell>{weapon.damage}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Weapon Form */}
        {selectedUnit && (
          <Card>
            <CardHeader>
              <CardTitle>Weapon Management</CardTitle>
              <CardDescription>
                Add weapons to the selected unit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddWeapon} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Switch
                    checked={showBastardWeapons}
                    onCheckedChange={setShowBastardWeapons}
                  />
                  <Label>Show Bastard Weapons</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weaponType">Type</Label>
                    <Select
                      id="weaponType"
                      value={weaponForm.type}
                      onValueChange={handleWeaponTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select weapon type" />
                      </SelectTrigger>
                      <SelectContent>
                        {weaponTypes
                          .filter(weapon => 
                            (showBastardWeapons && weapon.category === "Bastard") || 
                            (!showBastardWeapons && weapon.category !== "Bastard")
                          )
                          .map((weapon) => (
                            <SelectItem
                              key={weapon.name}
                              value={weapon.name}
                            >
                              {weapon.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weaponSize">Size</Label>
                    <Input
                      id="weaponSize"
                      type="number"
                      min="1"
                      value={weaponForm.size}
                      onChange={(e) =>
                        handleWeaponSizeChange(parseInt(e.target.value))
                      }
                      disabled={weaponTypes.find(w => w.name === weaponForm.type)?.size !== undefined}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weaponAmount">Amount</Label>
                    <Input
                      id="weaponAmount"
                      type="number"
                      min="1"
                      value={weaponForm.amount}
                      onChange={(e) =>
                        setWeaponForm({
                          ...weaponForm,
                          amount: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weaponName">Name</Label>
                    <Input
                      id="weaponName"
                      value={weaponForm.name}
                      onChange={(e) =>
                        setWeaponForm({
                          ...weaponForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="Custom name (optional)"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weaponUse">Use</Label>
                    <Input
                      id="weaponUse"
                      type="number"
                      value={weaponForm.use}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weaponRange">Range</Label>
                    <Input 
                      id="weaponRange"
                      value={weaponForm.range} 
                      disabled 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weaponDamage">Damage</Label>
                    <Input 
                      id="weaponDamage"
                      value={weaponForm.damage} 
                      disabled 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Add Weapon
                </Button>
              </form>

              <div className="space-y-2 mt-4">
                <h4 className="font-medium">Current Weapons</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">
                        Actions
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Use</TableHead>
                      <TableHead>Range</TableHead>
                      <TableHead>Damage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSquadData.units
                      .find((u) => u.id === selectedUnit)
                      ?.weapons?.map((weapon) => (
                        <TableRow key={weapon.id}>
                        <TableCell className="text-left">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDeleteWeapon(weapon.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                          <TableCell>
                            {weapon.name || weapon.type}
                          </TableCell>
                          <TableCell>{weapon.type}</TableCell>
                          <TableCell>{weapon.size}</TableCell>
                          <TableCell>{weapon.amount}</TableCell>
                          <TableCell>{weapon.use}</TableCell>
                          <TableCell>{weapon.range}</TableCell>
                          <TableCell>{weapon.damage}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
