export const specialtyGroups = {
  Civilians: {
    civilian: {
      name: "Civilized",
      description: "Units are controlled by Mob Rule.",
      cost: 0,
    },
    professional: {
      name: "Professional Job Training",
      shortname: "1d6 Training",
      mention: "skill",
      description: "Improves Action Die to 1d6 for specific job-related tasks.",
      cost: 0,
    },
  },
  Infantry: {
    worker: {
      name: "Worker's Job Training",
      shortname: "1d6 Training",
      mention: "skill",
      description: "All Workers are Half-Minded - either Programmed, Submissive, or Subjugated. \nImproves Action Die to 1d6 for specific job-related tasks",
      cost: -0.5,
    },
    cannon_fodder: {
      name: "Irrelevant",
      description: "Attacks do 1 point of Damage; Actions never go Over the Top; Effective Size 0''; unit can Respawn endlessly but it doesn't matter.",
      cost: -0.5,
    },
    skirmisher: {
      name: "Harassment",
      description: "Unit can Disengage from Close Combat freely without drawing Counterattacks.",
      cost: 0,
    },
    scout: {
      name: "Pathfinding/Tracking",
      shortname: "1d8 vs FH",
      mention: "skill",
      description: "1d8 Action when rolling vs. Field Hazards; stops safely before setting off Concealed Hazards for self and others. \nAutomatically detects hidden or invisible units, Traps, and Triggers. \nAllows Marking of a target for allied visibility and a +1 Action Bonus to Ranged Attacks.",
      cost: 0,
    },
    phalanx: {
      name: "Shield Wall",
      description: "Units can cooperate to form a shield wall, automatically Parrying all damage from one direction. \nSpecialty: March \nMarching in formation ignore movement penalties from Heavy Armor while walking. \nIf a Marching minifig is in a Squad with at least one other Marching minifig, they can March in formation, walking at normal speed and ignoring Movement penalties from Heavy Armor.",
      cost: 0,
    },
    marksman: {
      name: "Aiming",
      description: "Can Aim a Ranged attack as a full-turn Action, using a Specialty 1d8 to replace the Action Roll, replace a Damage die, or to add inches to Range.",
      cost: 0,
    },
    sniper: {
      name: "Sniping",
      description: "Can Snipe with a scoped Long-Ranged Weapon as a full-turn Action, Automatically Hitting targets at least 5'' away.",
      cost: 0,
    },
    heavy: {
      name: "Compensating",
      description: "When standing still, can use weapons 1'' larger than normally allowed.",
      cost: 0,
    },
  },
  Operators: {
    rider: {
      name: "Horsemanship",
      description: "Can control a steed or vehicle and make attacks with handheld weapons as part of a single Action.",
      cost: 0,
    },
    pilot: {
      name: "Stunt Driving (1d8)",
      shortname: "1d8 Stunt Driving",
      mention: "skill",
      description: "Once a turn, defy a controlled vehicle's movement limitations for up to Specialty d8 Stunt Inches.",
      cost: 0,
    },
    gunner: {
      name: "Gunnery (1d8)",
      description: "Action Specialty d8 with mounted weapons; allows Gunnery Support Action.",
      cost: 0,
    },
  },
  Support: {
    tek: {
      name: "Assistance",
      description: "Use Action to boost another Specialist's Specialty die",
      cost: 0,
    },
    mechanik: {
      name: "Mechanikal Aptitude (1d8)",
      shortname: "1d8 Construction",
      mention: "skill",
      description: "Allows a Construction Action to build or repair creations on enemy turns within a radius of Specialty d8 inches.",
      cost: 0,
    },
    engineer: {
      name: "Rationalism (1d8)",
      shortname: "1d8 Rationalize",
      mention: "skill",
      description: "Allows a Construction Action to Rationalize Specialty d8 modifications to existing objects and devices. (See Table of Rationalizations)",
      cost: 0,
    },
    medik: {
      name: "Ker-Triage! (1d8)",
      shortname: "1d8 Medikal",
      mention: "skill",
      description: "Allows a Construction Action to roll Specialty d8 (or a d6 if he's improvising without proper tools) on the Ker-Triage! Table to revive fallen minifigs and creatures. \nIf the Medik's Construction Action is interrupted, he still makes the Ker-Triage! Roll and removes the number of limbs indicated, but the patient is not revived. ",
      cost: 0,
    },
    cybernetik: {
      name: "Mad Science (1d6)",
      description: "Allows a Construction Action to combine mechanikal and biologikal creations within Specialty d6 inches",
      cost: 0,
    },
  },
  "Elite Units": {
    commando: {
      name: "Field Training",
      description: "Can copy any ally's Specialty marked with a Specialty die, using a Specialty die one size smaller",
      cost: 0,
    },
    hero: {
      name: "Heroic Ego",
      description: "Can take one Heroic Feat per turn appropriate to his Cliché; can inspire nearby friendly units (within an 1d10 Roll worth of inches) to RedShirt and take damage meant for the Hero; becomes Cranky in the presence of other Heroic units or items",
      cost: 1,
    },
  },
  "Command Units": {
    officer: {
      name: "Coordination (1d8)",
      shortname: "1d8 Coordination",
      mention: "skill",
      description: "Can spend an Action to improve the Action Dice of his Squad mates by one die size, up to 1d8, for one combined Action",
      cost: 0,
    },
    leader: {
      name: "Inspiration (1d6)",
      shortname: "1d8 Inspiration",
      mention: "skill",
      description: "Can spend an Action and use a Motivational Tool to grant a Specialty d6 Action re-roll or to add Specialty d6 to an attribute for a target unit or Squad",
      cost: 0,
    },
    commander: {
      name: "Strategic Intervention",
      description: "Can spend an Action and use a communications Tool to gain one Strategy brick after witnessing a successful kill, or to spend Strategy bricks on Strategic Interventions.",
      cost: 0,
    },
    great_leader: {
      name: "Megalomania (+1Ü)",
      description: "Can ScapeGoat subordinate units; Can make a Great Speech to convert casualties into Outrage Bennies.",
      cost: 1,
    },
  },
  Monsters: {
    bigfig: {
      name: "Bigfig",
      description: "The bigfig is a combat monster, as strong as a Horse and with the extra combat punch of an 1d8.",
      cost: 0,
    },
    brutefig: {
      name: "Brutefig",
      shortname: "Stupidity",
      mention: "skill",
      description: "Brutefigs have a standard Action d6 Mind, but they have enhanced opportunities for Stupidity as if they were Incompetent.",
      cost: 0,
    },
  },
}; 