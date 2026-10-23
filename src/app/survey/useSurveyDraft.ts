"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { State } from "@formity/react";
import {
  CHAIN_GROUPS,
  PICTURE_SAMPLE_IDS,
  SHOP_SELECTION_PATTERN,
  STANDALONE_RETAILERS,
  emptyShopValue,
  resolveShop,
} from "./surveyData";

/**
 * Draft schema v2 for the retailer simulation survey. The old v1 player draft
 * used a different storage key and shape and is intentionally incompatible —
 * stale v1 payloads are ignored.
 */
export const SURVEY_DRAFT_STORAGE_KEY = "kcgames-retailer-survey-draft-v2";

export const DRAFT_VERSION = 2;

export const TOTAL_STEPS = 12;

const MAX_RAW_LENGTH = 32 * 1024;
const MAX_TEXT_LENGTH = 2000;
const MAX_HANDLE_LENGTH = 300;
const SEATING_MAX = 99999;

const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export const DAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type DayKey = (typeof DAY_KEYS)[number];

/**
 * The twelve ordered steps of the retailer simulation survey. Index in this
 * array === step index; each key is the single Formity form field the step
 * submits and the draft key its answers live under.
 */
export const STEP_KEYS = [
  "shop",
  "pictures",
  "seating",
  "social",
  "hours",
  "event",
  "notableEvent",
  "learnToPlay",
  "externalEvent",
  "personalEvent",
  "feedback",
  "otherProducts",
] as const;

export type DraftField = (typeof STEP_KEYS)[number];

export type SurveyStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type PicturesValue = { retailArea: string; playArea: string };
export type SeatingValue = { tables: number | null; chairs: number | null };
export type SocialValue = { instagram: string; facebook: string; tiktok: string };
export type DayHours = { closed: boolean; open: string; close: string };
export type HoursValue = Record<DayKey, DayHours>;
export type EventValue = {
  enabled: boolean;
  date: string;
  time: string;
  info: string;
};
export type FeedbackValue = { shop: string; retailer: string };

export type SurveyDraftValues = {
  shop?: ReturnType<typeof emptyShopValue>;
  pictures?: PicturesValue;
  seating?: SeatingValue;
  social?: SocialValue;
  hours?: HoursValue;
  event?: EventValue;
  notableEvent?: EventValue;
  learnToPlay?: EventValue;
  externalEvent?: EventValue;
  feedback?: FeedbackValue;
  personalEvent?: EventValue;
  otherProducts?: string;
};

/** Fully-answered survey shape produced by the flow's return step. */
export type SurveyValues = Required<SurveyDraftValues>;

export type SurveyDraft = {
  version: 2;
  step: SurveyStep;
  values: SurveyDraftValues;
  completed?: true;
};

export function defaultPicturesValue(): PicturesValue {
  return { retailArea: "", playArea: "" };
}

export function defaultSeatingValue(): SeatingValue {
  return { tables: null, chairs: null };
}

export function defaultSocialValue(): SocialValue {
  return { instagram: "", facebook: "", tiktok: "" };
}

export function defaultDayHours(): DayHours {
  return { closed: false, open: "", close: "" };
}

export function defaultHoursValue(): HoursValue {
  const hours = {} as HoursValue;
  for (const day of DAY_KEYS) hours[day] = defaultDayHours();
  return hours;
}

export function defaultEventValue(): EventValue {
  return { enabled: false, date: "", time: "", info: "" };
}

export function defaultFeedbackValue(): FeedbackValue {
  return { shop: "", retailer: "" };
}

/** Fill every step of a (possibly partial) draft into a full survey shape. */
export function draftToSurveyValues(values: SurveyDraftValues): SurveyValues {
  return {
    shop: values.shop ?? emptyShopValue(),
    pictures: values.pictures ?? defaultPicturesValue(),
    seating: values.seating ?? defaultSeatingValue(),
    social: values.social ?? defaultSocialValue(),
    hours: values.hours ?? defaultHoursValue(),
    event: values.event ?? defaultEventValue(),
    notableEvent: values.notableEvent ?? defaultEventValue(),
    learnToPlay: values.learnToPlay ?? defaultEventValue(),
    externalEvent: values.externalEvent ?? defaultEventValue(),
    feedback: values.feedback ?? defaultFeedbackValue(),
    personalEvent: values.personalEvent ?? defaultEventValue(),
    otherProducts: values.otherProducts ?? "",
  };
}

const FIELD_STEP: Record<DraftField, SurveyStep> = STEP_KEYS.reduce(
  (map, key, index) => ({ ...map, [key]: index as SurveyStep }),
  {} as Record<DraftField, SurveyStep>,
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function boundedText(value: unknown, max: number): string | null {
  if (typeof value !== "string" || value.length > max) return null;
  return value;
}

/** Free-text fields coerce invalid input (wrong type or oversized) to "". */
function textOrEmpty(value: unknown, max: number): string {
  if (typeof value !== "string" || value.length > max) return "";
  return value;
}

function dateOrEmpty(value: unknown): string | null {
  if (value === undefined || value === "") return "";
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return null;
  return value;
}

function timeOrEmpty(value: unknown): string | null {
  if (value === undefined || value === "") return "";
  if (typeof value !== "string" || !TIME_PATTERN.test(value)) return null;
  return value;
}

function seatingCount(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 0 ||
    value > SEATING_MAX
  ) {
    return null;
  }
  return value;
}

