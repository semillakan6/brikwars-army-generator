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
import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { specialtyGroups } from "@/config/specialties";

// Import equipment types
const equipment_types = [
  {
    name: "D4 Energy Shield",
    notes: "x energy D4 shield dice",
    sizeCost: 1,
    baseCost: 0,
    usePower: true,
    remark:
      'The shield must be created by a Shield Projector somewhere on the surface of the Creation, Shield size (amount) dictates the number of shield dice available (strength), and it can only stop a dice equal to the shields dice. (<a  target="_blank" class="ref" href="https://brikwars.com/rules/2020/f.htm#energyshields">Chapter F: Field Hazards</a>).',
  },
  {
    name: "D6 Energy Shield",
    notes: "x energy D6 shield dice",
    sizeCost: 1,
    baseCost: 0,
    usePower: true,
    remark:
      'The shield must be created by a Shield Projector somewhere on the surface of the Creation, Shield size (amount) dictates the number of shield dice available (strength), and it can only stop a dice equal to the shields dice. (<a  target="_blank" class="ref" href="https://brikwars.com/rules/2020/f.htm#energyshields">Chapter F: Field Hazards</a>).',
  },
  {
    name: "D8 Energy Shield",
    notes: "x energy D8 shield dice",
    sizeCost: 1,
    baseCost: 0,
    usePower: true,
    remark:
      'The shield must be created by a Shield Projector somewhere on the surface of the Creation, Shield size (amount) dictates the number of shield dice available (strength), and it can only stop a dice equal to the shields dice. (<a  target="_blank" class="ref" href="https://brikwars.com/rules/2020/f.htm#energyshields">Chapter F: Field Hazards</a>).',
  },
  {
    name: "D10 Energy Shield",
    notes: "x energy D10 shield dice",
    sizeCost: 1,
    baseCost: 0,
    usePower: true,
    remark:
      'The shield must be created by a Shield Projector somewhere on the surface of the Creation, Shield size (amount) dictates the number of shield dice available (strength), and it can only stop a dice equal to the shields dice. (<a  target="_blank" class="ref" href="https://brikwars.com/rules/2020/f.htm#energyshields">Chapter F: Field Hazards</a>).',
  },
  {
    name: "D12 Energy Shield",
    notes: "x energy D12 shield dice",
    sizeCost: 1,
    baseCost: 0,
    usePower: true,
    remark:
      'The shield must be created by a Shield Projector somewhere on the surface of the Creation, Shield size (amount) dictates the number of shield dice available (strength), and it can only stop a dice equal to the shields dice. (<a  target="_blank" class="ref" href="https://brikwars.com/rules/2020/f.htm#energyshields">Chapter F: Field Hazards</a>).',
  },
  {
    name: "D20 Energy Shield",
    notes: "x energy D20 shield dice",
    sizeCost: 1,
    baseCost: 0,
    usePower: true,
    remark:
      'The shield must be created by a Shield Projector somewhere on the surface of the Creation, Shield size (amount) dictates the number of shield dice available (strength), and it can only stop a dice equal to the shields dice. (<a  target="_blank" class="ref" href="https://brikwars.com/rules/2020/f.htm#energyshields">Chapter F: Field Hazards</a>).',
  },
  {
    name: "Light Armor",
    notes:
      "+2 to Armor against all incoming damage (but not for internal damage).",
    strength: 1,
    sizeCost: 1,
    baseCost: 1,
    lightArmor: true,
    remark: "Wearer can't swim.",
  },
  {
    name: "Heavy Armor",
    notes: "Has Deflection against the blow.",
    strength: 1,
    sizeCost: 1,
    baseCost: 1,
    heavyArmor: true,
    remark: "Half Speed, wearer can't swim.",
  },
  {
    name: "Small Thrusters",
    notes: "1d4 Thrust",
    sizeCost: 1,
    baseCost: 0,
    usePower: false,
    remark: "",
  },
  {
    name: "Medium Thrusters",
    notes: "1d6 Thrust",
    sizeCost: 1,
    baseCost: 0,
    usePower: false,
    remark: "",
  },
  {
    name: "Large Thrusters",
    notes: "1d8 Thrust",
    sizeCost: 1,
    baseCost: 0,
    usePower: false,
    remark: "",
  },
  {
    name: "Giant Thrusters",
    notes: "1d10 Thrust",
    sizeCost: 1,
    baseCost: 0,
    usePower: false,
    remark: "",
  },
];

