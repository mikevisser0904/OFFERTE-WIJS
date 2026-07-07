export const SEVERITY_WEIGHT = {
  info: 2,
  low: 8,
  medium: 15,
  high: 25,
  critical: 40,
};

export const NIVEAU_FROM_SCORE = [
  { max: 15, niveau: "ok", label: "OK" },
  { max: 35, niveau: "let-op", label: "Let op" },
  { max: 60, niveau: "hoog", label: "Hoog" },
  { max: 101, niveau: "kritiek", label: "Kritiek" },
];