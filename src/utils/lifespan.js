import rubberCatalog from "../data/rubberCatalog";

export const LIFESPAN_BY_SKILL = {
  Pro: 80,
  Intermediate: 100,
  Amateur: 130,
};

const DURABILITY_BASELINE = 8.0;

const getCatalogEntry = (brand, series) => {
  const brandEntries = rubberCatalog[brand] ?? [];
  return brandEntries.find((entry) =>
    typeof entry === "string" ? entry === series : entry?.series === series
  );
};

export const getDurability = (brand, series) => {
  const entry = getCatalogEntry(brand, series);
  if (!entry || typeof entry === "string") return DURABILITY_BASELINE;
  return typeof entry.durable === "number" ? entry.durable : DURABILITY_BASELINE;
};

export const getMaxHours = (skillLevel, durability = DURABILITY_BASELINE) => {
  const baseLevelHours = LIFESPAN_BY_SKILL[skillLevel] ?? 100;
  const multiplier = durability / DURABILITY_BASELINE;
  return baseLevelHours * multiplier;
};

export const getHealth = (hoursPlayed, skillLevel, durability = DURABILITY_BASELINE) => {
  const max = getMaxHours(skillLevel, durability);
  const value = 100 - (hoursPlayed / max) * 100;
  return Math.max(0, Math.round(value));
};

export const getHealthColor = (healthPercent) => {
  if (healthPercent >= 70) return "#2ECC71";
  if (healthPercent >= 40) return "#F1C40F";
  return "#E74C3C";
};
