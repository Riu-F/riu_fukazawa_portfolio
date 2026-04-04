import type { BoardItem } from "../types";

/** Section order for known categories; others sort alphabetically after these. */
const CATEGORY_ORDER = ["life", "craft", "work"] as const;

const SECTION_LABELS: Record<string, string> = {
  life: "Life",
  craft: "Skills",
  work: "Work",
};

export function categorySectionLabel(category: string): string {
  return SECTION_LABELS[category] ?? category.charAt(0).toUpperCase() + category.slice(1);
}

export function categorySortKey(category: string): number {
  const i = CATEGORY_ORDER.indexOf(category as (typeof CATEGORY_ORDER)[number]);
  return i === -1 ? 100 + category.charCodeAt(0) : i;
}

export type MobileSection = {
  category: string;
  label: string;
  items: BoardItem[];
};

/**
 * Pull intro card off the list; bucket remaining items by `category` (stable order within bucket = layout order).
 */
export function groupItemsForMobileLayout(items: BoardItem[]): {
  intro: BoardItem | undefined;
  sections: MobileSection[];
} {
  const intro = items.find((i) => i.type === "instructionCard");
  const rest = items.filter((i) => i.type !== "instructionCard");

  const layoutIndex = new Map<string, number>();
  rest.forEach((it, i) => layoutIndex.set(it.id, i));

  const byCat = new Map<string, BoardItem[]>();
  for (const it of rest) {
    const cat = it.category?.trim() || "_other";
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat)!.push(it);
  }

  for (const list of byCat.values()) {
    list.sort((a, b) => (layoutIndex.get(a.id) ?? 0) - (layoutIndex.get(b.id) ?? 0));
  }

  const categories = [...byCat.keys()].sort((a, b) => {
    if (a === "_other") return 1;
    if (b === "_other") return -1;
    const da = categorySortKey(a);
    const db = categorySortKey(b);
    if (da !== db) return da - db;
    return a.localeCompare(b);
  });

  const sections: MobileSection[] = categories.map((category) => ({
    category,
    label: category === "_other" ? "More" : categorySectionLabel(category),
    items: byCat.get(category)!,
  }));

  return { intro, sections };
}
