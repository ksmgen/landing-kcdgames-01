import { describe, it, expect } from "vitest";
import {
  SURVEY_DRAFT_STORAGE_KEY,
  parseSurveyDraft,
  draftToFormityState,
} from "./useSurveyDraft";

describe("parseSurveyDraft", () => {
  it("returns null when there is nothing stored", () => {
    expect(parseSurveyDraft(null)).toBeNull();
    expect(parseSurveyDraft("")).toBeNull();
  });

  it("parses a valid partial draft into a canonical shape", () => {
    expect(
      parseSurveyDraft(
        JSON.stringify({ version: 1, step: 0, values: { gameInterest: "Rift" } }),
      ),
    ).toEqual({ version: 1, step: 0, values: { gameInterest: "Rift" } });
  });

  it("parses a completed draft", () => {
    expect(
      parseSurveyDraft(
        JSON.stringify({
          version: 1,
          step: 2,
          values: {
            gameInterest: "Riftbound",
            experienceRating: 5,
            feedback: "",
          },
          completed: true,
        }),
      ),
    ).toEqual({
      version: 1,
      step: 2,
      values: { gameInterest: "Riftbound", experienceRating: 5, feedback: "" },
      completed: true,
    });
  });

  it("drops unknown keys from the stored payload", () => {
    expect(
      parseSurveyDraft(
        JSON.stringify({
          version: 1,
          step: 1,
          values: { experienceRating: 3 },
          injected: "ignored",
        }),
      ),
    ).toEqual({ version: 1, step: 1, values: { experienceRating: 3 } });
  });

  it("rejects corrupt JSON", () => {
    expect(parseSurveyDraft("{oops")).toBeNull();
    expect(parseSurveyDraft("42")).toBeNull();
    expect(parseSurveyDraft('"a string"')).toBeNull();
    expect(parseSurveyDraft("null")).toBeNull();
  });

  it("rejects unknown or missing versions", () => {
    expect(
      parseSurveyDraft(JSON.stringify({ version: 2, step: 0, values: {} })),
    ).toBeNull();
    expect(parseSurveyDraft(JSON.stringify({ step: 0, values: {} }))).toBeNull();
  });

  it("rejects invalid steps", () => {
    expect(
      parseSurveyDraft(JSON.stringify({ version: 1, step: 3, values: {} })),
    ).toBeNull();
    expect(
      parseSurveyDraft(JSON.stringify({ version: 1, step: -1, values: {} })),
    ).toBeNull();
    expect(
      parseSurveyDraft(JSON.stringify({ version: 1, step: 1.5, values: {} })),
    ).toBeNull();
    expect(
      parseSurveyDraft(JSON.stringify({ version: 1, step: "1", values: {} })),
    ).toBeNull();
    expect(
      parseSurveyDraft(JSON.stringify({ version: 1, values: {} })),
    ).toBeNull();
  });

  it("rejects invalid field values", () => {
    expect(
      parseSurveyDraft(
        JSON.stringify({ version: 1, step: 0, values: { gameInterest: 42 } }),
      ),
    ).toBeNull();
    expect(
      parseSurveyDraft(
        JSON.stringify({ version: 1, step: 1, values: { experienceRating: 0 } }),
      ),
    ).toBeNull();
    expect(
      parseSurveyDraft(
        JSON.stringify({ version: 1, step: 1, values: { experienceRating: 6 } }),
      ),
    ).toBeNull();
    expect(
      parseSurveyDraft(
        JSON.stringify({
          version: 1,
          step: 1,
          values: { experienceRating: 2.5 },
        }),
      ),
    ).toBeNull();
    expect(
      parseSurveyDraft(
        JSON.stringify({
          version: 1,
          step: 1,
          values: { experienceRating: "4" },
        }),
      ),
    ).toBeNull();
    expect(
      parseSurveyDraft(
        JSON.stringify({ version: 1, step: 2, values: { feedback: 7 } }),
      ),
    ).toBeNull();
  });

  it("rejects oversized drafts", () => {
    expect(
      parseSurveyDraft(
        JSON.stringify({
          version: 1,
          step: 0,
          values: { gameInterest: "x".repeat(201) },
        }),
      ),
    ).toBeNull();
    expect(
      parseSurveyDraft(
        JSON.stringify({
          version: 1,
          step: 2,
          values: { feedback: "x".repeat(2001) },
        }),
      ),
    ).toBeNull();
    expect(parseSurveyDraft(" ".repeat(16 * 1024 + 1))).toBeNull();
  });

  it("rejects completed drafts without the required answers", () => {
    expect(
      parseSurveyDraft(
        JSON.stringify({
          version: 1,
          step: 2,
          values: { gameInterest: "Riftbound" },
          completed: true,
        }),
      ),
    ).toBeNull();
    expect(
      parseSurveyDraft(
        JSON.stringify({
          version: 1,
          step: 2,
          values: { experienceRating: 4 },
          completed: true,
        }),
      ),
    ).toBeNull();
    expect(
      parseSurveyDraft(
        JSON.stringify({ version: 1, step: 2, values: {}, completed: "yes" }),
      ),
    ).toBeNull();
    expect(
      parseSurveyDraft(
        JSON.stringify({ version: 1, step: 2, values: {}, completed: false }),
      ),
    ).toBeNull();
  });
});

