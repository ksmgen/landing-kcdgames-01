import { describe, expect, it } from "vitest";
import {
  CHAIN_GROUPS,
  CHAIN_PREFIXES,
  RETAILERS,
  SHOP_SELECTION_PATTERN,
  STANDALONE_RETAILERS,
  branchOptionLabel,
  buildChainGroups,
  buildStandaloneRetailers,
  emptyShopValue,
  resolveShop,
  type SurveyRetailer,
} from "./surveyData";

describe("retailer demo chain grouping", () => {
  it("builds exactly the five demo chains from the retailer JSON", () => {
    expect(CHAIN_GROUPS).toHaveLength(5);
    expect(CHAIN_PREFIXES).toEqual([
      "Box Hunt -",
      "Impulse Gaming",
      "Games Haven",
      "Ace Cards & Collectibles",
      "TCG Malaysia",
    ]);

    const bySlug = new Map(CHAIN_GROUPS.map((group) => [group.slug, group]));
    expect(Array.from(bySlug.keys())).toEqual([
      "box-hunt",
      "impulse-gaming",
      "games-haven",
      "ace-cards-collectibles",
      "tcg-malaysia",
    ]);

    expect(bySlug.get("box-hunt")!.label).toBe("Box Hunt");
    expect(bySlug.get("box-hunt")!.branches).toHaveLength(28);
    expect(bySlug.get("impulse-gaming")!.branches).toHaveLength(7);
    expect(bySlug.get("games-haven")!.branches).toHaveLength(3);
    expect(bySlug.get("ace-cards-collectibles")!.branches).toHaveLength(2);
    expect(bySlug.get("tcg-malaysia")!.branches).toHaveLength(2);
  });

  it("keeps every branch row inside its prefix", () => {
    for (const group of CHAIN_GROUPS) {
      for (const branch of group.branches) {
        expect(branch.name.startsWith(group.prefix)).toBe(true);
        expect(branch.name === group.prefix).toBe(false);
      }
    }
  });

  it("keeps the ambiguous bare HQ standalone instead of grouping it", () => {
    const bareTcgMalaysia = STANDALONE_RETAILERS.find(
      (retailer) => retailer.id === 52,
    );
    expect(bareTcgMalaysia?.name).toBe("TCG Malaysia");
    expect(
      CHAIN_GROUPS.every(
        (group) =>
          !group.branches.some((branch) => branch.id === bareTcgMalaysia?.id),
      ),
    ).toBe(true);

    // A similar-sounding row that does not match the exact prefix stays standalone too.
    expect(
      STANDALONE_RETAILERS.some((retailer) => retailer.id === 174),
    ).toBe(true);
    const aceCards = STANDALONE_RETAILERS.find(
      (retailer) => retailer.id === 174,
    );
    expect(aceCards?.name).toBe("Ace Cards Sdn Bhd");
  });

  it("offers every JSON entry exactly once across chains and standalone", () => {
    expect(RETAILERS).toHaveLength(237);

    const branchIds = CHAIN_GROUPS.flatMap((group) =>
      group.branches.map((branch) => branch.id),
    );
    const standaloneIds = STANDALONE_RETAILERS.map((retailer) => retailer.id);

    const all = [...branchIds, ...standaloneIds];
    expect(new Set(all).size).toBe(all.length);
    expect(new Set(all)).toEqual(new Set(RETAILERS.map((row) => row.id)));
  });

  it("lists branch choices with the original row id, name, and address", () => {
    expect(
      branchOptionLabel({
        id: 13,
        name: "Games Haven Southkey",
        address: "20a, Jalan SS 3/31, Taman Universiti, 47300 Petaling Jaya, Selangor",
        region: "SELANGOR",
        country: "Malaysia",
        storeType: "hobby",
        playing: true,
      }),
    ).toBe(
      "13 — Games Haven Southkey — 20a, Jalan SS 3/31, Taman Universiti, 47300 Petaling Jaya, Selangor",
    );
  });

  it("groups rows by name prefix against a minimal fixture", () => {
    const fixture: SurveyRetailer[] = [
      {
        id: 1,
        name: "Box Hunt - Mall A",
        address: "Addr A",
        region: "JOHOR",
        country: "Malaysia",
        storeType: "retail",
        playing: false,
      },
      {
        id: 2,
        name: "Box Hunt",
        address: "Addr HQ",
        region: "JOHOR",
        country: "Malaysia",
        storeType: "retail",
        playing: false,
      },
      {
        id: 3,
        name: "Solo Shop",
        address: "Addr S",
        region: "KUALA LUMPUR",
        country: "Malaysia",
        storeType: "hobby",
        playing: true,
      },
    ];

    const groups = buildChainGroups(fixture);
    expect(groups.find((group) => group.slug === "box-hunt")!.branches).toEqual([
      expect.objectContaining({ id: 1 }),
    ]);

    const standalone = buildStandaloneRetailers(fixture, groups);
    expect(standalone.map((row) => row.id)).toEqual([2, 3]);
  });
});

describe("resolveShop", () => {
  it("resolves a standalone retailer selection to the original row", () => {
    const resolved = resolveShop({ selection: "retailer:52", branchId: 0 });
    expect(resolved?.retailer.name).toBe("TCG Malaysia");
    expect(resolved?.chain).toBeNull();
  });

  it("resolves a chain selection plus branch id to the branch row", () => {
    const resolved = resolveShop({ selection: "chain:games-haven", branchId: 13 });
    expect(resolved?.retailer.name).toBe("Games Haven Southkey");
    expect(resolved?.chain?.label).toBe("Games Haven");
  });

  it("rejects empty, malformed, and stale selections", () => {
    expect(resolveShop(emptyShopValue())).toBeNull();
    expect(resolveShop({ selection: "", branchId: 0 })).toBeNull();
    expect(resolveShop({ selection: "retailer:999999", branchId: 0 })).toBeNull();
    expect(resolveShop({ selection: "chain:unknown-slug", branchId: 13 })).toBeNull();
    expect(
      resolveShop({ selection: "chain:games-haven", branchId: 999999 }),
    ).toBeNull();
    expect(resolveShop({ selection: "chain:games-haven", branchId: 0 })).toBeNull();
    // Chain member rows are not valid direct selections; use the branch picker.
    expect(resolveShop({ selection: "retailer:13", branchId: 0 })).toBeNull();
  });

  it("matches the documented selection encoding", () => {
    expect("chain:box-hunt").toMatch(SHOP_SELECTION_PATTERN);
    expect("retailer:52").toMatch(SHOP_SELECTION_PATTERN);
    expect("chain:Box Hunt").not.toMatch(SHOP_SELECTION_PATTERN);
    expect("nope").not.toMatch(SHOP_SELECTION_PATTERN);
  });
});