/** Stale or malformed sample ids fall back to "" so the rest still restores. */
function sampleIdOrEmpty(value: unknown): string {
  if (value === "upload-selected") return value;
  if (typeof value !== "string" || !PICTURE_SAMPLE_IDS.has(value)) return "";
  return value;
}

function validDayHours(value: unknown): DayHours | null {
  if (!isRecord(value)) return null;
  if (typeof value.closed !== "boolean") return null;
  const open = timeOrEmpty(value.open);
  const close = timeOrEmpty(value.close);
  if (open === null || close === null) return null;
  if (value.closed) return { closed: true, open: "", close: "" };
  return { closed: false, open, close };
}

function validEvent(value: unknown): EventValue | null {
  if (!isRecord(value)) return null;
  if (value.enabled !== undefined && typeof value.enabled !== "boolean") {
    return null;
  }
  const date = dateOrEmpty(value.date);
  const time = timeOrEmpty(value.time);
  if (date === null || time === null) return null;
  const info = textOrEmpty(value.info, MAX_TEXT_LENGTH);
  if (!value.enabled) return { enabled: false, date: "", time: "", info: "" };
  return { enabled: true, date, time, info };
}

/**
 * Validate one step value and return its canonical (normalized) form, or null
 * when the value is malformed or references data that no longer exists. The
 * validators accept any partially-answered shape a live user could produce —
 * completeness is enforced by the step UI, not by storage.
 */
function validateStepValue(
  key: DraftField,
  value: unknown,
): SurveyDraftValues[DraftField] | null {
  switch (key) {
    case "shop": {
      if (!isRecord(value)) return null;
      const { selection, branchId } = value;
      if (
        typeof selection !== "string" ||
        typeof branchId !== "string" ||
        !SHOP_SELECTION_PATTERN.test(selection)
      ) {
        return null;
      }
      if (selection.startsWith("chain:")) {
        const group = CHAIN_GROUPS.find(
          (chain) => chain.slug === selection.slice("chain:".length),
        );
        // Stale chain slug: drop the whole shop answer.
        if (!group) return null;
        // Stale branch id: keep the chain, force a fresh branch pick.
        const hasBranch = group.branches.some(
          (branch) => branch.id === branchId,
        );
        return hasBranch
          ? { selection, branchId }
          : { selection, branchId: "" };
      }
      const retailer = STANDALONE_RETAILERS.some((row) => row.id === selection.slice("retailer:".length));
      return retailer ? { selection, branchId: "" } : null;
    }
    case "pictures": {
      if (!isRecord(value)) return null;
      return {
        retailArea: sampleIdOrEmpty(value.retailArea),
        playArea: sampleIdOrEmpty(value.playArea),
      };
    }
    case "seating": {
      if (!isRecord(value)) return null;
      return { tables: seatingCount(value.tables), chairs: seatingCount(value.chairs) };
    }
    case "social": {
      if (!isRecord(value)) return null;
      return {
        instagram: textOrEmpty(value.instagram, MAX_HANDLE_LENGTH),
        facebook: textOrEmpty(value.facebook, MAX_HANDLE_LENGTH),
        tiktok: textOrEmpty(value.tiktok, MAX_HANDLE_LENGTH),
      };
    }
    case "hours": {
      if (!isRecord(value)) return null;
      const hours = defaultHoursValue();
      for (const day of DAY_KEYS) {
        const validated = validDayHours(value[day]);
        hours[day] = validated ?? defaultDayHours();
      }
      return hours;
    }
    case "event":
    case "notableEvent":
    case "learnToPlay":
    case "externalEvent":
    case "personalEvent":
      return validEvent(value);
    case "feedback": {
      if (!isRecord(value)) return null;
      return {
        shop: textOrEmpty(value.shop, MAX_TEXT_LENGTH),
        retailer: textOrEmpty(value.retailer, MAX_TEXT_LENGTH),
      };
    }
    case "otherProducts":
      return boundedText(value, MAX_TEXT_LENGTH);
  }
}

/** Validate every known key of a raw values record; unknown keys are dropped. */
export function sanitizeDraftValues(
  raw: Record<string, unknown>,
): SurveyDraftValues {
  const values: SurveyDraftValues = {};
  for (const key of STEP_KEYS) {
    if (raw[key] === undefined) continue;
    const validated = validateStepValue(key, raw[key]);
    if (validated !== null) Object.assign(values, { [key]: validated });
  }
  return values;
}

function hasRequiredCompletedAnswers(values: SurveyDraftValues): boolean {
  const shop = values.shop;
  if (!shop || resolveShop(shop) === null) return false;
  const seating = values.seating;
  if (!seating || seating.tables === null || seating.chairs === null) {
    return false;
  }
  return true;
}

