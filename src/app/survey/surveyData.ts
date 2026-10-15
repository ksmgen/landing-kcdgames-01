import type { LucideIcon } from "lucide-react";
import {
  Armchair,
  Boxes,
  PartyPopper,
  ShoppingBag,
  Store,
  Table,
} from "lucide-react";
import retailersData from "../../data/retailers.json";

export type SurveyRetailer = {
  id: number;
  name: string;
  address: string;
  region: string;
  country: string;
  storeType: string;
  playing: boolean;
};

export const RETAILERS = retailersData as unknown as SurveyRetailer[];

/**
 * Demo-only chain prefixes. Rows whose name starts with one of these prefixes
 * are grouped into a simulated multi-branch chain, except rows whose name is
 * exactly the prefix (the ambiguous bare HQ), which stay standalone.
 */
export const CHAIN_PREFIXES = [
  "Box Hunt -",
  "Impulse Gaming",
  "Games Haven",
  "Ace Cards & Collectibles",
  "TCG Malaysia",
] as const;

export type ChainGroup = {
  slug: string;
  label: string;
  prefix: string;
  branches: SurveyRetailer[];
};

export type PictureSample = {
  id: string;
  label: string;
  description: string;
  gradient: string;
  icon: LucideIcon;
};

function chainSlug(prefix: string): string {
  return prefix
    .replace(/[-\s]+$/, "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildChainGroups(retailers: SurveyRetailer[]): ChainGroup[] {
  return CHAIN_PREFIXES.map((prefix) => ({
    slug: chainSlug(prefix),
    label: prefix.replace(/[-\s]+$/, "").trim(),
    prefix,
    branches: retailers.filter(
      (retailer) =>
        retailer.name.startsWith(prefix) && retailer.name !== prefix,
    ),
  }));
}

export function buildStandaloneRetailers(
  retailers: SurveyRetailer[],
  groups: ChainGroup[],
): SurveyRetailer[] {
  const groupedIds = new Set(
    groups.flatMap((group) => group.branches.map((branch) => branch.id)),
  );
  return retailers.filter((retailer) => !groupedIds.has(retailer.id));
}

export const CHAIN_GROUPS = buildChainGroups(RETAILERS);
export const STANDALONE_RETAILERS = buildStandaloneRetailers(
  RETAILERS,
  CHAIN_GROUPS,
);

export type ShopValue = {
  selection: string;
  branchId: number;
};

export function emptyShopValue(): ShopValue {
  return { selection: "", branchId: 0 };
}

function chainBySlug(slug: string): ChainGroup | undefined {
  return CHAIN_GROUPS.find((group) => group.slug === slug);
}

function standaloneById(id: number): SurveyRetailer | undefined {
  return STANDALONE_RETAILERS.find((retailer) => retailer.id === id);
}

export type ResolvedShop = {
  retailer: SurveyRetailer;
  chain: ChainGroup | null;
};

/**
 * Resolve the shop value to the original JSON row it points at. Returns null
 * for empty, malformed, or stale selections (rows that no longer exist).
 */
export function resolveShop(shop: ShopValue): ResolvedShop | null {
  if (typeof shop.selection !== "string" || shop.selection === "") return null;

  if (shop.selection.startsWith("chain:")) {
    const group = chainBySlug(shop.selection.slice("chain:".length));
    if (!group) return null;
    if (!Number.isInteger(shop.branchId) || shop.branchId <= 0) return null;
    const branch = group.branches.find((row) => row.id === shop.branchId);
    if (!branch) return null;
    return { retailer: branch, chain: group };
  }

  if (shop.selection.startsWith("retailer:")) {
    const id = Number(shop.selection.slice("retailer:".length));
    if (!Number.isInteger(id) || id <= 0) return null;
    const retailer = standaloneById(id);
    if (!retailer || shop.branchId !== 0) return null;
    return { retailer, chain: null };
  }

  return null;
}

export const SHOP_SELECTION_PATTERN = /^(chain:[a-z0-9-]+|retailer:\d+)$/;

/** Format a branch choice from the original JSON row: id, name and address. */
export function branchOptionLabel(retailer: SurveyRetailer): string {
  return `${retailer.id} — ${retailer.name} — ${retailer.address}`;
}

export const RETAIL_AREA_SAMPLES: PictureSample[] = [
  {
    id: "retail-card-wall",
    label: "Card wall & shelf display",
    description: "Simulated shop photo — binders and boxes along a bright card wall.",
    gradient: "from-amber-400/40 via-orange-500/30 to-navy-800",
    icon: Boxes,
  },
  {
    id: "retail-glass-counter",
    label: "Glass display counter",
    description: "Simulated shop photo — singles and accessories behind a glass counter.",
    gradient: "from-sky-400/40 via-blue-500/30 to-navy-800",
    icon: ShoppingBag,
  },
  {
    id: "retail-wide-aisles",
    label: "Wide aisle shelving",
    description: "Simulated shop photo — stocked shelving down a wide retail aisle.",
    gradient: "from-emerald-400/40 via-teal-500/30 to-navy-800",
    icon: Store,
  },
];

export const PLAY_AREA_SAMPLES: PictureSample[] = [
  {
    id: "play-table-rows",
    label: "Rows of play tables",
    description: "Simulated shop photo — tidy rows of tables set up for organised play.",
    gradient: "from-violet-400/40 via-purple-500/30 to-navy-800",
    icon: Table,
  },
  {
    id: "play-event-space",
    label: "Dedicated event space",
    description: "Simulated shop photo — an open event area with banner and stage tables.",
    gradient: "from-rose-400/40 via-red-500/30 to-navy-800",
    icon: PartyPopper,
  },
  {
    id: "play-corner-nook",
    label: "Corner play nook",
    description: "Simulated shop photo — a cosy corner nook with a few small tables.",
    gradient: "from-cyan-400/40 via-sky-500/30 to-navy-800",
    icon: Armchair,
  },
];

export const PICTURE_SAMPLE_IDS = new Set(
  [...RETAIL_AREA_SAMPLES, ...PLAY_AREA_SAMPLES].map((sample) => sample.id),
);

export function findPictureSample(
  id: string,
  samples: PictureSample[],
): PictureSample | null {
  return samples.find((sample) => sample.id === id) ?? null;
}
