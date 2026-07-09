import pawnIcon from "@/assets/unit_icons/icons8-pawn-48.png";
import knightIcon from "@/assets/unit_icons/icons8-knight-48.png";
import tankIcon from "@/assets/unit_icons/icons8-tank-48.png";
import dragonIcon from "@/assets/unit_icons/icons8-dragon-48.png";
import monsterIcon from "@/assets/unit_icons/icons8-monster-48.png";
import gatlingGunIcon from "@/assets/unit_icons/icons8-gatling-gun-48.png";
import spaceShipIcon from "@/assets/unit_icons/icons8-space-ship-48.png";
import rocketBootIcon from "@/assets/unit_icons/icons8-rocket-boot-48.png";
import catapultIcon from "@/assets/unit_icons/icons8-catapult-48.png";
import fighterJetIcon from "@/assets/unit_icons/icons8-fighter-jet-48.png";
import submarineIcon from "@/assets/unit_icons/icons8-submarine-u-1-48.png";
import shipIcon from "@/assets/unit_icons/icons8-ship-48.png";
import wizardIcon from "@/assets/unit_icons/icons8-wizard-48.png";
import doctorIcon from "@/assets/unit_icons/icons8-doctors-bag-48.png";
import crownIcon from "@/assets/unit_icons/icons8-crown-48.png";
import commanderIcon from "@/assets/unit_icons/icons8-commander-48.png";
import archerIcon from "@/assets/unit_icons/icons8-archer-48.png";
import sniperRifleIcon from "@/assets/unit_icons/icons8-sniper-rifle-48.png";
import gunIcon from "@/assets/unit_icons/icons8-gun-48.png";
import sledgehammerIcon from "@/assets/unit_icons/icons8-sledgehammer-48.png";
import orcIcon from "@/assets/unit_icons/icons8-orc-48.png";

export const DEFAULT_UNIT_ICON = "pawn";

export const unitIcons = [
  { id: "pawn", label: "Regular", src: pawnIcon },
  { id: "archer", label: "Archer", src: archerIcon },
  { id: "gun", label: "Gun", src: gunIcon },
  { id: "sniper-rifle", label: "Sniper", src: sniperRifleIcon },
  { id: "gatling-gun", label: "Heavy", src: gatlingGunIcon },
  { id: "sledgehammer", label: "Hammer", src: sledgehammerIcon },
  { id: "rocket-boot", label: "Flyer", src: rocketBootIcon },
  { id: "knight", label: "Cavalry", src: knightIcon },
  { id: "wizard", label: "Wizard", src: wizardIcon },
  { id: "doctor", label: "Medik", src: doctorIcon },
  { id: "crown", label: "Hero", src: crownIcon },
  { id: "commander", label: "Commander", src: commanderIcon },
  { id: "tank", label: "Tank", src: tankIcon },
  { id: "catapult", label: "Artillery", src: catapultIcon },
  { id: "orc", label: "Orc", src: orcIcon },
  { id: "dragon", label: "Dragon", src: dragonIcon },
  { id: "monster", label: "Monster", src: monsterIcon },
  { id: "space-ship", label: "Space Ship", src: spaceShipIcon },
  { id: "fighter-jet", label: "Fighter Jet", src: fighterJetIcon },
  { id: "submarine", label: "Submarine", src: submarineIcon },
  { id: "ship", label: "Ship", src: shipIcon },
];

const iconById = new Map(unitIcons.map((icon) => [icon.id, icon]));
const base64Cache = new Map();

const resolveSrc = (src) => (typeof src === "string" ? src : src?.src || "");

export const getUnitIcon = (id) =>
  iconById.get(id) || iconById.get(DEFAULT_UNIT_ICON);

export const getUnitIconSrc = (id) => resolveSrc(getUnitIcon(id)?.src);

export const unitIconImageClassName =
  "object-contain rounded dark:bg-white dark:p-0.5";

export const getUnitIconBase64 = async (id) => {
  const icon = getUnitIcon(id);
  const cacheKey = icon.id;

  if (base64Cache.has(cacheKey)) {
    return base64Cache.get(cacheKey);
  }

  const response = await fetch(resolveSrc(icon.src));
  const blob = await response.blob();
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  base64Cache.set(cacheKey, dataUrl);
  return dataUrl;
};

export const preloadUnitIconBase64 = async () => {
  await Promise.all(unitIcons.map((icon) => getUnitIconBase64(icon.id)));
  return base64Cache;
};
