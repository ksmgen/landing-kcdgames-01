import type { LucideIcon } from "lucide-react";
import {
  Armchair,
  Boxes,
  PartyPopper,
  ShoppingBag,
  Store,
  Table,
} from "lucide-react";
import shopOptions from "../../../public/data/survey-shop-options.json";

/** A branch row from the authoritative shop-options JSON (string MongoDB id). */
export type BranchRow = {
  id: string;
  serial: string;
  name: string;
  address: string;
  region: string;
  country: string;
  playing: boolean;
  storeType: string;
};

/** A standalone retailer row from the authoritative shop-options JSON. */
export type StandaloneRow = BranchRow;

/** Authoritative chain group sourced from the public shop-options JSON. */
export type ChainGroup = {
  slug: string;
  label: string;
  prefix: string;
  branches: BranchRow[];
};

/** All chain groups from the authoritative source. */
export const CHAIN_GROUPS: ChainGroup[] = shopOptions.chainGroups;

/** All standalone retailers from the authoritative source. */
export const STANDALONE_RETAILERS: StandaloneRow[] = shopOptions.standaloneRetailers;

export type PictureSample = {
  id: string;
  label: string;
  description: string;
  gradient: string;
  icon: LucideIcon;
};

export type ShopValue = {
  selection: string;
  branchId: string;
};

export function emptyShopValue(): ShopValue {
  return { selection: "", branchId: "" };
}

function chainBySlug(slug: string): ChainGroup | undefined {
  return CHAIN_GROUPS.find((group) => group.slug === slug);
}

function standaloneById(id: string): StandaloneRow | undefined {
  return STANDALONE_RETAILERS.find((retailer) => retailer.id === id);
}

export type ResolvedShop = {
  retailer: BranchRow;
  chain: ChainGroup | null;
};

/**
 * Resolve the shop value to the authoritative row it points at.
 * Returns null for empty, malformed, or stale selections — including
 * drafts that use old numeric ids or no longer match any row.
 */
export function resolveShop(shop: ShopValue): ResolvedShop | null {
  if (typeof shop.selection !== "string" || shop.selection === "") return null;

  if (shop.selection.startsWith("chain:")) {
    const group = chainBySlug(shop.selection.slice("chain:".length));
    if (!group) return null;
    if (!shop.branchId) return null;
    const branch = group.branches.find((row) => row.id === shop.branchId);
    if (!branch) return null;
    return { retailer: branch, chain: group };
  }

  if (shop.selection.startsWith("retailer:")) {
    const id = shop.selection.slice("retailer:".length);
    if (id === "") return null;
    const retailer = standaloneById(id);
    if (!retailer || shop.branchId !== "") return null;
    return { retailer, chain: null };
  }

  return null;
}

export const SHOP_SELECTION_PATTERN = /^(chain:[a-z0-9-]+|retailer:[a-f0-9]{24})$/;

/** Format a branch choice: serial, name, and address. */
export function branchOptionLabel(retailer: BranchRow): string {
  return `${retailer.serial} — ${retailer.name} — ${retailer.address}`;
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
