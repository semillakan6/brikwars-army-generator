"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Shuffle, RefreshCw, Download, FileText } from "lucide-react";
import jsPDF from "jspdf";

export default function ObjectiveDealer() {
  const [allObjectives, setAllObjectives] = useState([]);
  const [selectedObjectives, setSelectedObjectives] = useState([]);
  const [cardsToSelect, setCardsToSelect] = useState("");
  const [isDealing, setIsDealing] = useState(false);

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
            setAllObjectives(objectivesWithTitles);
            setSelectedObjectives([]); // Reset selected cards when importing new deck
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

  const handleDealCards = () => {
    if (!cardsToSelect || cardsToSelect <= 0) {
      alert("Please enter a valid number of cards to select.");
      return;
    }

    if (parseInt(cardsToSelect) > allObjectives.length) {
      alert(`Cannot select ${cardsToSelect} cards from a deck of ${allObjectives.length} cards.`);
      return;
    }

    setIsDealing(true);
    
    // Simulate dealing animation
    setTimeout(() => {
      const shuffled = [...allObjectives].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, parseInt(cardsToSelect));
      setSelectedObjectives(selected);
      setIsDealing(false);
    }, 500);
  };

  const handleReshuffle = () => {
    if (selectedObjectives.length === 0) {
      alert("No cards to reshuffle. Please deal some cards first.");
      return;
    }

    setIsDealing(true);
    
    setTimeout(() => {
      const shuffled = [...allObjectives].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, selectedObjectives.length);
      setSelectedObjectives(selected);
      setIsDealing(false);
    }, 500);
  };

  const handleExportSelectedPDF = () => {
    if (selectedObjectives.length === 0) {
      alert("No selected objectives to export. Please deal some cards first.");
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
     selectedObjectives.forEach((objective) => {
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

    selectedObjectives.forEach((objective, index) => {
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

      // Draw circular emblem in top-left
      const emblemX = x + 5;
      const emblemY = y + 5;
      const emblemRadius = 3.5;
      doc.setFillColor(0);
      doc.circle(emblemX, emblemY, emblemRadius, 'F');
      
      // Add number to emblem
      doc.setTextColor(255);
      doc.setFontSize(10);
      doc.setFont("Bevan", "normal");
      const cardNumber = (index + 1).toString().padStart(2, '0');
      const textWidth = doc.getTextWidth(cardNumber);
      const textX = emblemX - (textWidth / 2);
      const textY = emblemY + 1.0;
      doc.text(cardNumber, textX, textY);

      // Draw title bar
      const titleBarY = y + 10;
      doc.setDrawColor(0);
      doc.setLineWidth(0.2);
      doc.line(x + 10, titleBarY, x + cardWidth - 3, titleBarY);
      
             // Add title text
       doc.setTextColor(0);
       doc.setFontSize(10);
       doc.setFont("Bevan", "normal");
       const title = objective.title || `Objective ${index + 1}`;
       doc.text(title, x + 12, titleBarY - 1);

      // Add objective text
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

    doc.save(`dealt_objectives_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <main className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="space-y-2 w-full md:w-auto">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
            Objective Card Dealer
          </h1>
          <p className="text-lg text-muted-foreground">
            Import objective cards and randomly deal them for your missions
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {selectedObjectives.length > 0 && (
            <>
              <Button
                onClick={handleExportSelectedPDF}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                <FileText className="mr-2 h-4 w-4" />
                Export Selected PDF
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
        {/* Import and Deal Section */}
        <div className="space-y-6">
          {/* Import Status */}
          <Card>
            <CardHeader>
              <CardTitle>Deck Status</CardTitle>
              <CardDescription>
                Import your objective cards and configure the deal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {allObjectives.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cards in deck:</span>
                    <Badge variant="secondary">{allObjectives.length}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardsToSelect">Number of cards to deal:</Label>
                    <div className="flex gap-2">
                      <Input
                        id="cardsToSelect"
                        type="number"
                        min="1"
                        max={allObjectives.length}
                        placeholder={`1-${allObjectives.length}`}
                        value={cardsToSelect}
                        onChange={(e) => setCardsToSelect(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleDealCards}
                        disabled={isDealing || !cardsToSelect || parseInt(cardsToSelect) > allObjectives.length}
                        className="flex-shrink-0"
                      >
                        {isDealing ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Shuffle className="mr-2 h-4 w-4" />
                        )}
                        Deal Cards
                      </Button>
                    </div>
                  </div>

                  {selectedObjectives.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cards dealt:</span>
                      <div className="flex gap-2">
                        <Badge variant="outline">{selectedObjectives.length}</Badge>
                        <Button
                          onClick={handleReshuffle}
                          disabled={isDealing}
                          variant="outline"
                          size="sm"
                        >
                          <RefreshCw className="mr-2 h-3 w-3" />
                          Reshuffle
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Import a JSON file to start dealing cards
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Cards Preview */}
          {allObjectives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>All Cards in Deck</CardTitle>
                <CardDescription>
                  Preview of all available objective cards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                  {allObjectives.map((obj, index) => (
                                         <Card 
                       key={obj.id} 
                       className={`relative border-2 transition-all duration-200 min-h-[140px] group ${
                        selectedObjectives.some(selected => selected.id === obj.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-gradient-to-br from-card to-card/50'
                      }`}
                    >
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
                        
                        {/* Selected indicator */}
                        {selectedObjectives.some(selected => selected.id === obj.id) && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground text-xs">✓</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Dealt Cards Section */}
        <Card>
          <CardHeader>
            <CardTitle>Dealt Cards</CardTitle>
            <CardDescription>
              {selectedObjectives.length > 0 
                ? `${selectedObjectives.length} card${selectedObjectives.length !== 1 ? 's' : ''} randomly selected`
                : "No cards dealt yet"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedObjectives.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedObjectives.map((obj, index) => (
                                     <Card 
                     key={`selected-${obj.id}-${index}`} 
                     className="relative border-2 border-primary bg-primary/5 shadow-md hover:shadow-lg transition-all duration-200 min-h-[140px] group"
                  >
                    {/* Corner decorations */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-primary/50"></div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-primary/50"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-primary/50"></div>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-primary/50"></div>
                    
                    <CardContent className="p-3 relative">
                      {/* Circular emblem */}
                      <div className="absolute top-2 left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-xs font-bold" style={{ fontFamily: 'var(--font-bevan)' }}>
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                      </div>
                      
                      {/* Title bar */}
                      <div className="ml-8 mb-2">
                        <div className="h-0.5 bg-primary/30 mb-1"></div>
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
                                       <span className="text-xs font-bold text-foreground/60 bg-primary/20 px-1 rounded" style={{ fontFamily: 'var(--font-bevan)' }}>
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
                          <div className="absolute bottom-2 right-2 border border-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            <span className="text-xs font-bold text-foreground" style={{ fontFamily: 'var(--font-bevan)' }}>
                              {obj.objectives ? 
                                obj.objectives[0].victoryPoints + 'VP' :
                                obj.victoryPoints + 'VP'
                              }
                            </span>
                          </div>
                        )}
                      
                      {/* Dealt indicator */}
                      <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-xs">D</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <Shuffle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {allObjectives.length > 0 
                      ? "Click 'Deal Cards' to randomly select objectives"
                      : "Import objectives first to start dealing"
                    }
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
