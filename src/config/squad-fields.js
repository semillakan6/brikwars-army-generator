export const squadFields = [
  {
    id: "name",
    label: "Unit Name",
    type: "text",
    placeholder: "Enter unit name",
    required: true
  },
  {
    id: "unit_number",
    label: "Unit Amount",
    type: "text",
    placeholder: "Amount of the Same Unit",
    required: true
  },
  {
    id: "size",
    label: "Size",
    type: "number",
    icon: "/icons/size.svg"
  },
  {
    id: "armor",
    label: "Armor",
    type: "text",
    min: 0,
    max: 10,
    icon: "/icons/armour.svg"
  },
  {
    id: "power",
    label: "Power",
    type: "number",
    min: 1,
    max: 10,
    icon: "/icons/power.svg"
  },
  {
    id: "isMinifigure",
    label: "Is a minifigure?",
    type: "switch",
    required: false
  },
  {
    id: "hasDeflection",
    label: "Has Deflection",
    type: "switch",
    required: false,
    icon: "/icons/armour.svg"
  },
  {
    id: "action",
    label: "Action",
    type: "text",
    placeholder: "Action",
    required: true,
    icon: "/icons/mind.svg"
  },
  {
    id: "move",
    label: "Move",
    type: "text",
    placeholder: "Move",
    required: true,
    icon: "/icons/move_range.svg"
  },
  {
    id: "value",
    label: "Value",
    type: "number",
    min: 1,
    max: 100,
    icon: "/icons/value.svg"
  },
  {
    id: "custom_notes",
    label: "Custom Notes",
    type: "textarea",
    placeholder: "Enter any custom equipment or specialty notes",
    required: false
  }
]; 