// Add a stable ID generator
let nextId = 1;
const generateId = () => {
  return nextId++;
};

export default function Home() {
  const [mounted, setMounted] = React.useState(false);
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

  // Equipment state and handlers
  const [equipmentForm, setEquipmentForm] = useState({
    type: "",
    size: 1,
    notes: "",
  });

  // Initialize unit form with default values from squadFields
  const initialUnitForm = squadFields.reduce((acc, field) => {
    acc[field.id] = field.type === "switch" ? false : "";
    return acc;
  }, {});

  const [unitForm, setUnitForm] = useState(initialUnitForm);

  const [specialtyForm, setSpecialtyForm] = useState({
    type: "",
    group: "",
  });
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddSquad = () => {
    if (newSquadName.trim()) {
      const newSquad = {
        name: newSquadName,
        units: [],
        id: generateId(),
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
      id: generateId(),
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
    setSelectedUnit(newUnit.id); // Select the newly created unit
    // Don't clear the form data, keep it to show the unit is selected
  };

  const handleUpdateUnit = (e) => {
    e.preventDefault();
    if (!selectedSquad || !selectedUnit) return;

    const updatedSquads = squads.map((squad) => {
      if (squad.id === selectedSquad) {
        return {
          ...squad,
          units: squad.units.map((unit) =>
            unit.id === selectedUnit
              ? {
                  ...unit, // Preserve existing unit properties
                  ...unitForm, // Update with new form values
                  weapons: unit.weapons || [], // Preserve weapons
                  equipment: unit.equipment || [], // Preserve equipment
                }
              : unit
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
      (total, unit) =>
        total + calculateUnitPoints(unit) * (parseInt(unit.unit_number) || 1),
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
    let range;
    if (type.baseRange === "CC") {
      range = "CC";
    } else if (
      typeof type.baseRange === "string" &&
      type.baseRange.includes("CC or")
    ) {
      range = type.baseRange;
    } else {
      range = type.sizeRange * size + type.baseRange;
    }
    const damage = type.damageMulSize ? `${size}${type.damage}` : type.damage;

    return { use, range, damage };
  };

  const handleWeaponTypeChange = (type) => {
    const selectedWeapon = weaponTypes.find((w) => w.name === type);
    const stats = calculateWeaponStats(
      type,
      selectedWeapon?.size || weaponForm.size
    );
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
    const selectedWeapon = weaponTypes.find((w) => w.name === weaponForm.type);
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

  const handleEquipmentTypeChange = (type) => {
    const selectedEquipment = equipment_types.find((e) => e.name === type);
    setEquipmentForm({
      ...equipmentForm,
      type,
      notes: selectedEquipment?.notes || "",
      size:
        selectedEquipment?.lightArmor || selectedEquipment?.heavyArmor
          ? 1
          : equipmentForm.size, // Force size to 1 for armor
    });
  };

  const handleAddEquipment = (e) => {
    e.preventDefault();
    if (!selectedSquad || !selectedUnit) return;

    const selectedEquipment = equipment_types.find(
      (e) => e.name === equipmentForm.type
    );
    if (!selectedEquipment) return;

    // Check if unit already has armor
    if (selectedEquipment.lightArmor || selectedEquipment.heavyArmor) {
      const unit = selectedSquadData.units.find((u) => u.id === selectedUnit);
      const hasArmor = unit?.equipment?.some((e) => {
        const eq = equipment_types.find((et) => et.name === e.type);
        return eq?.lightArmor || eq?.heavyArmor;
      });

      if (hasArmor) {
        alert("A unit can only have one type of armor.");
        return;
      }
    }

    const newEquipment = {
      ...equipmentForm,
      id: generateId(),
      cost:
        selectedEquipment.sizeCost * equipmentForm.size +
        selectedEquipment.baseCost,
      usePower: selectedEquipment.usePower,
      remark: selectedEquipment.remark,
    };

    const updatedSquads = squads.map((squad) => {
      if (squad.id === selectedSquad) {
        return {
          ...squad,
          units: squad.units.map((unit) => {
            if (unit.id === selectedUnit) {
              return {
                ...unit,
                equipment: [...(unit.equipment || []), newEquipment],
              };
            }
            return unit;
          }),
        };
      }
      return squad;
    });
    setSquads(updatedSquads);
    setEquipmentForm({
      type: "",
      size: 1,
      notes: "",
    });
  };

  const handleDeleteEquipment = (equipmentId) => {
    if (!selectedSquad || !selectedUnit) return;

    const updatedSquads = squads.map((squad) => {
      if (squad.id === selectedSquad) {
        return {
          ...squad,
          units: squad.units.map((unit) => {
            if (unit.id === selectedUnit) {
              return {
                ...unit,
                equipment:
                  unit.equipment?.filter((e) => e.id !== equipmentId) || [],
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
                  { ...weaponForm, id: generateId() },
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

  const handleDeleteSpecialty = (specialtyId) => {
    if (!selectedSquad || !selectedUnit) return;

    const updatedSquads = squads.map((squad) => {
      if (squad.id === selectedSquad) {
        return {
          ...squad,
          units: squad.units.map((unit) => {
            if (unit.id === selectedUnit) {
              return {
                ...unit,
                specialties:
                  unit.specialties?.filter((s) => s.id !== specialtyId) || [],
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

  const handleAddSpecialty = (e) => {
    e.preventDefault();
    if (!selectedSquad || !selectedUnit || !specialtyForm.type) return;

    const [group, type] = specialtyForm.type.split(":");
    const specialty = specialtyGroups[group][type];
    if (!specialty) return;

    const newSpecialty = {
      ...specialty,
      id: generateId(),
      group,
      type,
    };

    const updatedSquads = squads.map((squad) => {
      if (squad.id === selectedSquad) {
        return {
          ...squad,
          units: squad.units.map((unit) => {
            if (unit.id === selectedUnit) {
              return {
                ...unit,
                specialties: [...(unit.specialties || []), newSpecialty],
              };
            }
            return unit;
          }),
        };
      }
      return squad;
    });
    setSquads(updatedSquads);
    setSpecialtyForm({
      type: "",
      group: "",
    });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
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
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 30, 30);
    doc.text(
      `${armyName || "Unnamed Army"} • ${calculateTotalPoints()}Ü`,
      margin,
      y
    );
    y += lineHeight + 6;

    // --- SQUADS/UNITS ---
    squads.forEach((squad, idx) => {
      if (idx > 0 && y > margin) {
        // Draw a separator line between squads (but not at the top of a new page)
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(1);
        doc.line(margin, y, pageWidth - margin, y);
        y += 16; // Add more space after the line for clarity
      }

      // Estimate height needed for squad name and first unit
      let estimatedSquadBlockHeight = lineHeight;
      if (squad.units.length > 0) {
        let firstUnit = squad.units[0];
        let unitBlockHeight = lineHeight - 2;
        const firstKeywords = squadFields
          .filter(
            (f) =>
              f.type === "switch" && f.id !== "isMinifigure" && firstUnit[f.id]
          )
          .map((f) => f.label)
          .join(", ");
        if (firstKeywords) unitBlockHeight += 13;
        if (firstUnit.specialties?.length > 0) unitBlockHeight += 10;
        unitBlockHeight += 40; // estimate for stats table
        estimatedSquadBlockHeight += unitBlockHeight;
      }
      const pageHeight = doc.internal.pageSize.getHeight();
      if (y + estimatedSquadBlockHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      // Now draw the squad name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(30, 30, 30);
      doc.text(
        `${squad.name} [${squad.units.reduce((total, unit) => total + (parseInt(unit.unit_number) || 1), 0)} (${squad.units.length})] • ${calculateSquadPoints(squad)}Ü`,
        margin + cardPadding,
        y
      );
      y += lineHeight;

      // Units
      squad.units.forEach((unit) => {
        // Estimate height needed for unit header and table
        let estimatedHeight = lineHeight - 2;
        const keywords = squadFields
          .filter(
            (f) => f.type === "switch" && f.id !== "isMinifigure" && unit[f.id]
          )
          .map((f) => f.label)
          .join(", ");
        if (keywords) estimatedHeight += 13;
        if (unit.specialties?.length > 0) estimatedHeight += 10;
        estimatedHeight += 40; // estimate for stats table

        const pageHeight = doc.internal.pageSize.getHeight();
        if (y + estimatedHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }

        // Store the unit name and y position
        const unitName = `${unit.name || "Unit"}${
          unit.unit_number ? ` [${unit.unit_number}]` : ""
        }`;
        const unitNameX = margin + cardPadding + 8;
        let unitNameY = y;

        // Draw unit name and keywords/specialties as before
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text(unitName, unitNameX, unitNameY);
        unitNameY += lineHeight - 2;
        // Keywords (from switches)
        if (keywords) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(keywords, unitNameX + 16, unitNameY);
          unitNameY += 13;
        }
        // Add specialties
        if (unit.specialties?.length > 0) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(50, 50, 50);
          const specialties = unit.specialties
            .map(
              (s) =>
                `${s.name}${
                  s.cost !== 0 ? ` (${s.cost > 0 ? "+" : ""}${s.cost}Ü)` : ""
                }`
            )
            .join(", ");
          doc.text(specialties, unitNameX + 16, unitNameY);
          unitNameY += 10;
        }
        let afterNameY = unitNameY;
        // --- UNIT STATS TABLE ---
        const statFields = squadFields.filter(
          (f) => f.type !== "switch" && f.id !== "equipment"
        );
        const statLabels = statFields.map((f) => f.label);
        const statValues = statFields.map((f) => {
          if (f.type === "select") {
            const selectedOption = f.options
              .flatMap((g) => g.items)
              .find((i) => i.value === unit[f.id]);
            return selectedOption ? selectedOption.label : unit[f.id];
          }
          return unit[f.id] || "";
        });
        autoTable(doc, {
          startY: afterNameY,
          head: [statLabels],
          body: [statValues],
          theme: "grid",
          headStyles: {
            fillColor: tableHeaderBg,
            textColor: tableHeaderText,
            fontStyle: "bold",
            fontSize: 9,
          },
          styles: {
            fontSize: 9,
            textColor: 60,
            cellPadding: 2.5,
            halign: "center",
            valign: "middle",
            lineColor: 220,
            lineWidth: 0.1,
          },
          margin: {
            left: margin + cardPadding + 8,
            right: margin + cardPadding + 8,
          },
          didDrawPage: (data) => {
            // Only draw if this is not the first page, or if the table is at the top of the page
            if (data.pageNumber > 1 || data.settings.startY < afterNameY) {
              doc.setFont("helvetica", "bold");
              doc.setFontSize(12);
              doc.setTextColor(50, 50, 50);
              doc.text(unitName, unitNameX, data.settings.margin.top);
              // Optionally, re-draw keywords/specialties here as well
            }
          },
        });
        let lastTableY = doc.lastAutoTable.finalY
          ? doc.lastAutoTable.finalY + 2
          : afterNameY + 24;
        y = lastTableY;
        // --- WEAPONS & EQUIPMENT TABLES SIDE BY SIDE ---
        const tableStartY = y;
        const tableWidth = (pageWidth - margin * 2 - cardPadding * 2 - 16) / 2; // 16px gap between tables

        let lastWeaponTableY = tableStartY;
        let lastEquipmentTableY = tableStartY;

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
            startY: tableStartY,
            head: [["Weapon", "Size", "Amount", "Use", "Range", "Damage"]],
            body: weaponsData,
            theme: "grid",
            headStyles: {
              fillColor: tableHeaderBg,
              textColor: tableHeaderText,
              fontStyle: "bold",
              fontSize: 8,
            },
            styles: {
              fontSize: 8,
              textColor: 80,
              cellPadding: 2,
              lineColor: 220,
              lineWidth: 0.1,
            },
            margin: {
              left: margin + cardPadding + 8,
              right: margin + cardPadding + 8 + tableWidth,
            },
            tableWidth: tableWidth,
            pageBreak: "avoid",
          });
          lastWeaponTableY = doc.lastAutoTable.finalY
            ? doc.lastAutoTable.finalY + 2
            : tableStartY + 20;
        }

        if (unit.equipment?.length > 0) {
          const equipmentData = unit.equipment.map((equipment) => [
            equipment.type,
            equipment.size,
            equipment.notes,
            equipment.cost,
          ]);
          autoTable(doc, {
            startY: tableStartY,
            head: [["Equipment", "Size", "Notes", "Cost"]],
            body: equipmentData,
            theme: "grid",
            headStyles: {
              fillColor: tableHeaderBg,
              textColor: tableHeaderText,
              fontStyle: "bold",
              fontSize: 8,
            },
            styles: {
              fontSize: 8,
              textColor: 80,
              cellPadding: 2,
              lineColor: 220,
              lineWidth: 0.1,
            },
            margin: {
              left: margin + cardPadding + 8 + tableWidth + 16, // 16px gap
              right: margin + cardPadding + 8,
            },
            tableWidth: tableWidth,
            pageBreak: "avoid",
          });
          lastEquipmentTableY = doc.lastAutoTable.finalY
            ? doc.lastAutoTable.finalY + 2
            : tableStartY + 20;
        }

        // Set y to the max Y of both tables
        y = Math.max(y, lastWeaponTableY, lastEquipmentTableY);
        y += 10;
      });
    });

    // --- SPECIAL RULES SECTION (at end) ---
    if (armyRules.trim()) {
      y += 16;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Special Rules", margin, y);
      y += lineHeight;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60);
      // Bold rule names if formatted as "Name: Description"
      const rulesLines = armyRules.split(/\n|\r/).filter(Boolean);
      rulesLines.forEach((line) => {
        const match = line.match(/^(\w[\w\s\-\(\)]+):\s*(.*)$/);
        if (match) {
          doc.setFont("helvetica", "bold");
          doc.text(match[1] + ":", margin, y);
          doc.setFont("helvetica", "normal");
          doc.text(match[2], margin + 60, y);
        } else {
          doc.setFont("helvetica", "normal");
          doc.text(line, margin, y);
        }
        y += 14;
      });
    }

    doc.save(`${armyName || "army"}_list.pdf`);
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
              value={
                field.id === "power" && unitForm.isMinifigure
                  ? "1"
                  : unitForm[field.id]
              }
              onChange={(e) =>
                setUnitForm({ ...unitForm, [field.id]: e.target.value })
              }
              placeholder={field.placeholder}
              required={field.required}
              disabled={field.id === "power" && unitForm.isMinifigure}
            />
          </div>
        );
      case "textarea":
        return (
          <div className="flex flex-col gap-1">
            <Label htmlFor={field.id}>{renderLabel(field)}</Label>
            <textarea
              id={field.id}
              value={unitForm[field.id]}
              onChange={(e) =>
                setUnitForm({ ...unitForm, [field.id]: e.target.value })
              }
              placeholder={field.placeholder}
              required={field.required}
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  ...(field.id === "isMinifigure" && checked
                    ? { power: "1" }
                    : {}),
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

  if (!mounted) {
    return null; // or a loading state
  }

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
              <Button
                onClick={handleExportJSON}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Army
              </Button>
              <Button onClick={handleExportPDF} className="flex-1 sm:flex-none">
                <Download className="mr-2 h-4 w-4" />
                Export to PDF
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Forms in Tabs */}
        <Card>
          <CardHeader>
            {selectedUnit && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleUnselectUnit}
                  className="text-muted-foreground hover:text-foreground border-2"
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            )}
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
              <Tabs defaultValue="unit" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="unit">Unit</TabsTrigger>
                  <TabsTrigger
                    value="weapons"
                    disabled={!selectedUnit}
                    className={
                      !selectedUnit ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    Weapons
                  </TabsTrigger>
                  <TabsTrigger
                    value="equipment"
                    disabled={!selectedUnit}
                    className={
                      !selectedUnit ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    Equipment
                  </TabsTrigger>
                  <TabsTrigger
                    value="specialties"
                    disabled={!selectedUnit}
                    className={
                      !selectedUnit ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    Specialties
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="unit" className="space-y-4">
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
                </TabsContent>
                <TabsContent value="weapons" className="space-y-4">
                  {selectedUnit ? (
                    <>
                      <form onSubmit={handleAddWeapon} className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Switch
                            checked={showBastardWeapons}
                            onCheckedChange={setShowBastardWeapons}
                          />
                          <Label>Show Bastard Weapons</Label>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
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
                                  .filter(
                                    (weapon) =>
                                      (showBastardWeapons &&
                                        weapon.category === "Bastard") ||
                                      (!showBastardWeapons &&
                                        weapon.category !== "Bastard")
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
                              disabled={
                                weaponTypes.find(
                                  (w) => w.name === weaponForm.type
                                )?.size !== undefined
                              }
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
                        <Button type="submit" className="w-full">
                          Add Weapon
                        </Button>
                      </form>

                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium">Current Weapons</h4>
                        <div className="max-h-[200px] overflow-y-auto">
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
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Select a unit to manage weapons
                      </p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="equipment" className="space-y-4">
                  {selectedUnit ? (
                    <>
                      <form onSubmit={handleAddEquipment} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="equipmentType">Type</Label>
                            <Select
                              id="equipmentType"
                              value={equipmentForm.type}
                              onValueChange={handleEquipmentTypeChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select equipment type" />
                              </SelectTrigger>
                              <SelectContent>
                                {equipment_types.map((equipment) => (
                                  <SelectItem
                                    key={equipment.name}
                                    value={equipment.name}
                                  >
                                    {equipment.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="equipmentSize">Amount</Label>
                            <Input
                              id="equipmentSize"
                              type="number"
                              min="1"
                              placeholder="Enter size"
                              value={equipmentForm.size}
                              onChange={(e) =>
                                setEquipmentForm({
                                  ...equipmentForm,
                                  size: parseInt(e.target.value),
                                })
                              }
                              disabled={
                                equipment_types.find(
                                  (e) => e.name === equipmentForm.type
                                )?.lightArmor ||
                                equipment_types.find(
                                  (e) => e.name === equipmentForm.type
                                )?.heavyArmor
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="equipmentNotes">Notes</Label>
                          <Input
                            id="equipmentNotes"
                            placeholder="Enter equipment notes"
                            value={equipmentForm.notes}
                            onChange={(e) =>
                              setEquipmentForm({
                                ...equipmentForm,
                                notes: e.target.value,
                              })
                            }
                            disabled
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Add Equipment
                        </Button>
                      </form>

                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium">Current Equipment</h4>
                        <div className="max-h-[200px] overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-right">
                                  Actions
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead>Cost</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedSquadData.units
                                .find((u) => u.id === selectedUnit)
                                ?.equipment?.map((equipment) => (
                                  <TableRow key={equipment.id}>
                                    <TableCell className="text-left">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleDeleteEquipment(equipment.id)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                    <TableCell>{equipment.type}</TableCell>
                                    <TableCell>{equipment.size}</TableCell>
                                    <TableCell>{equipment.notes}</TableCell>
                                    <TableCell>{equipment.cost}Ü</TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Select a unit to manage equipment
                      </p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="specialties" className="space-y-4">
                  {selectedUnit ? (
                    <>
                      <form onSubmit={handleAddSpecialty} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="specialtyType">Specialty</Label>
                          <Select
                            id="specialtyType"
                            value={specialtyForm.type}
                            onValueChange={(value) =>
                              setSpecialtyForm({ type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select specialty" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(specialtyGroups).map(
                                ([group, specialties]) => (
                                  <SelectGroup key={group}>
                                    <SelectLabel>{group}</SelectLabel>
                                    {Object.entries(specialties).map(
                                      ([type, specialty]) => (
                                        <SelectItem
                                          key={`${group}:${type}`}
                                          value={`${group}:${type}`}
                                        >
                                          {specialty.name}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectGroup>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full">
                          Add Specialty
                        </Button>
                      </form>

                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium">Current Specialties</h4>
                        <div className="max-h-[200px] overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-right">
                                  Actions
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Cost</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedSquadData.units
                                .find((u) => u.id === selectedUnit)
                                ?.specialties?.map((specialty) => (
                                  <TableRow key={specialty.id}>
                                    <TableCell className="text-left">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleDeleteSpecialty(specialty.id)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                    <TableCell>{specialty.name}</TableCell>
                                    <TableCell>
                                      {specialty.description}
                                    </TableCell>
                                    <TableCell>{specialty.cost}Ü</TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Select a unit to manage specialties
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Select a squad to add units
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Middle and Right Columns - Squads and Units List */}
        <div className="lg:col-span-2 space-y-4">
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
                      onClick={() => {
                        setSelectedSquad(squad.id);
                        setSelectedUnit(null);
                        setUnitForm(initialUnitForm);
                      }}
                    >
                      <TableCell className="font-medium">
                        {squad.name}
                      </TableCell>
                      <TableCell>
                        {squad.units.reduce((total, unit) => total + (parseInt(unit.unit_number) || 1), 0)} ({squad.units.length})
                      </TableCell>
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

          {/* Add Squad Button */}
          {selectedUnit && (
            <div className="flex justify-center my-4">
              <Button 
                onClick={() => {
                  setSelectedUnit(null);
                  setUnitForm(initialUnitForm);
                }}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Unit
              </Button>
            </div>
          )}

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
                        {/* Add keywords row */}
                        {squadFields.filter(
                          (f) =>
                            f.type === "switch" &&
                            f.id !== "isMinifigure" &&
                            f.id !== "hasDeflection" &&
                            unit[f.id]
                        ).length > 0 && (
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
                              <div className="text-sm text-muted-foreground italic">
                                {squadFields
                                  .filter(
                                    (f) =>
                                      f.type === "switch" &&
                                      f.id !== "isMinifigure" &&
                                      f.id !== "hasDeflection" &&
                                      unit[f.id]
                                  )
                                  .map((f) => f.label)
                                  .join(", ")}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                        {/* Add deflection tag */}
                        {unit.hasDeflection && (
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
                              <div className="flex flex-wrap gap-2">
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                                  Has Deflection
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                        {/* Add specialties row */}
                        {unit.specialties?.length > 0 && (
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
                              <div className="flex flex-wrap gap-2">
                                {unit.specialties.map((specialty) => (
                                  <div
                                    key={specialty.id}
                                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
                                  >
                                    {specialty.name}
                                    {specialty.cost !== 0 && (
                                      <span className="ml-1">
                                        {specialty.cost > 0 ? "+" : ""}
                                        {specialty.cost}Ü
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
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
                        {unit.equipment?.length > 0 && (
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
                                      <TableHead>Equipment</TableHead>
                                      <TableHead>Size</TableHead>
                                      <TableHead>Notes</TableHead>
                                      <TableHead>Cost</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {unit.equipment.map((equipment) => (
                                      <TableRow key={equipment.id}>
                                        <TableCell>{equipment.type}</TableCell>
                                        <TableCell>{equipment.size}</TableCell>
                                        <TableCell>{equipment.notes}</TableCell>
                                        <TableCell>{equipment.cost}Ü</TableCell>
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
      </div>
    </main>
  );
}
