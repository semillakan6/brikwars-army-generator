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
import { Plus, Trash2, Download, Upload, X, Copy, GripVertical } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { squadFields } from "@/config/squad-fields";
import {
  DEFAULT_UNIT_ICON,
  getUnitIconSrc,
  preloadUnitIconBase64,
  unitIconImageClassName,
  unitIcons,
} from "@/config/unit-icons";
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
import {
  formatMagikCost,
  supernaturalCliches,
  supernaturalDice,
} from "@/config/magik";

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
      "+2 to Armor against all incoming damage (but not for internal damage). Cannot Swim.",
    strength: 1,
    sizeCost: 1,
    baseCost: 1,
    lightArmor: true,
    remark: "Wearer can't swim.",
  },
  {
    name: "Heavy Armor",
    notes: "Has Deflection against the blow. Cannot Swim, Half Speed.",
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

const remapSpecialty = (specialty) => ({
  ...specialty,
  id: generateId(),
});

const remapMagik = (magik) => ({
  ...magik,
  id: generateId(),
});

const remapEquipment = (equipment) => ({
  ...equipment,
  id: generateId(),
});

const remapWeapon = (weapon) => ({
  ...weapon,
  id: generateId(),
});

const remapUnit = (unit, options = {}) => ({
  ...unit,
  id: generateId(),
  name: options.name ?? unit.name,
  unitIcon: unit.unitIcon || DEFAULT_UNIT_ICON,
  weapons: (unit.weapons || []).map(remapWeapon),
  equipment: (unit.equipment || []).map(remapEquipment),
  specialties: (unit.specialties || []).map(remapSpecialty),
  magik: (unit.magik || []).map(remapMagik),
});

const remapSquad = (squad, options = {}) => ({
  ...squad,
  id: generateId(),
  name: options.name ?? squad.name,
  units: (squad.units || []).map((unit) => remapUnit(unit)),
});

const isUnitTableField = (field) =>
  field.type !== "switch" &&
  field.type !== "icon" &&
  field.id !== "equipment";

const isUnitStatField = (field) =>
  field.type !== "switch" &&
  field.type !== "icon" &&
  field.id !== "equipment";

const tableHeadActions = "px-3 text-right";
const tableHeadName = "px-3 text-left";
const tableHeadCenter = "px-3 text-center";
const tableCellActions = "px-3 text-right";
const tableCellName = "px-3 text-left";
const tableCellCenter = "px-3 text-center";

const unitTableHeadClass = (fieldId) =>
  fieldId === "name" ? tableHeadName : tableHeadCenter;
const unitTableCellClass = (fieldId) =>
  fieldId === "name" ? tableCellName : tableCellCenter;

// Render-prop wrapper that exposes @dnd-kit sortable state to a table row.
// Keeping this at module scope avoids remounting the row (and losing drag
// state) on every parent re-render.
const SortableRow = ({ id, children }) => {
  const sortable = useSortable({ id });
  return children(sortable);
};

const DragHandleCell = ({ attributes, listeners, className }) => (
  <TableCell className={className}>
    <button
      type="button"
      className="flex cursor-grab touch-none items-center justify-center text-muted-foreground hover:text-foreground active:cursor-grabbing"
      aria-label="Drag to reorder"
      onClick={(e) => e.stopPropagation()}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4" />
    </button>
  </TableCell>
);

const sortableRowStyle = (transform, transition, isDragging) => ({
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.5 : 1,
  position: "relative",
  zIndex: isDragging ? 1 : 0,
});

const formatMagikEntry = (entry) =>
  `${entry.die} ${entry.element} — ${entry.cliche} (+${formatMagikCost(
    entry.cost
  )})`;

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
    if (field.type === "switch") {
      acc[field.id] = false;
    } else if (field.type === "icon") {
      acc[field.id] = DEFAULT_UNIT_ICON;
    } else {
      acc[field.id] = "";
    }
    return acc;
  }, {});

  const [unitForm, setUnitForm] = useState(initialUnitForm);

  const [specialtyForm, setSpecialtyForm] = useState({
    type: "",
    group: "",
  });
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [magikForm, setMagikForm] = useState({
    die: "",
    genre: "",
    cliche: "",
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Reset unit selection when squad changes
  React.useEffect(() => {
    if (selectedSquad) {
      setSelectedUnit(null);
      setUnitForm(initialUnitForm);
    }
  }, [selectedSquad]);

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

  const handleReorderSquads = (activeId, overId) => {
    if (activeId === overId) return;
    setSquads((prev) => {
      const oldIndex = prev.findIndex((squad) => squad.id === activeId);
      const newIndex = prev.findIndex((squad) => squad.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleReorderUnits = (squadId, activeId, overId) => {
    if (activeId === overId) return;
    setSquads((prev) =>
      prev.map((squad) => {
        if (squad.id !== squadId) return squad;
        const oldIndex = squad.units.findIndex((unit) => unit.id === activeId);
        const newIndex = squad.units.findIndex((unit) => unit.id === overId);
        if (oldIndex === -1 || newIndex === -1) return squad;
        return { ...squad, units: arrayMove(squad.units, oldIndex, newIndex) };
      })
    );
  };

  const dndSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDuplicateSquad = (squadId) => {
    const squadIndex = squads.findIndex((squad) => squad.id === squadId);
    if (squadIndex === -1) return;

    const squad = squads[squadIndex];
    const duplicatedSquad = remapSquad(squad, {
      name: `${squad.name} (Copy)`,
    });
    const updatedSquads = [...squads];
    updatedSquads.splice(squadIndex + 1, 0, duplicatedSquad);

    setSquads(updatedSquads);
    setSelectedSquad(duplicatedSquad.id);
    setSelectedUnit(null);
    setUnitForm(initialUnitForm);
  };

  const handleAddUnit = (e) => {
    e.preventDefault();
    if (!selectedSquad) return;

    const newUnit = {
      ...unitForm,
      id: generateId(),
      unitIcon: unitForm.unitIcon || DEFAULT_UNIT_ICON,
      weapons: [],
      equipment: [],
      specialties: [],
      magik: [],
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
                  specialties: unit.specialties || [], // Preserve specialties
                  magik: unit.magik || [], // Preserve Magik
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

  const handleDuplicateUnit = (squadId, unitId) => {
    let duplicatedUnit = null;

    const updatedSquads = squads.map((squad) => {
      if (squad.id !== squadId) return squad;

      const unitIndex = squad.units.findIndex((unit) => unit.id === unitId);
      if (unitIndex === -1) return squad;

      const unit = squad.units[unitIndex];
      duplicatedUnit = remapUnit(unit, {
        name: `${unit.name || "Unit"} (Copy)`,
      });
      const units = [...squad.units];
      units.splice(unitIndex + 1, 0, duplicatedUnit);

      return { ...squad, units };
    });

    if (!duplicatedUnit) return;

    setSquads(updatedSquads);
    setSelectedUnit(duplicatedUnit.id);
    setUnitForm({
      ...initialUnitForm,
      ...duplicatedUnit,
      unitIcon: duplicatedUnit.unitIcon || DEFAULT_UNIT_ICON,
    });
  };

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit.id);
    setUnitForm({
      ...initialUnitForm,
      ...unit,
      unitIcon: unit.unitIcon || DEFAULT_UNIT_ICON,
    });
    setMagikForm({ die: "", genre: "", cliche: "" });
  };

  const handleUnselectUnit = () => {
    setSelectedUnit(null);
    setUnitForm(initialUnitForm);
    setMagikForm({ die: "", genre: "", cliche: "" });
  };

  // Calculate the total equipment cost for a unit
  const calculateUnitEquipmentCost = (unit) => {
    return (unit.equipment || []).reduce(
      (total, equipment) => total + (Number(equipment.cost) || 0),
      0
    );
  };

  const calculateUnitMagikCost = (unit) => {
    return (unit.magik || []).reduce(
      (total, entry) => total + (Number(entry.cost) || 0),
      0
    );
  };

  // Calculate total points for a single unit (value + equipment + Magik)
  const calculateUnitPoints = (unit) => {
    return (
      (Number(unit.value) || 0) +
      calculateUnitEquipmentCost(unit) +
      calculateUnitMagikCost(unit)
    );
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

  const handleDeleteMagik = (magikId) => {
    if (!selectedSquad || !selectedUnit) return;

    setSquads((currentSquads) =>
      currentSquads.map((squad) =>
        squad.id === selectedSquad
          ? {
              ...squad,
              units: squad.units.map((unit) =>
                unit.id === selectedUnit
                  ? {
                      ...unit,
                      magik:
                        unit.magik?.filter((entry) => entry.id !== magikId) ||
                        [],
                    }
                  : unit
              ),
            }
          : squad
      )
    );
  };

  const handleAddMagik = (e) => {
    e.preventDefault();
    if (
      !selectedSquad ||
      !selectedUnit ||
      !magikForm.die ||
      !magikForm.genre ||
      !magikForm.cliche
    ) {
      return;
    }

    const selectedDie = supernaturalDice.find(
      (die) => die.die === magikForm.die
    );
    const genreCliches = supernaturalCliches[magikForm.genre] || [];
    if (!selectedDie || !genreCliches.includes(magikForm.cliche)) return;

    const newMagik = {
      id: generateId(),
      die: selectedDie.die,
      element: selectedDie.element,
      cost: selectedDie.cost,
      genre: magikForm.genre,
      cliche: magikForm.cliche,
    };

    setSquads((currentSquads) =>
      currentSquads.map((squad) =>
        squad.id === selectedSquad
          ? {
              ...squad,
              units: squad.units.map((unit) =>
                unit.id === selectedUnit
                  ? {
                      ...unit,
                      magik: [...(unit.magik || []), newMagik],
                    }
                  : unit
              ),
            }
          : squad
      )
    );
    setMagikForm({ die: "", genre: "", cliche: "" });
  };

  const handleExportPDF = async () => {
    const iconCache = await preloadUnitIconBase64();
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

    const drawUnitHeader = (pdfDoc, unit, x, y) => {
      const iconId = unit.unitIcon || DEFAULT_UNIT_ICON;
      const iconData =
        iconCache.get(iconId) || iconCache.get(DEFAULT_UNIT_ICON);
      if (iconData) {
        pdfDoc.addImage(iconData, "PNG", x, y - 10, 12, 12);
      }

      const unitName = `${unit.name || "Unit"}${
        unit.unit_number ? ` [${unit.unit_number}]` : ""
      }`;
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.setFontSize(12);
      pdfDoc.setTextColor(50, 50, 50);
      pdfDoc.text(unitName, x + 16, y);
      return unitName;
    };

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

    const contentWidth = pageWidth - margin * 2;
    const rulesLineHeight = 14;

    const ensurePageSpace = (neededHeight) => {
      const pageHeight = doc.internal.pageSize.getHeight();
      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    const drawWrappedText = (text, x, startY, maxWidth, fontStyle = "normal") => {
      doc.setFont("helvetica", fontStyle);
      doc.setFontSize(10);
      doc.setTextColor(60);
      const lines = doc.splitTextToSize(text, maxWidth);
      let currentY = startY;
      lines.forEach((line) => {
        ensurePageSpace(rulesLineHeight);
        doc.text(line, x, currentY);
        currentY += rulesLineHeight;
      });
      return currentY;
    };

    // --- SPECIAL RULES (below army name) ---
    if (armyRules.trim()) {
      ensurePageSpace(lineHeight + rulesLineHeight);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Special Rules", margin, y);
      y += lineHeight;

      const rulesLines = armyRules.split(/\n|\r/).filter(Boolean);
      rulesLines.forEach((line, index) => {
        const trimmedLine = line.trim();
        const match = trimmedLine.match(/^(.+?):\s*(.*)$/);

        if (match && match[2]) {
          ensurePageSpace(rulesLineHeight);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(60);
          doc.text(`${match[1].trim()}:`, margin, y);
          y += rulesLineHeight;

          y = drawWrappedText(match[2].trim(), margin, y, contentWidth);
        } else {
          y = drawWrappedText(trimmedLine, margin, y, contentWidth);
        }

        if (index < rulesLines.length - 1) {
          y += 6;
        }
      });

      y += 12;
    }

    // --- UNIT BLOCK HELPERS ---
    const unitContentLeft = margin + cardPadding + 8;
    const sideTableWidth = (pageWidth - margin * 2 - cardPadding * 2 - 16) / 2; // 16px gap between tables

    const buildStatsTableConfig = (unit) => {
      const statFields = squadFields.filter(isUnitStatField);
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
      return {
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
          left: unitContentLeft,
          right: unitContentLeft,
        },
      };
    };

    const buildWeaponsTableConfig = (unit) => ({
      head: [["Weapon", "Size", "Amount", "Use", "Range", "Damage"]],
      body: unit.weapons.map((weapon) => [
        weapon.name || weapon.type,
        weapon.size,
        weapon.amount,
        weapon.use,
        weapon.range,
        weapon.damage,
      ]),
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
        left: unitContentLeft,
        right: unitContentLeft + sideTableWidth,
      },
      tableWidth: sideTableWidth,
      pageBreak: "avoid",
    });

    const buildEquipmentTableConfig = (unit) => ({
      head: [["Equipment", "Size", "Notes", "Cost"]],
      body: unit.equipment.map((equipment) => [
        equipment.type,
        equipment.size,
        equipment.notes,
        equipment.cost,
      ]),
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
        left: unitContentLeft + sideTableWidth + 16, // 16px gap
        right: unitContentLeft,
      },
      tableWidth: sideTableWidth,
      pageBreak: "avoid",
    });

    // Render a table into a scratch document to get its real height,
    // including wrapped cell text that flat estimates get wrong.
    const measureTableHeight = (config) => {
      const scratch = new jsPDF({ unit: "pt", format: "a4" });
      autoTable(scratch, { ...config, startY: margin, pageBreak: "auto" });
      return scratch.lastAutoTable?.finalY
        ? scratch.lastAutoTable.finalY - margin
        : 0;
    };

    const getUnitKeywords = (unit) =>
      squadFields
        .filter(
          (f) => f.type === "switch" && f.id !== "isMinifigure" && unit[f.id]
        )
        .map((f) => f.label)
        .join(", ");

    const getMagikLines = (unit) => {
      if (!(unit.magik?.length > 0)) return [];
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      return doc.splitTextToSize(
        unit.magik.map(formatMagikEntry).join(", "),
        pageWidth - unitContentLeft - margin - 16
      );
    };

    const measureUnitBlockHeight = (unit) => {
      let height = lineHeight - 2;
      if (getUnitKeywords(unit)) height += 13;
      if (unit.specialties?.length > 0) height += 10;
      height += getMagikLines(unit).length * 10;
      height += measureTableHeight(buildStatsTableConfig(unit)) + 2;
      const weaponsHeight =
        unit.weapons?.length > 0
          ? measureTableHeight(buildWeaponsTableConfig(unit)) + 2
          : 0;
      const equipmentHeight =
        unit.equipment?.length > 0
          ? measureTableHeight(buildEquipmentTableConfig(unit)) + 2
          : 0;
      height += Math.max(weaponsHeight, equipmentHeight);
      return height + 10;
    };

    // --- SQUADS/UNITS ---
    squads.forEach((squad, idx) => {
      if (idx > 0 && y > margin) {
        // Draw a separator line between squads (but not at the top of a new page)
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(1);
        doc.line(margin, y, pageWidth - margin, y);
        y += 16; // Add more space after the line for clarity
      }

      // Keep the squad name together with its first unit: if the pair
      // doesn't fit in the remaining space, start a new page.
      let estimatedSquadBlockHeight = lineHeight;
      if (squad.units.length > 0) {
        estimatedSquadBlockHeight += measureUnitBlockHeight(squad.units[0]);
      }
      const pageHeight = doc.internal.pageSize.getHeight();
      if (y + estimatedSquadBlockHeight > pageHeight - margin && y > margin) {
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
        const keywords = getUnitKeywords(unit);

        // Move the entire unit block to the next page if it doesn't fit in
        // the remaining space (unless we're already at the top of a page,
        // in which case an oversized unit has to split anyway).
        const unitBlockHeight = measureUnitBlockHeight(unit);
        const pageHeight = doc.internal.pageSize.getHeight();
        if (y + unitBlockHeight > pageHeight - margin && y > margin) {
          doc.addPage();
          y = margin;
        }

        // Store the unit name and y position
        const unitNameX = unitContentLeft;
        let unitNameY = y;

        drawUnitHeader(doc, unit, unitNameX, unitNameY);
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
        // Add Magik
        const magikLines = getMagikLines(unit);
        if (magikLines.length > 0) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(50, 50, 50);
          doc.text(magikLines, unitNameX + 16, unitNameY);
          unitNameY += magikLines.length * 10;
        }
        let afterNameY = unitNameY;
        // --- UNIT STATS TABLE ---
        autoTable(doc, {
          ...buildStatsTableConfig(unit),
          startY: afterNameY,
          didDrawPage: (data) => {
            if (data.pageNumber > 1 || data.settings.startY < afterNameY) {
              drawUnitHeader(doc, unit, unitNameX, data.settings.margin.top);
            }
          },
        });
        let lastTableY = doc.lastAutoTable.finalY
          ? doc.lastAutoTable.finalY + 2
          : afterNameY + 24;
        y = lastTableY;
        // --- WEAPONS & EQUIPMENT TABLES SIDE BY SIDE ---
        const tableStartY = y;

        let lastWeaponTableY = tableStartY;
        let lastEquipmentTableY = tableStartY;

        if (unit.weapons?.length > 0) {
          autoTable(doc, {
            ...buildWeaponsTableConfig(unit),
            startY: tableStartY,
          });
          lastWeaponTableY = doc.lastAutoTable.finalY
            ? doc.lastAutoTable.finalY + 2
            : tableStartY + 20;
        }

        if (unit.equipment?.length > 0) {
          autoTable(doc, {
            ...buildEquipmentTableConfig(unit),
            startY: tableStartY,
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
          // Rebuild ALL IDs to ensure uniqueness and avoid key collisions
          // Start fresh so imported data doesn't clash with existing counters
          nextId = 1;

          const newSquads = (data.squads || []).map(remapSquad);

          setSquads(newSquads);
          setSelectedSquad(null);
          setSelectedUnit(null);
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
        if (field.id === "name") {
          return (
            <div className="flex flex-col gap-1">
              <Label htmlFor={field.id}>{renderLabel(field)}</Label>
              <div className="flex gap-2">
                <Select
                  value={unitForm.unitIcon || DEFAULT_UNIT_ICON}
                  onValueChange={(value) =>
                    setUnitForm({ ...unitForm, unitIcon: value })
                  }
                >
                  <SelectTrigger
                    className="w-[4.5rem] shrink-0"
                    aria-label="Unit icon"
                  >
                    <SelectValue>
                      <img
                        src={getUnitIconSrc(unitForm.unitIcon)}
                        alt=""
                        className={`h-6 w-6 ${unitIconImageClassName}`}
                      />
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {unitIcons.map((icon) => (
                      <SelectItem key={icon.id} value={icon.id}>
                        <span className="flex items-center gap-2">
                          <img
                            src={getUnitIconSrc(icon.id)}
                            alt=""
                            className={`h-6 w-6 ${unitIconImageClassName}`}
                          />
                          <span>{icon.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  id={field.id}
                  className="flex-1"
                  value={unitForm[field.id]}
                  onChange={(e) =>
                    setUnitForm({ ...unitForm, [field.id]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  required={field.required}
                />
              </div>
            </div>
          );
        }

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
              onWheel={
                field.type === "number"
                  ? (e) => e.currentTarget.blur()
                  : undefined
              }
              placeholder={field.placeholder}
              required={field.required}
              disabled={field.id === "power" && unitForm.isMinifigure}
              min={field.type === "number" ? field.min : undefined}
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
                  // When isMinifigure is toggled on, lock power at 1 and
                  // pre-fill typical minifigure stats (these stay editable).
                  ...(field.id === "isMinifigure" && checked
                    ? {
                        power: "1",
                        size: "1",
                        armor: "4",
                        move: "5",
                        value: "1",
                      }
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
    <main className="app-container py-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1.65rem]">
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
                  <X className="h-4 w-4" />
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
                <TabsList className="grid w-full grid-cols-5">
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
                  <TabsTrigger
                    value="magik"
                    disabled={!selectedUnit}
                    className={
                      !selectedUnit ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    Magik
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="unit" className="space-y-4">
                  <form
                    onSubmit={selectedUnit ? handleUpdateUnit : handleAddUnit}
                    className="space-y-4"
                  >
                    {squadFields
                      .filter(
                        (field) =>
                          field.id !== "equipment" && field.type !== "icon"
                      )
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
                              <SelectTrigger className="w-full">
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
                              onWheel={(e) => e.currentTarget.blur()}
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
                              onWheel={(e) => e.currentTarget.blur()}
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
                                <TableHead className={tableHeadActions}>
                                  Actions
                                </TableHead>
                                <TableHead className={tableHeadName}>Name</TableHead>
                                <TableHead className={tableHeadCenter}>Type</TableHead>
                                <TableHead className={tableHeadCenter}>Size</TableHead>
                                <TableHead className={tableHeadCenter}>Amount</TableHead>
                                <TableHead className={tableHeadCenter}>Use</TableHead>
                                <TableHead className={tableHeadCenter}>Range</TableHead>
                                <TableHead className={tableHeadCenter}>Damage</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedSquadData.units
                                .find((u) => u.id === selectedUnit)
                                ?.weapons?.map((weapon) => (
                                  <TableRow key={weapon.id}>
                                    <TableCell className={tableCellActions}>
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
                                    <TableCell className={tableCellName}>
                                      {weapon.name || weapon.type}
                                    </TableCell>
                                    <TableCell className={tableCellCenter}>{weapon.type}</TableCell>
                                    <TableCell className={tableCellCenter}>{weapon.size}</TableCell>
                                    <TableCell className={tableCellCenter}>{weapon.amount}</TableCell>
                                    <TableCell className={tableCellCenter}>{weapon.use}</TableCell>
                                    <TableCell className={tableCellCenter}>{weapon.range}</TableCell>
                                    <TableCell className={tableCellCenter}>{weapon.damage}</TableCell>
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
                              <SelectTrigger className="w-full">
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
                              onWheel={(e) => e.currentTarget.blur()}
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
                                <TableHead className={tableHeadActions}>
                                  Actions
                                </TableHead>
                                <TableHead className={tableHeadName}>Name</TableHead>
                                <TableHead className={tableHeadCenter}>Size</TableHead>
                                <TableHead className={tableHeadCenter}>Notes</TableHead>
                                <TableHead className={tableHeadCenter}>Cost</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedSquadData.units
                                .find((u) => u.id === selectedUnit)
                                ?.equipment?.map((equipment) => (
                                  <TableRow key={equipment.id}>
                                    <TableCell className={tableCellActions}>
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
                                    <TableCell className={tableCellName}>{equipment.type}</TableCell>
                                    <TableCell className={tableCellCenter}>{equipment.size}</TableCell>
                                    <TableCell className={tableCellCenter}>{equipment.notes}</TableCell>
                                    <TableCell className={tableCellCenter}>{equipment.cost}Ü</TableCell>
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
                            <SelectTrigger className="w-full">
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
                                <TableHead className={tableHeadActions}>
                                  Actions
                                </TableHead>
                                <TableHead className={tableHeadName}>Name</TableHead>
                                <TableHead className={tableHeadCenter}>Description</TableHead>
                                <TableHead className={tableHeadCenter}>Cost</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedSquadData.units
                                .find((u) => u.id === selectedUnit)
                                ?.specialties?.map((specialty) => (
                                  <TableRow key={specialty.id}>
                                    <TableCell className={tableCellActions}>
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
                                    <TableCell className={tableCellName}>{specialty.name}</TableCell>
                                    <TableCell className={tableCellCenter}>
                                      {specialty.description}
                                    </TableCell>
                                    <TableCell className={tableCellCenter}>{specialty.cost}Ü</TableCell>
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
                <TabsContent value="magik" className="space-y-4">
                  {selectedUnit ? (
                    <>
                      <form onSubmit={handleAddMagik} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="min-w-0 space-y-2">
                          <Label htmlFor="supernaturalDie">
                            SuperNatural Die
                          </Label>
                          <Select
                            value={magikForm.die}
                            onValueChange={(die) =>
                              setMagikForm((current) => ({ ...current, die }))
                            }
                          >
                            <SelectTrigger
                              id="supernaturalDie"
                              className="w-full"
                            >
                              <SelectValue placeholder="Select SuperNatural Die" />
                            </SelectTrigger>
                            <SelectContent>
                              {supernaturalDice.map((die) => (
                                <SelectItem key={die.die} value={die.die}>
                                  {die.die} · {die.element} ·{" "}
                                  {formatMagikCost(die.cost)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="min-w-0 space-y-2">
                          <Label htmlFor="supernaturalGenre">
                            SuperNatural Genre
                          </Label>
                          <Select
                            value={magikForm.genre}
                            onValueChange={(genre) =>
                              setMagikForm((current) => ({
                                ...current,
                                genre,
                                cliche: "",
                              }))
                            }
                          >
                            <SelectTrigger
                              id="supernaturalGenre"
                              className="w-full"
                            >
                              <SelectValue placeholder="Select genre" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(supernaturalCliches).map((genre) => (
                                <SelectItem key={genre} value={genre}>
                                  {genre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="min-w-0 space-y-2">
                          <Label htmlFor="supernaturalCliche">Cliché</Label>
                          <Select
                            value={magikForm.cliche}
                            disabled={!magikForm.genre}
                            onValueChange={(cliche) =>
                              setMagikForm((current) => ({
                                ...current,
                                cliche,
                              }))
                            }
                          >
                            <SelectTrigger
                              id="supernaturalCliche"
                              className="w-full"
                            >
                              <SelectValue
                                placeholder={
                                  magikForm.genre
                                    ? "Select cliché"
                                    : "Select a genre first"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {(supernaturalCliches[magikForm.genre] || []).map(
                                (cliche) => (
                                  <SelectItem key={cliche} value={cliche}>
                                    {cliche}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={
                            !magikForm.die ||
                            !magikForm.genre ||
                            !magikForm.cliche
                          }
                        >
                          Add SuperNatural Die
                        </Button>
                      </form>

                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium">
                          Current SuperNatural Dice
                        </h4>
                        <div className="max-h-[240px] overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className={tableHeadActions}>
                                  Actions
                                </TableHead>
                                <TableHead className={tableHeadCenter}>
                                  Die
                                </TableHead>
                                <TableHead className={tableHeadCenter}>
                                  Element
                                </TableHead>
                                <TableHead className={tableHeadName}>
                                  Genre
                                </TableHead>
                                <TableHead className={tableHeadName}>
                                  Cliché
                                </TableHead>
                                <TableHead className={tableHeadCenter}>
                                  Value
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedSquadData.units
                                .find((unit) => unit.id === selectedUnit)
                                ?.magik?.map((entry) => (
                                  <TableRow key={entry.id}>
                                    <TableCell className={tableCellActions}>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleDeleteMagik(entry.id)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                    <TableCell className={tableCellCenter}>
                                      {entry.die}
                                    </TableCell>
                                    <TableCell className={tableCellCenter}>
                                      {entry.element}
                                    </TableCell>
                                    <TableCell className={tableCellName}>
                                      {entry.genre}
                                    </TableCell>
                                    <TableCell className={tableCellName}>
                                      {entry.cliche}
                                    </TableCell>
                                    <TableCell className={tableCellCenter}>
                                      {formatMagikCost(entry.cost)}
                                    </TableCell>
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
                        Select a unit to manage Magik
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
              <DndContext
                sensors={dndSensors}
                collisionDetection={closestCenter}
                onDragEnd={({ active, over }) => {
                  if (over) handleReorderSquads(active.id, over.id);
                }}
              >
                <SortableContext
                  items={squads.map((squad) => squad.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={tableHeadActions}></TableHead>
                        <TableHead className={tableHeadName}>Squad Name</TableHead>
                        <TableHead className={tableHeadCenter}>Units</TableHead>
                        <TableHead className={tableHeadCenter}>Points</TableHead>
                        <TableHead className={tableHeadActions}>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {squads.map((squad) => (
                        <SortableRow key={squad.id} id={squad.id}>
                          {({
                            setNodeRef,
                            attributes,
                            listeners,
                            transform,
                            transition,
                            isDragging,
                          }) => (
                            <TableRow
                              ref={setNodeRef}
                              style={sortableRowStyle(
                                transform,
                                transition,
                                isDragging
                              )}
                              className={
                                selectedSquad === squad.id ? "bg-muted" : ""
                              }
                              onClick={() => {
                                setSelectedSquad(squad.id);
                                setSelectedUnit(null);
                                setUnitForm(initialUnitForm);
                                setWeaponForm({
                                  type: "",
                                  size: 1,
                                  amount: 1,
                                  name: "",
                                  use: 0,
                                  range: 0,
                                  damage: "",
                                });
                                setEquipmentForm({
                                  type: "",
                                  size: 1,
                                  notes: "",
                                });
                                setSpecialtyForm({
                                  type: "",
                                  group: "",
                                });
                                setMagikForm({
                                  die: "",
                                  genre: "",
                                  cliche: "",
                                });
                              }}
                            >
                              <DragHandleCell
                                attributes={attributes}
                                listeners={listeners}
                                className={tableCellActions}
                              />
                              <TableCell className={tableCellName}>
                                {squad.name}
                              </TableCell>
                              <TableCell className={tableCellCenter}>
                                {squad.units.reduce((total, unit) => total + (parseInt(unit.unit_number) || 1), 0)} ({squad.units.length})
                              </TableCell>
                              <TableCell className={tableCellCenter}>{calculateSquadPoints(squad)}Ü</TableCell>
                              <TableCell className={tableCellActions}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuplicateSquad(squad.id);
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
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
                          )}
                        </SortableRow>
                      ))}
                      {squads.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No squads created yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </SortableContext>
              </DndContext>
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
                <DndContext
                  sensors={dndSensors}
                  collisionDetection={closestCenter}
                  onDragEnd={({ active, over }) => {
                    if (over)
                      handleReorderUnits(
                        selectedSquadData.id,
                        active.id,
                        over.id
                      );
                  }}
                >
                  <SortableContext
                    items={selectedSquadData.units.map((unit) => unit.id)}
                    strategy={verticalListSortingStrategy}
                  >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={tableHeadActions}></TableHead>
                      {squadFields.filter(isUnitTableField).map((field) => (
                          <TableHead
                            key={field.id}
                            className={unitTableHeadClass(field.id)}
                          >
                            {field.label}
                          </TableHead>
                        ))}
                      <TableHead className={tableHeadActions}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                    <TableBody>
                    {selectedSquadData.units.map((unit) => (
                      <SortableRow key={unit.id} id={unit.id}>
                        {({
                          setNodeRef,
                          attributes,
                          listeners,
                          transform,
                          transition,
                          isDragging,
                        }) => (
                      <React.Fragment>
                        <TableRow
                          ref={setNodeRef}
                          style={sortableRowStyle(
                            transform,
                            transition,
                            isDragging
                          )}
                          className={selectedUnit === unit.id ? "bg-muted" : ""}
                          onClick={() => handleUnitClick(unit)}
                        >
                          <DragHandleCell
                            attributes={attributes}
                            listeners={listeners}
                            className={tableCellActions}
                          />
                          {squadFields.filter(isUnitTableField).map((field) => (
                              <TableCell
                                key={field.id}
                                className={unitTableCellClass(field.id)}
                              >
                                {field.id === "name" ? (
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={getUnitIconSrc(unit.unitIcon)}
                                      alt=""
                                      className={`h-6 w-6 ${unitIconImageClassName}`}
                                    />
                                    <span>{unit[field.id]}</span>
                                  </div>
                                ) : field.type === "select" ? (
                                  field.options
                                    .flatMap((group) => group.items)
                                    .find((item) => item.value === unit[field.id])
                                    ?.label || unit[field.id]
                                ) : field.id === "value" ? (
                                  <span>
                                    {unit[field.id]}{" "}
                                    <span className="text-muted-foreground">
                                      (Total:{" "}
                                      {calculateUnitPoints(unit) *
                                        (parseInt(unit.unit_number) || 1)}
                                      Ü)
                                    </span>
                                  </span>
                                ) : (
                                  unit[field.id]
                                )}
                              </TableCell>
                            ))}
                          <TableCell className={tableCellActions}>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateUnit(
                                  selectedSquadData.id,
                                  unit.id
                                );
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
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
                              colSpan={squadFields.filter(isUnitTableField).length + 2}
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
                              colSpan={squadFields.filter(isUnitTableField).length + 2}
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
                              colSpan={squadFields.filter(isUnitTableField).length + 2}
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
                        {unit.magik?.length > 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={squadFields.filter(isUnitTableField).length + 2}
                            >
                              <div className="flex flex-wrap gap-2">
                                {unit.magik.map((entry) => (
                                  <div
                                    key={entry.id}
                                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
                                  >
                                    {formatMagikEntry(entry)}
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                        {unit.weapons?.length > 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={squadFields.filter(isUnitTableField).length + 2}
                            >
                              <div className="pl-4">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className={tableHeadName}>Weapon</TableHead>
                                      <TableHead className={tableHeadCenter}>Size</TableHead>
                                      <TableHead className={tableHeadCenter}>Amount</TableHead>
                                      <TableHead className={tableHeadCenter}>Use</TableHead>
                                      <TableHead className={tableHeadCenter}>Range</TableHead>
                                      <TableHead className={tableHeadCenter}>Damage</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {unit.weapons.map((weapon) => (
                                      <TableRow key={weapon.id}>
                                        <TableCell className={tableCellName}>
                                          {weapon.name || weapon.type}
                                        </TableCell>
                                        <TableCell className={tableCellCenter}>{weapon.size}</TableCell>
                                        <TableCell className={tableCellCenter}>{weapon.amount}</TableCell>
                                        <TableCell className={tableCellCenter}>{weapon.use}</TableCell>
                                        <TableCell className={tableCellCenter}>{weapon.range}</TableCell>
                                        <TableCell className={tableCellCenter}>{weapon.damage}</TableCell>
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
                              colSpan={squadFields.filter(isUnitTableField).length + 2}
                            >
                              <div className="pl-4">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className={tableHeadName}>Equipment</TableHead>
                                      <TableHead className={tableHeadCenter}>Size</TableHead>
                                      <TableHead className={tableHeadCenter}>Notes</TableHead>
                                      <TableHead className={tableHeadCenter}>Cost</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {unit.equipment.map((equipment) => (
                                      <TableRow key={equipment.id}>
                                        <TableCell className={tableCellName}>{equipment.type}</TableCell>
                                        <TableCell className={tableCellCenter}>{equipment.size}</TableCell>
                                        <TableCell className={tableCellCenter}>{equipment.notes}</TableCell>
                                        <TableCell className={tableCellCenter}>{equipment.cost}Ü</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                        )}
                      </SortableRow>
                    ))}
                    </TableBody>
                </Table>
                  </SortableContext>
                </DndContext>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
