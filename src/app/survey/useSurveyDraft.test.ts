import { describe, it, expect } from "vitest";
import {
  SURVEY_DRAFT_STORAGE_KEY,
  defaultHoursValue,
  draftToFormityState,
  draftToSurveyValues,
  parseSurveyDraft,
  sanitizeDraftValues,
  type SurveyDraft,
} from "./useSurveyDraft";

function seed(values: Record<string, unknown>, step = 0, completed?: true) {
  return JSON.stringify({
    version: 2,
    step,
    values,
    ...(completed ? { completed } : {}),
  });
}

describe("parseSurveyDraft", () => {
  it("returns null when there is nothing stored", () => {
    expect(parseSurveyDraft(null)).toBeNull();
    expect(parseSurveyDraft("")).toBeNull();
  });

  it("parses a valid partial draft into a canonical shape", () => {
    expect(
      parseSurveyDraft(
        seed({
          shop: { selection: "retailer:52", branchId: 0 },
          seating: { tables: 4, chairs: 16 },
        }),
      ),
    ).toEqual({
      version: 2,
      step: 0,
      values: {
        shop: { selection: "retailer:52", branchId: 0 },
        seating: { tables: 4, chairs: 16 },
      },
    });
  });

  it("drops unknown keys from the stored payload", () => {
    expect(
      parseSurveyDraft(seed({ seating: { tables: 1, chairs: 2 }, injected: "x" })),
    ).toEqual({
      version: 2,
      step: 0,
      values: { seating: { tables: 1, chairs: 2 } },
    });
  });

  it("rejects corrupt JSON and non-object payloads", () => {
    expect(parseSurveyDraft("{oops")).toBeNull();
    expect(parseSurveyDraft("42")).toBeNull();
    expect(parseSurveyDraft('"a string"')).toBeNull();
    expect(parseSurveyDraft("null")).toBeNull();
  });

  it("rejects unknown or missing versions, including the old player draft", () => {
    expect(parseSurveyDraft(JSON.stringify({ version: 1, step: 0, values: {} }))).toBeNull();
    expect(parseSurveyDraft(JSON.stringify({ version: 3, step: 0, values: {} }))).toBeNull();
    expect(parseSurveyDraft(JSON.stringify({ step: 0, values: {} }))).toBeNull();
  });

  it("rejects invalid steps", () => {
    expect(parseSurveyDraft(seed({}, 12))).toBeNull();
    expect(parseSurveyDraft(seed({}, -1))).toBeNull();
    expect(parseSurveyDraft(seed({}, 1.5))).toBeNull();
    expect(parseSurveyDraft(JSON.stringify({version:2, step:"1", values:{}}))).toBeNull();
    expect(parseSurveyDraft(JSON.stringify({ version: 2, values: {} }))).toBeNull();
    expect(
      parseSurveyDraft(JSON.stringify({ version: 2, step: 11, values: [] })),
    ).toBeNull();
  });

  it("rejects oversized drafts", () => {
    expect(parseSurveyDraft(" ".repeat(32 * 1024 + 1))).toBeNull();
    expect(
      parseSurveyDraft(seed({ otherProducts: "x".repeat(2001) })),
    ).toEqual({ version: 2, step: 0, values: {} });
  });
});