describe("draftToFormityState", () => {
  it("resumes at the first step with a single form point", () => {
    const state = draftToFormityState({
      version: 1,
      step: 0,
      values: { gameInterest: "Rif" },
    });

    expect(state.points).toEqual([{ path: [{ type: "list", slot: 0 }], values: {} }]);
    expect(state.memory).toEqual({
      type: "list",
      list: {
        0: { gameInterest: { data: { here: true, data: "Rif" }, keys: {} } },
      },
    });
  });

  it("resumes at the experience step with the first answer accumulated", () => {
    const state = draftToFormityState({
      version: 1,
      step: 1,
      values: { gameInterest: "Riftbound", experienceRating: 4 },
    });

    expect(state.points.map((point) => point.path)).toEqual([
      [{ type: "list", slot: 0 }],
      [{ type: "list", slot: 1 }],
      [{ type: "list", slot: 2 }],
    ]);
    expect(state.points.map((point) => point.values)).toEqual([
      {},
      { gameInterest: "Riftbound" },
      { gameInterest: "Riftbound" },
    ]);
    expect(state.memory).toEqual({
      type: "list",
      list: {
        0: { gameInterest: { data: { here: true, data: "Riftbound" }, keys: {} } },
        2: { experienceRating: { data: { here: true, data: 4 }, keys: {} } },
      },
    });
  });

  it("resumes at the feedback step with the full history", () => {
    const state = draftToFormityState({
      version: 1,
      step: 2,
      values: {
        gameInterest: "Riftbound",
        experienceRating: 4,
        feedback: "note",
      },
    });

    expect(state.points.map((point) => point.path)).toEqual([
      [{ type: "list", slot: 0 }],
      [{ type: "list", slot: 1 }],
      [{ type: "list", slot: 2 }],
      [{ type: "list", slot: 3 }],
      [{ type: "list", slot: 4 }],
    ]);
    expect(state.points[3].values).toEqual({
      gameInterest: "Riftbound",
      experienceRating: 4,
    });
    expect(state.points[4].values).toEqual({
      gameInterest: "Riftbound",
      experienceRating: 4,
    });
    expect(state.memory).toEqual({
      type: "list",
      list: {
        0: { gameInterest: { data: { here: true, data: "Riftbound" }, keys: {} } },
        2: { experienceRating: { data: { here: true, data: 4 }, keys: {} } },
        4: { feedback: { data: { here: true, data: "note" }, keys: {} } },
      },
    });
  });

  it("uses the shared draft storage key", () => {
    expect(SURVEY_DRAFT_STORAGE_KEY).toBe("kcgames-survey-draft-v1");
  });
});
