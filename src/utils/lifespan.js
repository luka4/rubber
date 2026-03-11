export const LIFESPAN_BY_SKILL = {
  Pro: 80,
  Intermediate: 100,
  Amateur: 130,
};

export const getHealth = (hoursPlayed, skillLevel) => {
  const max = LIFESPAN_BY_SKILL[skillLevel] ?? 100;
  const value = 100 - (hoursPlayed / max) * 100;
  return Math.max(0, Math.round(value));
};

export const getHealthColor = (healthPercent) => {
  if (healthPercent >= 70) return "#2ECC71";
  if (healthPercent >= 40) return "#F1C40F";
  return "#E74C3C";
};