describe("sanitizeDraftValues", () => {
  it("keeps a valid shop selection with its branch", () => {
    expect(
      sanitizeDraftValues({
        shop: { selection: "chain:games-haven", branchId: 13 },
      }),
    ).toEqual({ shop: { selection: "chain:games-haven", branchId: 13 } });
  });

  it("drops stale shop selections without losing the rest of the draft", () => {
    expect(
      sanitizeDraftValues({
        shop: { selection: "retailer:999999", branchId: 0 },
        seating: { tables: 1, chairs: 1 },
      }),
    ).toEqual({ seating: { tables: 1, chairs: 1 } });
    expect(
      sanitizeDraftValues({ shop: { selection: "chain:not-a-chain", branchId: 1 } }),
    ).toEqual({});
    // Chain member rows are not valid direct selections.
    expect(
      sanitizeDraftValues({ shop: { selection: "retailer:13", branchId: 0 } }),
    ).toEqual({});
    expect(sanitizeDraftValues({ shop: { selection: "nope", branchId: 0 } })).toEqual({});
    expect(sanitizeDraftValues({ shop: { selection: "retailer:52", branchId: 7 } })).toEqual({
      shop: { selection: "retailer:52", branchId: 0 },
    });
  });

  it("keeps a chain selection but resets a stale branch id", () => {
    expect(
      sanitizeDraftValues({
        shop: { selection: "chain:box-hunt", branchId: 999999 },
      }),
    ).toEqual({ shop: { selection: "chain:box-hunt", branchId: 0 } });
    expect(
      sanitizeDraftValues({ shop: { selection: "chain:box-hunt", branchId: -1 } }),
    ).toEqual({});
  });

  it("keeps partially typed events and clears disabled events", () => {
    expect(
      sanitizeDraftValues({
        event: { enabled: true, date: "2026-11-01", time: "", info: "" },
      }),
    ).toEqual({ event: { enabled: true, date: "2026-11-01", time: "", info: "" } });
    expect(
      sanitizeDraftValues({ event: { enabled: false, date: "2026-11-01", time: "18:00", info: "x" } }),
    ).toEqual({ event: { enabled: false, date: "", time: "", info: "" } });
    expect(sanitizeDraftValues({ event: { enabled: true, date: "garbage", time: "", info: "" } })).toEqual({});
    expect(sanitizeDraftValues({ event: { enabled: true, date: "", time: "25:99", info: "" } })).toEqual({});
    expect(sanitizeDraftValues({ event: { enabled: "yes", date: "", time: "", info: "" } })).toEqual({});
  });

  it("normalizes hours: closed days lose times, invalid days reset", () => {
    expect(
      sanitizeDraftValues({
        hours: {
          monday: { closed: false, open: "10:00", close: "22:00" },
          tuesday: { closed: true, open: "09:00", close: "17:00" },
          wednesday: { closed: false, open: "99:00", close: "22:00" },
          thursday: "nonsense",
        },
      }),
    ).toEqual({
      hours: {
        monday: { closed: false, open: "10:00", close: "22:00" },
        tuesday: { closed: true, open: "", close: "" },
        wednesday: { closed: false, open: "", close: "" },
        thursday: { closed: false, open: "", close: "" },
        friday: { closed: false, open: "", close: "" },
        saturday: { closed: false, open: "", close: "" },
        sunday: { closed: false, open: "", close: "" },
      },
    });
  });

  it("keeps null seating counts and rejects invalid ones", () => {
    expect(sanitizeDraftValues({ seating: { tables: null, chairs: null } })).toEqual({
      seating: { tables: null, chairs: null },
    });
    expect(sanitizeDraftValues({ seating: { tables: 0, chairs: 0 } })).toEqual({
      seating: { tables: 0, chairs: 0 },
    });
    expect(sanitizeDraftValues({ seating: { tables: -1, chairs: 2 } })).toEqual({
      seating: { tables: null, chairs: 2 },
    });
    expect(sanitizeDraftValues({ seating: { tables: 1.5, chairs: 2 } })).toEqual({
      seating: { tables: null, chairs: 2 },
    });
    expect(sanitizeDraftValues({ seating: { tables: 100000, chairs: 2 } })).toEqual({
      seating: { tables: null, chairs: 2 },
    });
    expect(sanitizeDraftValues({ seating: { tables: "4", chairs: 2 } })).toEqual({
      seating: { tables: null, chairs: 2 },
    });
  });

  it("drops unknown picture sample ids and keeps known ones", () => {
    expect(
      sanitizeDraftValues({ pictures: { retailArea: "retail-card-wall", playArea: "" } }),
    ).toEqual({ pictures: { retailArea: "retail-card-wall", playArea: "" } });
    expect(
      sanitizeDraftValues({ pictures: { retailArea: "nope", playArea: "play-table-rows" } }),
    ).toEqual({ pictures: { retailArea: "", playArea: "play-table-rows" } });
  });

  it("coerces invalid social and feedback strings to empty", () => {
    expect(
      sanitizeDraftValues({
        social: { instagram: "@kcgames", facebook: 42, tiktok: "x".repeat(301) },
      }),
    ).toEqual({ social: { instagram: "@kcgames", facebook: "", tiktok: "" } });
    expect(
      sanitizeDraftValues({ feedback: { shop: "note", retailer: 7 } }),
    ).toEqual({ feedback: { shop: "note", retailer: "" } });
    expect(sanitizeDraftValues({ feedback: "not an object" })).toEqual({});
  });

  it("keeps bounded other products and drops invalid ones", () => {
    expect(sanitizeDraftValues({ otherProducts: "Board games and accessories" })).toEqual({
      otherProducts: "Board games and accessories",
    });
    expect(sanitizeDraftValues({ otherProducts: 42 })).toEqual({});
    expect(sanitizeDraftValues({ otherProducts: "x".repeat(2001) })).toEqual({});
  });
});

