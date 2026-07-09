export const supernaturalDice = [
  { die: "d4", element: "Fire", cost: 0.5 },
  { die: "d6", element: "Earth", cost: 1 },
  { die: "d8", element: "Air", cost: 1 },
  { die: "d10", element: "Metal", cost: 2 },
  { die: "d12", element: "Magik", cost: 2 },
];

export const supernaturalCliches = {
  Wizard: [
    "Necromancer",
    "Pyromancer",
    "Proxymancer",
    "Pantsomancer",
  ],
  "Comic Book Character": [
    "Super Strong Guy",
    "Super Fast Guy",
    "Super Spider Guy",
    "Super Wonder Lady Guy",
  ],
  "Martial Artist": [
    "Mystik Ninja",
    "Jet-Eye Knight",
    "Wandering Monk",
    "Playtrix Hacker",
  ],
  "Religionist Zealot": [
    "BrikThulhian Kultist",
    "Holy Clerik",
    "Rules Lawyer",
  ],
  Psychik: [
    "Pyrotechnik",
    "Telekinetik",
    "Mindcontrolnik",
    "Psychotherapeutik",
  ],
  "Sci-Fi": [
    "Mad Scientist",
    "Energy-Based LifeForm",
    "Tek Wizard",
  ],
  Abomination: [
    "Nega-Daemon",
    "Baalvillain",
    "Vampire",
    "Ghost",
  ],
};

export const formatMagikCost = (cost) =>
  Number(cost) === 0.5 ? "½Ü" : `${Number(cost) || 0}Ü`;