/**
 * Parse and validate a raw draft payload. Returns null when the payload is
 * absent, corrupt, oversized, or from an unknown version. Individual step
 * values that are malformed or stale are dropped so the rest of the progress
 * still restores; a `completed` flag without the required answers is stripped
 * and the draft stays in progress.
 */
export function parseSurveyDraft(raw: string | null): SurveyDraft | null {
  if (!raw || raw.length > MAX_RAW_LENGTH) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(parsed)) return null;

  const { version, step, values, completed } = parsed;
  if (version !== DRAFT_VERSION) return null;
  if (
    typeof step !== "number" ||
    !Number.isInteger(step) ||
    step < 0 ||
    step > 11
  ) {
    return null;
  }
  if (!isRecord(values)) return null;

  const draft: SurveyDraft = {
    version: DRAFT_VERSION,
    step: step as SurveyStep,
    values: sanitizeDraftValues(values),
  };
  // Revisit shop selection when an older source's saved IDs no longer resolve.
  // Keep all other keyed answers so replacing the shop does not discard progress.
  if (values.shop !== undefined && (!draft.values.shop || !resolveShop(draft.values.shop))) {
    draft.step = 0;
  }
  if (completed === true && hasRequiredCompletedAnswers(draft.values)) {
    draft.completed = true;
  }
  return draft;
}

/**
 * Build a Formity `State` that resumes the flow at the draft's current step.
 * The flow is a flat list with one form per slot (0 through 11), so
 * resuming at step k replays the
 * points a live run would have produced and seeds memory with every saved step
 * value — including answers from steps after the current one, so they survive
 * Back + refresh + Next.
 */
export function draftToFormityState(draft: SurveyDraft): State {
  const valuesThrough = (step: number): Record<string, unknown> => {
    const values: Record<string, unknown> = {};
    for (let index = 0; index < step; index += 1) {
      const key = STEP_KEYS[index];
      const value = draft.values[key];
      if (value !== undefined) values[key] = value;
    }
    return values;
  };

  const points: State["points"] = [];
  for (let step = 0; step <= draft.step; step += 1) {
    const values = valuesThrough(step);
    points.push({
      path: [{ type: "list", slot: step }],
      values: { ...values },
    });
  }

  const list: State["memory"]["list"] = {};
  STEP_KEYS.forEach((key, index) => {
    const value = draft.values[key];
    if (value === undefined) return;
    list[index] = {
      [key]: { data: { here: true, data: value }, keys: {} },
    };
  });

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
    const payload = JSON.stringify(draft);
    if (payload.length > MAX_RAW_LENGTH) return;
    storage.setItem(SURVEY_DRAFT_STORAGE_KEY, payload);
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

/** Re-validate values before they are written so the payload stays bounded. */
function sanitizeDraft(draft: SurveyDraft): SurveyDraft {
  const values = sanitizeDraftValues(draft.values as Record<string, unknown>);
  const next: SurveyDraft = { ...draft, values };
  if (draft.completed && !hasRequiredCompletedAnswers(values)) {
    delete next.completed;
  }
  return next;
}

export function useSurveyDraft() {
  const [draft, setDraft] = useState<SurveyDraft | null>(null);
  const [ready, setReady] = useState(false);
  const draftRef = useRef<SurveyDraft | null>(null);

  const commitDraft = useCallback((next: SurveyDraft | null) => {
    const sanitized = next === null ? null : sanitizeDraft(next);
    draftRef.current = sanitized;
    setDraft(sanitized);
    if (sanitized) writeStoredDraft(sanitized);
    else removeStoredDraft();
  }, []);

  // Load after mount so the server-rendered output matches the first client
  // render; `ready` gates mounting the flow until the draft is known.
  useEffect(() => {
    commitDraft(readStoredDraft());
    setReady(true);
  }, [commitDraft]);

  const saveDraft = useCallback(
    (next: { step: SurveyStep; values: SurveyDraftValues; completed?: true }) =>
      commitDraft({
        version: DRAFT_VERSION,
        step: next.step,
        values: { ...draftRef.current?.values, ...next.values },
        ...(next.completed ? { completed: next.completed } : {}),
      }),
    [commitDraft],
  );

  /** Save the unsent input of one step as a partial update of its value. */
  const saveField = useCallback(
    (field: DraftField, partial: unknown) => {
      const values: Record<string, unknown> = {
        ...draftRef.current?.values,
      };
      const current = values[field];
      if (field === "otherProducts") {
        if (typeof partial === "string") values[field] = partial;
      } else if (isRecord(partial)) {
        values[field] = { ...(isRecord(current) ? current : {}), ...partial };
      }
      commitDraft({
        version: DRAFT_VERSION,
        step: FIELD_STEP[field],
        values: values as SurveyDraftValues,
      });
    },
    [commitDraft],
  );

  const clearDraft = useCallback(() => commitDraft(null), []);

  return { draft, ready, saveDraft, saveField, clearDraft };
}