describe("completed drafts", () => {
  const completedBase = {
    shop: { selection: "retailer:52", branchId: 0 },
    seating: { tables: 2, chairs: 8 },
  };

  it("parses a completed draft with the required answers", () => {
    expect(
      parseSurveyDraft(seed(completedBase, 11, true)),
    ).toEqual({
      version: 2,
      step: 11,
      values: completedBase,
      completed: true,
    });
  });

  it("strips the completed flag when required answers are missing or stale", () => {
    expect(parseSurveyDraft(seed({}, 11, true))).toEqual({
      version: 2,
      step: 11,
      values: {},
    });
    expect(
      parseSurveyDraft(seed({ seating: { tables: 1, chairs: 1 } }, 11, true)),
    ).toEqual({ version: 2, step: 11, values: { seating: { tables: 1, chairs: 1 } } });
    expect(
      parseSurveyDraft(
        seed({ shop: { selection: "retailer:999999", branchId: 0 }, seating: { tables: 1, chairs: 1 } }, 11, true),
      ),
    ).toEqual({ version: 2, step: 11, values: { seating: { tables: 1, chairs: 1 } } });
    expect(
      parseSurveyDraft(
        seed({ shop: { selection: "chain:games-haven", branchId: 0 }, seating: { tables: 1, chairs: 1 } }, 11, true),
      ),
    ).toEqual({
      version: 2,
      step: 11,
      values: { shop: { selection: "chain:games-haven", branchId: 0 }, seating: { tables: 1, chairs: 1 } },
    });
    expect(parseSurveyDraft(seed(completedBase, 11, false as never))).toEqual({
      version: 2,
      step: 11,
      values: completedBase,
    });
  });
});

describe("draftToSurveyValues", () => {
  it("fills defaults for missing steps", () => {
    const values = draftToSurveyValues({ shop: { selection: "retailer:52", branchId: 0 } });
    expect(values.shop.selection).toBe("retailer:52");
    expect(values.seating).toEqual({ tables: null, chairs: null });
    expect(values.hours).toEqual(defaultHoursValue());
    expect(values.event).toEqual({ enabled: false, date: "", time: "", info: "" });
    expect(values.otherProducts).toBe("");
  });
});

describe("draftToFormityState", () => {
  it("resumes at the first step with a single form point", () => {
    const state = draftToFormityState({
      version: 2,
      step: 0,
      values: { shop: { selection: "retailer:52", branchId: 0 } },
    });

    expect(state.points).toEqual([
      { path: [{ type: "list", slot: 0 }], values: {} },
    ]);
    expect(state.memory).toEqual({
      type: "list",
      list: {
        0: {
          shop: { data: { here: true, data: { selection: "retailer:52", branchId: 0 } }, keys: {} },
        },
      },
    });
  });

  it("resumes mid-flow with the accumulated answers in the points", () => {
    const draft: SurveyDraft = {
      version: 2,
      step: 4,
      values: {
        shop: { selection: "retailer:52", branchId: 0 },
        pictures: { retailArea: "retail-card-wall", playArea: "" },
        seating: { tables: 4, chairs: 16 },
        social: { instagram: "@kcgames", facebook: "", tiktok: "" },
        hours: defaultHoursValue(),
      },
    };

    const state = draftToFormityState(draft);

    expect(state.points.map((point) => point.path)).toEqual([
      [{ type: "list", slot: 0 }],
      [{ type: "list", slot: 1 }],
      [{ type: "list", slot: 2 }],
      [{ type: "list", slot: 3 }],
      [{ type: "list", slot: 4 }],
    ]);
    expect(state.points[3].values).toEqual({
      shop: { selection: "retailer:52", branchId: 0 },
      pictures: { retailArea: "retail-card-wall", playArea: "" },
      seating: { tables: 4, chairs: 16 },
    });
    expect(state.points[4].values).toEqual({
      shop: { selection: "retailer:52", branchId: 0 },
      pictures: { retailArea: "retail-card-wall", playArea: "" },
      seating: { tables: 4, chairs: 16 },
      social: { instagram: "@kcgames", facebook: "", tiktok: "" },
    });
    expect(state.memory.list[1]).toEqual({
      pictures: {
        data: { here: true, data: { retailArea: "retail-card-wall", playArea: "" } },
        keys: {},
      },
    });
    expect(state.memory.list[3]).toEqual({
      social: {
        data: { here: true, data: { instagram: "@kcgames", facebook: "", tiktok: "" } },
        keys: {},
      },
    });
  });

  it("seeds later answers in memory while resuming at an earlier step", () => {
    const state = draftToFormityState({
      version: 2,
      step: 1,
      values: {
        shop: { selection: "retailer:52", branchId: 0 },
        pictures: { retailArea: "retail-card-wall", playArea: "" },
        feedback: { shop: "later answer", retailer: "" },
      },
    });

    expect(state.points.map((point) => point.path)).toEqual([
      [{ type: "list", slot: 0 }],
      [{ type: "list", slot: 1 }],
    ]);
    expect(state.memory.list[10]).toEqual({
      feedback: {
        data: { here: true, data: { shop: "later answer", retailer: "" } },
        keys: {},
      },
    });
  });

  it("uses the shared draft storage key", () => {
    expect(SURVEY_DRAFT_STORAGE_KEY).toBe("kcgames-retailer-survey-draft-v2");
  });
});
