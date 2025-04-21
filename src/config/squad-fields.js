export const squadFields = [
  {
    id: "name",
    label: "Unit Name",
    type: "text",
    placeholder: "Enter unit name",
    required: true
  },
  {
    id: "size",
    label: "Size",
    type: "text",
    placeholder: "Inches",
    required: true
  },
  {
    id: "armor",
    label: "Armor",
    type: "text",
    placeholder: "Armor",
    required: true
  },
  {
    id: "power",
    label: "Power",
    type: "number",
    placeholder: "Power",
    required: true
  },
  {
    id: "isMinifigure",
    label: "Is a minifigure?",
    type: "switch",
    required: false
  },
  {
    id: "action",
    label: "Action",
    type: "text",
    placeholder: "Action",
    required: true
  },
  {
    id: "value",
    label: "Value",
    type: "number",
    placeholder: "Value",
    required: true
  },
  {
    id: "equipment",
    label: "Equipment",
    type: "select",
    options: [
      {
        group: "Weapons",
        items: [
          { value: "weapon1", label: "Weapon 1" },
          { value: "weapon2", label: "Weapon 2" }
        ]
      },
      {
        group: "Armor",
        items: [
          { value: "armor1", label: "Armor 1" },
          { value: "armor2", label: "Armor 2" }
        ]
      }
    ],
    required: false
  }
]; 