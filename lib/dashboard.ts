import {
  ideas,
  aanbeveling,
  spoorMeta,
  categoryMeta,
  type IncomeSpoor,
  type IdeaCategory,
  type MoneyIdea,
} from "@/data/ideas";

export type DashboardStats = {
  totaalIdeeën: number;
  actiefIdeeën: number;
  dezeWeek: number;
  dezeMaand: number;
  later: number;
  topScore: number;
  topIdea: MoneyIdea;
  recommended: MoneyIdea[];
  perSpoor: Record<IncomeSpoor, { count: number; top: MoneyIdea | null }>;
  perCategorie: Record<IdeaCategory, MoneyIdea[]>;
  topVijf: MoneyIdea[];
};

const spoorOrder: IncomeSpoor[] = [
  "verkopen",
  "uren",
  "netwerk",
  "doorverkoop",
  "recurring",
];

export function getDashboardStats(): DashboardStats {
  const actief = ideas.filter((i) => i.category !== "later");
  const topVijf = [...actief].sort((a, b) => b.totaal - a.totaal).slice(0, 5);
  const topIdea = topVijf[0];

  const perSpoor = spoorOrder.reduce(
    (acc, spoor) => {
      const items = actief.filter((i) => i.spoor === spoor);
      acc[spoor] = {
        count: items.length,
        top: items.sort((a, b) => b.totaal - a.totaal)[0] ?? null,
      };
      return acc;
    },
    {} as DashboardStats["perSpoor"]
  );

  return {
    totaalIdeeën: ideas.length,
    actiefIdeeën: actief.length,
    dezeWeek: ideas.filter((i) => i.category === "deze-week").length,
    dezeMaand: ideas.filter((i) => i.category === "deze-maand").length,
    later: ideas.filter((i) => i.category === "later").length,
    topScore: topIdea?.totaal ?? 0,
    topIdea,
    recommended: ideas.filter((i) => i.recommended),
    perSpoor,
    perCategorie: {
      "deze-week": ideas.filter((i) => i.category === "deze-week"),
      "deze-maand": ideas.filter((i) => i.category === "deze-maand"),
      later: ideas.filter((i) => i.category === "later"),
    },
    topVijf,
  };
}

export { spoorOrder, aanbeveling, spoorMeta, categoryMeta };