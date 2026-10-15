"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { State } from "@formity/react";

export const SURVEY_DRAFT_STORAGE_KEY = "kcgames-survey-draft-v1";

const DRAFT_VERSION = 1;

const MAX_RAW_LENGTH = 16 * 1024;
const MAX_GAME_INTEREST_LENGTH = 200;
const MAX_FEEDBACK_LENGTH = 2000;

const STEP_FIELDS = ["gameInterest", "experienceRating", "feedback"] as const;

export type SurveyStep = 0 | 1 | 2;

export type DraftField = (typeof STEP_FIELDS)[number];

export type SurveyDraftValues = {
  gameInterest?: string;
  experienceRating?: number;
  feedback?: string;
};

export type SurveyDraft = {
  version: 1;
  step: SurveyStep;
  values: SurveyDraftValues;
  completed?: true;
};

const FIELD_STEP: Record<DraftField, SurveyStep> = {
  gameInterest: 0,
  experienceRating: 1,
  feedback: 2,
};

/**
 * Parse and validate a raw draft payload. Returns null when the payload is
 * absent, corrupt, from an unknown version, or fails any field check.
 */
export function parseSurveyDraft(raw: string | null): SurveyDraft | null {
  if (!raw) return null;
  if (raw.length > MAX_RAW_LENGTH) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;

  const record = parsed as Record<string, unknown>;
  const { version, step, values, completed } = record;

  if (version !== DRAFT_VERSION) return null;
  if (step !== 0 && step !== 1 && step !== 2) return null;
  if (typeof values !== "object" || values === null) return null;

  const { gameInterest, experienceRating, feedback } = values as Record<
    string,
    unknown
  >;

  const draft: SurveyDraft = { version: DRAFT_VERSION, step, values: {} };

  if (gameInterest !== undefined) {
    if (
      typeof gameInterest !== "string" ||
      gameInterest.length > MAX_GAME_INTEREST_LENGTH
    ) {
      return null;
    }
    draft.values.gameInterest = gameInterest;
  }

  if (experienceRating !== undefined) {
    if (
      typeof experienceRating !== "number" ||
      !Number.isInteger(experienceRating) ||
      experienceRating < 1 ||
      experienceRating > 5
    ) {
      return null;
    }
    draft.values.experienceRating = experienceRating;
  }

  if (feedback !== undefined) {
    if (typeof feedback !== "string" || feedback.length > MAX_FEEDBACK_LENGTH) {
      return null;
    }
    draft.values.feedback = feedback;
  }

  if (completed !== undefined) {
    if (completed !== true) return null;
    if (
      draft.values.gameInterest === undefined ||
      draft.values.experienceRating === undefined
    ) {
      return null;
    }
    draft.completed = true;
  }

  return draft;
}

/**
 * Build a Formity `State` that resumes the flow at the draft's current step.
 * The flow is a flat list where forms sit at slots 0/2/4 and the yields that
 * follow them at slots 1/3/5, so resuming at step k replays the points a live
 * run would have produced and seeds memory with every saved field value —
 * both the submitted answers and the unsent input of the current step.
 */
export function draftToFormityState(draft: SurveyDraft): State {
  const valuesThrough = (step: number): Record<string, unknown> => {
    const values: Record<string, unknown> = {};
    for (let index = 0; index < step; index += 1) {
      const field = STEP_FIELDS[index];
      const value = draft.values[field];
      if (value !== undefined) values[field] = value;
    }
    return values;
  };

  const points: State["points"] = [];
  for (let step = 0; step <= draft.step; step += 1) {
    const values = valuesThrough(step);
    if (step > 0) {
      points.push({
        path: [{ type: "list", slot: 2 * step - 1 }],
        values: { ...values },
      });
    }
    points.push({
      path: [{ type: "list", slot: 2 * step }],
      values: { ...values },
    });
  }

  const list: State["memory"]["list"] = {};
  for (const field of STEP_FIELDS) {
    const value = draft.values[field];
    if (value === undefined) continue;
    list[2 * STEP_FIELDS.indexOf(field)] = {
      [field]: { data: { here: true, data: value }, keys: {} },
    };
  }

  return { points, memory: { type: "list", list } };
}

/** sessionStorage access that tolerates SSR and storage being blocked. */
function getSessionStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function readStoredDraft(): SurveyDraft | null {
  const storage = getSessionStorage();
  if (!storage) return null;
  try {
    return parseSurveyDraft(storage.getItem(SURVEY_DRAFT_STORAGE_KEY));
  } catch {
    return null;
  }
}

function writeStoredDraft(draft: SurveyDraft): void {
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    storage.setItem(SURVEY_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Quota exceeded or storage blocked — the survey keeps working without a draft.
  }
}

function removeStoredDraft(): void {
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    storage.removeItem(SURVEY_DRAFT_STORAGE_KEY);
  } catch {
    // Storage blocked — nothing to clean up.
  }
}

function boundedDraft(draft: SurveyDraft): SurveyDraft {
  const { gameInterest, feedback } = draft.values;
  return {
    ...draft,
    values: {
      ...draft.values,
      ...(gameInterest !== undefined
        ? { gameInterest: gameInterest.slice(0, MAX_GAME_INTEREST_LENGTH) }
        : {}),
      ...(feedback !== undefined
        ? { feedback: feedback.slice(0, MAX_FEEDBACK_LENGTH) }
        : {}),
    },
  };
}

export function useSurveyDraft() {
  const [draft, setDraft] = useState<SurveyDraft | null>(null);
  const [ready, setReady] = useState(false);
  const draftRef = useRef<SurveyDraft | null>(null);

  const commitDraft = useCallback((next: SurveyDraft | null) => {
    const bounded = next === null ? null : boundedDraft(next);
    draftRef.current = bounded;
    setDraft(bounded);
    if (bounded) writeStoredDraft(bounded);
    else removeStoredDraft();
  }, []);

  // Load after mount so the server-rendered output matches the first client
  // render; `ready` gates mounting the flow until the draft is known.
  useEffect(() => {
    commitDraft(readStoredDraft());
    setReady(true);
  }, [commitDraft]);

  const saveDraft = useCallback(
    (next: SurveyDraft) => commitDraft({
      ...next,
      values: { ...draftRef.current?.values, ...next.values },
    }),
    [commitDraft],
  );

  /** Save the unsent value of one field of the current step. */
  const saveField = useCallback(
    (field: DraftField, value: string | number) => {
      const values: SurveyDraftValues = { ...draftRef.current?.values };
      if (field === "experienceRating") {
        if (typeof value === "number") values.experienceRating = value;
      } else if (typeof value === "string") {
        values[field] = value;
      }
      commitDraft({ version: DRAFT_VERSION, step: FIELD_STEP[field], values });
    },
    [commitDraft],
  );

  const clearDraft = useCallback(() => commitDraft(null), [commitDraft]);

  return { draft, ready, saveDraft, saveField, clearDraft };
}
