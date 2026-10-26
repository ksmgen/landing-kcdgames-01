import { describe, expect, it } from "vitest";
import retailersData from "../../data/retailers.json";
import shopOptions from "../../../public/data/survey-shop-options.json";
import {
  CHAIN_GROUPS,
  SHOP_SELECTION_PATTERN,
  STANDALONE_RETAILERS,
  branchOptionLabel,
  emptyShopValue,
  resolveShop,
  type BranchRow,
} from "./surveyData";

describe("authoritative shop options", () => {
  it("loads chain groups and standalone retailers from the public JSON", () => {
    expect(shopOptions).not.toHaveProperty("note");
    expect(CHAIN_GROUPS).toEqual(shopOptions.chainGroups);
    expect(STANDALONE_RETAILERS).toEqual(shopOptions.standaloneRetailers);
    // Chain groups have explicit groupings with string MongoDB ids and serial RIDs
    expect(CHAIN_GROUPS).toHaveLength(4);
    expect(CHAIN_GROUPS.map((g) => g.slug)).toEqual([
      "bulba",
      "ericfun",
      "games-haven",
      "invictus-collectibles",
    ]);

    const bulba = CHAIN_GROUPS.find((g) => g.slug === "bulba")!;
    expect(bulba.label).toBe("Bulba");
    expect(bulba.prefix).toBe("Bulba");
    expect(bulba.branches).toHaveLength(2);
    // Verify string id and serial are preserved
    const firstBranch = bulba.branches[0] as BranchRow;
    expect(firstBranch.id).toMatch(/^[a-f0-9]{24}$/);
    expect(firstBranch.serial).toMatch(/^RID\d+$/);
    expect(firstBranch.name).toBe("Bulba Gamez & Hobby Store Enterprise");
    expect(firstBranch.address).toContain("Setapak");
  });

  it("preserves all standalone retailer rows with string ids", () => {
    expect(STANDALONE_RETAILERS).toBeInstanceOf(Array);
    // Check a few known rows by their actual string ids from the JSON
    const arcaida = STANDALONE_RETAILERS.find(
      (r) => r.serial === "RID000755",
    );
    expect(arcaida?.name).toBe("Arcaida Games");
    expect(typeof arcaida!.id).toBe("string");
    expect(arcaida!.address).toContain("Johor Bahru");

    // All rows have required fields
    for (const row of STANDALONE_RETAILERS) {
      expect(row.id).toMatch(/^[a-f0-9]{24}$/);
      expect(row.serial).toMatch(/^RID\d+$/);
      expect(row.name).toBeTruthy();
      expect(row.region).toBeTruthy();
      expect(row.country).toBeTruthy();
      expect(typeof row.playing).toBe("boolean");
      expect(row.storeType).toBeTruthy();
    }
  });

  it("every branch has an address and region", () => {
    for (const group of CHAIN_GROUPS) {
      for (const branch of group.branches) {
        expect(branch.address.length).toBeGreaterThan(0);
        expect(branch.region.length).toBeGreaterThan(0);
      }
    }
  });

  it("preserves play status flags from the source", () => {
    // MIA COLLECTIBLE is marked playing:true in the JSON
    const mia = STANDALONE_RETAILERS.find(
      (r) => r.serial === "RID000838",
    );
    expect(mia?.playing).toBe(true);

    // Card Dojo is also playing:true
    const dojo = STANDALONE_RETAILERS.find(
      (r) => r.serial === "RID000840",
    );
    expect(dojo?.playing).toBe(true);

    // Bulba branches are both false
    const bulba = CHAIN_GROUPS.find((g) => g.slug === "bulba")!;
    for (const b of bulba.branches) expect(b.playing).toBe(false);
  });
});

describe("chain prefixes are authoritative, not simulated", () => {
  it("group prefix matches name prefix for all branches", () => {
    for (const group of CHAIN_GROUPS) {
      for (const branch of group.branches) {
        expect(branch.name.startsWith(group.prefix)).toBe(true);
      }
    }
  });

  it("slug is derived from label", () => {
    const groupsByName = new Map(CHAIN_GROUPS.map((g) => [g.label, g]));
    const slugToGroup = new Map(CHAIN_GROUPS.map((g) => [g.slug, g]));

    for (const group of CHAIN_GROUPS) {
      const byName = groupsByName.get(group.label);
      expect(byName).toBe(group);
      const bySlug = slugToGroup.get(group.slug);
      expect(bySlug).toBe(group);
    }
  });
});

