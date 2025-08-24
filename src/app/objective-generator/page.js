"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Download, Upload, FileText } from "lucide-react";
import jsPDF from "jspdf";

export default function ObjectiveGenerator() {
  const [objectives, setObjectives] = useState([]);
  const [objectiveForm, setObjectiveForm] = useState({
    title: "",
    objectives: [
      {
        objective: "",
        victoryPoints: ""
      }
    ]
  });

  const handleAddObjective = (e) => {
    e.preventDefault();
    // Check if at least one objective has content and VP
    const validObjectives = objectiveForm.objectives.filter(obj =>
      obj.objective.trim() && obj.victoryPoints.trim()
    );

    if (validObjectives.length > 0) {
      const newObjective = {
        id: Date.now(),
        title: objectiveForm.title.trim() || `Objective ${objectives.length + 1}`,
        objectives: validObjectives.map(obj => ({
          objective: obj.objective.trim(),
          victoryPoints: parseInt(obj.victoryPoints) || 0
        }))
      };
      setObjectives([...objectives, newObjective]);
      setObjectiveForm({
        title: "",
        objectives: [{ objective: "", victoryPoints: "" }]
      });
    }
  };

  const handleDeleteObjective = (id) => {
    setObjectives(objectives.filter(obj => obj.id !== id));
  };

  const handleInputChange = (field, value) => {
    setObjectiveForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleObjectiveChange = (index, field, value) => {
    setObjectiveForm(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) =>
        i === index ? { ...obj, [field]: value } : obj
      )
    }));
  };

  const handleAddObjectiveField = () => {
    setObjectiveForm(prev => ({
      ...prev,
      objectives: [...prev.objectives, { objective: "", victoryPoints: "" }]
    }));
  };

  const handleRemoveObjectiveField = (index) => {
    if (objectiveForm.objectives.length > 1) {
      setObjectiveForm(prev => ({
        ...prev,
        objectives: prev.objectives.filter((_, i) => i !== index)
      }));
    }
  };

  const handleExportJSON = () => {
    const objectivesData = {
      objectives: objectives,
      exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(objectivesData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `objectives_${new Date().toISOString().split('T')[0]}.json`;

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
          // Handle both old format (array) and new format (object with objectives property)
          const importedObjectives = data.objectives || data;
          if (Array.isArray(importedObjectives)) {
            // Add title field and handle objectives array for backward compatibility
            const objectivesWithTitles = importedObjectives.map((obj, index) => {
              // Handle old format (single objective) vs new format (objectives array)
              if (obj.objective && !obj.objectives) {
                // Old format - convert to new format
                return {
                  ...obj,
                  title: obj.title || `Objective ${index + 1}`,
                  objectives: [{
                    objective: obj.objective,
                    victoryPoints: obj.victoryPoints || 0
                  }]
                };
              } else if (obj.objectives) {
                // New format - just ensure title exists
                return {
                  ...obj,
                  title: obj.title || `Objective ${index + 1}`
                };
              } else {
                // Fallback for any other format
                return {
                  ...obj,
                  title: obj.title || `Objective ${index + 1}`,
                  objectives: [{
                    objective: obj.objective || "Unknown objective",
                    victoryPoints: obj.victoryPoints || 0
                  }]
                };
              }
            });
            setObjectives(objectivesWithTitles);
          } else {
            throw new Error("Invalid file format");
          }
        } catch (error) {
          alert("Error importing file. Please make sure it is a valid objectives file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportPDF = () => {
    if (objectives.length === 0) {
      alert("No objectives to export. Please create some objectives first.");
      return;
    }

    const doc = new jsPDF({ unit: "mm", format: "a4" });

    // Add the actual Bevan font
    try {
      doc.addFont('/fonts/Bevan-Regular.ttf', 'Bevan', 'normal');
      doc.addFont('/fonts/Bevan-Italic.ttf', 'Bevan', 'italic');
    } catch (error) {
      console.log('Bevan font not available, using fallback');
    }
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const cardWidth = 60;
    const cardsPerRow = 3;
    const cardsPerCol = 3;
    const cardsPerPage = cardsPerRow * cardsPerCol;

    // Calculate dynamic card height based on longest content
    let maxCardHeight = 50; // Increased minimum height
    objectives.forEach((objective) => {
      const objectivesList = objective.objectives || [{ objective: objective.objective, victoryPoints: objective.victoryPoints }];
      const maxWidth = cardWidth - 6;
      let totalHeight = 20; // Base height for title and spacing

      objectivesList.forEach((obj) => {
        // Split text into lines that fit the card
        const words = obj.objective.split(' ');
        let lines = [];
        let currentLine = '';

        words.forEach(word => {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const textWidth = doc.getTextWidth(testLine);
          if (textWidth <= maxWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              lines.push(word);
            }
          }
        });
        if (currentLine) {
          lines.push(currentLine);
        }

        // Calculate height for this objective
        const textHeight = Math.min(lines.length, 2) * 4; // 4mm per line, max 2 lines
        totalHeight += textHeight + 12; // Add space between objectives
      });

      // Add space for VP box if single objective
      if (objectivesList.length === 1) {
        totalHeight += 8;
      }

      maxCardHeight = Math.max(maxCardHeight, totalHeight);
    });

    const cardHeight = maxCardHeight;

    let currentPage = 0;
    let cardIndex = 0;

    objectives.forEach((objective, index) => {
      if (cardIndex % cardsPerPage === 0) {
        if (currentPage > 0) {
          doc.addPage();
        }
        currentPage++;
      }

      const row = Math.floor((cardIndex % cardsPerPage) / cardsPerRow);
      const col = cardIndex % cardsPerRow;

      const x = margin + col * (cardWidth + 5);
      const y = margin + row * (cardHeight + 5);

      // Draw card border with corner decorations
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);

      // Main card border
      doc.rect(x, y, cardWidth, cardHeight);

      // Corner decorations (small extensions)
      const cornerSize = 2;
      // Top-left corner
      doc.line(x - cornerSize, y, x, y);
      doc.line(x, y - cornerSize, x, y);
      // Top-right corner
      doc.line(x + cardWidth, y, x + cardWidth + cornerSize, y);
      doc.line(x + cardWidth, y - cornerSize, x + cardWidth, y);
      // Bottom-left corner
      doc.line(x - cornerSize, y + cardHeight, x, y + cardHeight);
      doc.line(x, y + cardHeight, x, y + cardHeight + cornerSize);
      // Bottom-right corner
      doc.line(x + cardWidth, y + cardHeight, x + cardWidth + cornerSize, y + cardHeight);
      doc.line(x + cardWidth, y + cardHeight, x + cardWidth, y + cardHeight + cornerSize);

      // Draw circular emblem in top-left - fixed positioning to not spill out
      const emblemX = x + 5;
      const emblemY = y + 5;
      const emblemRadius = 3.5;
      doc.setFillColor(0);
      doc.circle(emblemX, emblemY, emblemRadius, 'F');

      // Add number to emblem - properly centered both horizontally and vertically with Bevan font
      doc.setTextColor(255);
      doc.setFontSize(10);
      doc.setFont("Bevan", "normal");
      const cardNumber = (index + 1).toString().padStart(2, '0');
      // Center the text in the circle both horizontally and vertically
      const textWidth = doc.getTextWidth(cardNumber);
      const textX = emblemX - (textWidth / 2);
      const textY = emblemY + 1.0; // Move down by 0.5mm
      doc.text(cardNumber, textX, textY);

      // Draw title bar
      const titleBarY = y + 10;
      doc.setDrawColor(0);
      doc.setLineWidth(0.2);
      doc.line(x + 10, titleBarY, x + cardWidth - 3, titleBarY);

      // Add title text - significantly increased font size with Bevan font
      doc.setTextColor(0);
      doc.setFontSize(10);
      doc.setFont("Bevan", "normal");
      const title = objective.title || `Objective ${index + 1}`;
      doc.text(title, x + 12, titleBarY - 1);

      // Add objective text - significantly increased font size with Bevan font
      doc.setFontSize(9);
      doc.setFont("Bevan", "normal");
      const textX2 = x + 3;
      const textY2 = y + 20;
      const maxWidth = cardWidth - 6;

      // Handle multiple objectives
      const objectivesList = objective.objectives || [{ objective: objective.objective, victoryPoints: objective.victoryPoints }];
      let currentY = textY2;

      objectivesList.forEach((obj, objIndex) => {
        // Split text into lines that fit the card
        const words = obj.objective.split(' ');
        let lines = [];
        let currentLine = '';

        words.forEach(word => {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const textWidth = doc.getTextWidth(testLine);
          if (textWidth <= maxWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              lines.push(word);
            }
          }
        });
        if (currentLine) {
          lines.push(currentLine);
        }

        // Draw text lines - increased line spacing for larger font
        lines.slice(0, 2).forEach((line, lineIndex) => {
          doc.text(line, textX2, currentY + (lineIndex * 4));
        });

        // Add VP for this objective if there are multiple objectives
        if (objectivesList.length > 1) {
          const vpText = `${obj.victoryPoints}VP`;
          const vpTextWidth = doc.getTextWidth(vpText);
          doc.text(vpText, x + cardWidth - 3 - vpTextWidth, currentY + 8);
        }

        currentY += 12; // Space between objectives
      });

      // Add main VP box in bottom-right (only for single objectives)
      if (objectivesList.length === 1) {
        const vpBoxX = x + cardWidth - 12;
        const vpBoxY = y + cardHeight - 8;
        doc.setDrawColor(0);
        doc.setLineWidth(0.3);
        doc.rect(vpBoxX, vpBoxY, 10, 6);

        // Add VP text - significantly increased font size with Bevan font
        doc.setFontSize(9);
        doc.setFont("Bevan", "normal");
        doc.text(`${objectivesList[0].victoryPoints}VP`, vpBoxX + 1, vpBoxY + 3.5);
      }

      cardIndex++;
    });

    doc.save(`objectives_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <main className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="space-y-2 w-full md:w-auto">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
            Objective Card Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Create custom objective cards for your BrikWars missions
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {objectives.length > 0 && (
            <>
              <Button
                onClick={handleExportJSON}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                <Download className="mr-2 h-4 w-4" />
                Export JSON
              </Button>
              <Button
                onClick={handleExportPDF}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                <FileText className="mr-2 h-4 w-4" />
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
              id="import-objectives-file"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("import-objectives-file").click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Objectives
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Objective</CardTitle>
            <CardDescription>
              Create a new objective card with description and victory points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddObjective} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Card Title (Optional)</Label>
                <Input
                  id="title"
                  placeholder={`Objective ${objectives.length + 1}`}
                  value={objectiveForm.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>Objectives</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddObjectiveField}
                    className="h-8"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Objective
                  </Button>
                </div>

                {objectiveForm.objectives.map((obj, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg bg-muted/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Objective {index + 1}</span>
                      {objectiveForm.objectives.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveObjectiveField(index)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor={`objective-${index}`}>Description</Label>
                      <Textarea
                        id={`objective-${index}`}
                        placeholder="Enter the objective description..."
                        value={obj.objective}
                        onChange={(e) => handleObjectiveChange(index, "objective", e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`victoryPoints-${index}`}>Victory Points (VP)</Label>
                      <Input
                        id={`victoryPoints-${index}`}
                        type="number"
                        min="1"
                        placeholder="Enter victory points..."
                        value={obj.victoryPoints}
                        onChange={(e) => handleObjectiveChange(index, "victoryPoints", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Objective
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Objective Cards Preview</CardTitle>
            <CardDescription>
              {objectives.length > 0
                ? `${objectives.length} objective card${objectives.length !== 1 ? 's' : ''} created`
                : "No objective cards created yet"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {objectives.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {objectives.map((obj, index) => (
                  <Card key={obj.id} className="relative border-2 border-border bg-gradient-to-br from-card to-card/50 shadow-sm hover:shadow-md transition-all duration-200 min-h-[140px] group">
                    {/* Corner decorations */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-muted-foreground/30"></div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-muted-foreground/30"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-muted-foreground/30"></div>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-muted-foreground/30"></div>

                    <CardContent className="p-3 relative">
                      {/* Circular emblem */}
                      <div className="absolute top-2 left-2 w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                        <span className="text-background text-xs font-bold" style={{ fontFamily: 'var(--font-bevan)' }}>
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                      </div>

                      {/* Title bar */}
                      <div className="ml-8 mb-2">
                        <div className="h-0.5 bg-muted-foreground/30 mb-1"></div>
                        <h4 className="text-xs font-bold text-foreground" style={{ fontFamily: 'var(--font-bevan)' }}>
                          {obj.title || `Objective ${index + 1}`}
                        </h4>
                      </div>

                      {/* Objective text */}
                      <div className="mt-4 mb-8">
                        {obj.objectives ? (
                          // New format with multiple objectives
                          <div className="space-y-3">
                            {obj.objectives.map((objective, objIndex) => (
                              <div key={objIndex} className="space-y-2">
                                <p className="text-xs leading-tight line-clamp-2 text-foreground/80">
                                  {objective.objective}
                                </p>
                                {obj.objectives.length > 1 && (
                                  <div className="flex justify-end">
                                    <span className="text-xs font-bold text-foreground/60 bg-muted px-1 rounded" style={{ fontFamily: 'var(--font-bevan)' }}>
                                      {objective.victoryPoints}VP
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          // Old format with single objective
                          <p className="text-xs leading-tight line-clamp-4 text-foreground/80">
                            {obj.objective}
                          </p>
                        )}
                      </div>

                      {/* VP box - only show for single objectives */}
                      {(!obj.objectives || obj.objectives.length === 1) && (
                        <div className="absolute bottom-2 right-2 border border-border bg-muted px-1.5 py-0.5 rounded">
                          <span className="text-xs font-bold text-foreground" style={{ fontFamily: 'var(--font-bevan)' }}>
                            {obj.objectives ?
                              obj.objectives[0].victoryPoints + 'VP' :
                              obj.victoryPoints + 'VP'
                            }
                          </span>
                        </div>
                      )}

                      {/* Delete button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteObjective(obj.id)}
                        className="absolute top-1 right-1 h-5 w-5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Create your first objective card using the form
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