describe("branchOptionLabel uses serial", () => {
  it("formats serial — name — address", () => {
    const sample: BranchRow = {
      id: "6841b1c188db84875a1d978d",
      serial: "RID000588",
      name: "Bulba Gamez & Hobby Store Enterprise",
      address: "PV128, Level 2, Unit 2-39, Jalan Genting Kelang, Setapak, 53300, Kuala Lumpur, Malaysia",
      region: "KUALA LUMPUR",
      country: "Malaysia",
      playing: false,
      storeType: "hobby",
    };
    expect(branchOptionLabel(sample)).toBe(
      "RID000588 — Bulba Gamez & Hobby Store Enterprise — PV128, Level 2, Unit 2-39, Jalan Genting Kelang, Setapak, 53300, Kuala Lumpur, Malaysia",
    );
  });
});

describe("resolveShop with string IDs", () => {
  it("resolves a standalone retailer selection to the authoritative row", () => {
    const resolved = resolveShop({
      selection: "retailer:6a204dcccada14e24b758e79",
      branchId: "",
    });
    expect(resolved?.retailer.name).toBe("Arcaida Games");
    expect(resolved?.chain).toBeNull();
    expect(resolved?.retailer.serial).toBe("RID000755");
  });

  it("resolves a chain selection plus branch string id to the branch row", () => {
    const resolved = resolveShop({
      selection: "chain:games-haven",
      branchId: "6a0eaff24e59c09193f726af",
    });
    expect(resolved?.retailer.name).toBe("Games Haven Southkey");
    expect(resolved?.chain?.label).toBe("Games Haven");
    expect(resolved?.retailer.serial).toBe("RID000735");
  });

  it("rejects empty selections", () => {
    expect(resolveShop(emptyShopValue())).toBeNull();
    expect(resolveShop({ selection: "", branchId: "" })).toBeNull();
  });

  it("rejects old numeric-id drafts that no longer match", () => {
    // Old numeric ids from the retailers.json format should not resolve
    expect(resolveShop({ selection: "retailer:52", branchId: "" })).toBeNull();
    expect(resolveShop({ selection: "retailer:13", branchId: 13 as unknown as string })).toBeNull();
    // Old chain slugs that were auto-generated from name prefixes don't exist
    expect(resolveShop({ selection: "chain:box-hunt", branchId: "" })).toBeNull();
  });

  it("rejects malformed selections", () => {
    expect(resolveShop({ selection: "chain:unknown-slug", branchId: "some-id" })).toBeNull();
    expect(resolveShop({ selection: "chain:games-haven", branchId: "" })).toBeNull();
    expect(resolveShop({ selection: "chain:games-haven", branchId: "nonexistent" })).toBeNull();
    // Standalone with non-empty branchId is invalid
    expect(
      resolveShop({ selection: "retailer:6a204dcccada14e24b758e79", branchId: "x" }),
    ).toBeNull();
    // Empty retailer id part
    expect(resolveShop({ selection: "retailer:", branchId: "" })).toBeNull();
  });
});

describe("selection pattern", () => {
  it("matches chain:slug format", () => {
    expect("chain:bulba").toMatch(SHOP_SELECTION_PATTERN);
    expect("chain:games-haven").toMatch(SHOP_SELECTION_PATTERN);
    expect("chain:invictus-collectibles").toMatch(SHOP_SELECTION_PATTERN);
  });

  it("matches retailer:string-id format", () => {
    expect("retailer:6a204dcccada14e24b758e79").toMatch(SHOP_SELECTION_PATTERN);
    expect("retailer:6841b1c188db84875a1d978d").toMatch(SHOP_SELECTION_PATTERN);
  });

  it("rejects old formats", () => {
    expect("retailer:52").not.toMatch(SHOP_SELECTION_PATTERN);
    expect("chain:Box Hunt").not.toMatch(SHOP_SELECTION_PATTERN);
    expect("nope").not.toMatch(SHOP_SELECTION_PATTERN);
    // box-hunt slug no longer exists in authoritative source
    expect(resolveShop({ selection: "chain:box-hunt", branchId: "abc123def456789012345678" })).toBeNull();
  });
});

describe("RETAILERS from retailers.json unchanged", () => {
  it("preserves the separate public directory JSON", () => {
    // The public website directory remains separate from B2B survey options.
    expect(retailersData).toHaveLength(237);
    expect(retailersData[0].id).toBe(1);
    expect(retailersData[0].name).toBe("Box Hunt - Aeon Bukit Indah");
  });
});
