import type { SurveyValues } from "./useSurveyDraft";
import { resolveShop } from "./surveyData";
import { MAX_IMAGE_BYTES, UPLOAD_SELECTED, type SurveyImage } from "./surveyImages";

export const SUBMIT_URL = "https://livetest-api.betobee.co/api/survey/sales-distributor/submitSurvey";
export const RETRY_KEY = "kcgames-retailer-survey-submit-v1";
export type Receipt = { surveyID: string; submissionId: string; status: "received"; receivedDate: string };

type SubmissionAnswers = Omit<SurveyValues, "shop"> & {
  shop: SurveyValues["shop"] & { id: string; ref: string };
};
type Attempt = { submissionId: string; answers: SubmissionAnswers; imageHashes?: string[] };

/** Credential-free snapshot: ambiguous outcomes must retry the exact same payload. */
function getAttempt(answers: SubmissionAnswers, imageHashes: string[]): Attempt {
  try {
    const raw = sessionStorage.getItem(RETRY_KEY);
    if (raw) {
      if (raw.length > 40000) throw new Error();
      const saved = JSON.parse(raw) as Attempt;
      if (!saved || typeof saved.submissionId !== "string" || !/^[A-Za-z0-9_-]{8,100}$/.test(saved.submissionId) || !saved.answers) throw new Error();
      if (JSON.stringify(saved.answers) !== JSON.stringify(answers) || JSON.stringify(saved.imageHashes ?? []) !== JSON.stringify(imageHashes)) {
        throw new Error("CHANGED");
      }
      return { submissionId: saved.submissionId, answers, imageHashes };
    }
    const attempt = { submissionId: crypto.randomUUID(), answers, imageHashes };
    sessionStorage.setItem(RETRY_KEY, JSON.stringify(attempt));
    return attempt;
  } catch (error) {
    if (error instanceof Error && error.message === "CHANGED") {
      throw new Error("Rejected: answers differ or photos changed from the previous submission attempt. Restore the same answers and photos before retrying; do not create a duplicate submission.");
    }
    throw new Error("Not sent: submission recovery data is unavailable. Enable session storage and try again.");
  }
}

export function clearSubmissionAttempt() {
  try { sessionStorage.removeItem(RETRY_KEY); } catch { /* Receipt remains authoritative. */ }
}

const ERRORS: Record<number, string> = {
  400: "Rejected: check the survey and your email/password.",
  401: "Rejected: invalid email or password.",
  403: "Rejected: this distributor user is not allowed to submit a survey.",
  409: "Rejected: this submission ID was already used with different answers. Do not automatically retry with a new ID.",
  429: "Rejected: too many attempts. Wait before retrying.",
  500: "Not accepted: the service could not complete the submission. Retry with the same answers and submission ID.",
};

export async function submitSurvey(answers: SurveyValues, email: string, password: string, selectedImages: SurveyImage[] = []): Promise<Receipt> {
  const images = [...selectedImages].sort((a, b) => a.key.localeCompare(b.key));
  if (images.length > 2 || new Set(images.map((image) => image.key)).size !== images.length || images.some((image) => !["retailArea", "playArea"].includes(image.key) || !["image/jpeg", "image/png", "image/webp"].includes(image.fileType) || !image.base64 || !/^[A-Za-z0-9+/]+={0,2}$/.test(image.base64) || image.base64.length * 0.75 > MAX_IMAGE_BYTES)) {
    throw new Error("Not sent: invalid photo. Choose JPEG, PNG or WebP up to 5 MB.");
  }
  for (const key of ["retailArea", "playArea"] as const) {
    if (answers.pictures[key] === UPLOAD_SELECTED && !images.some((image) => image.key === key)) {
      throw new Error("Not sent: reselect the photos after refresh before submitting. Your answers are retained.");
    }
  }
  const selectedShop = resolveShop(answers.shop);
  if (!selectedShop || !selectedShop.retailer.id || !selectedShop.retailer.serial) {
    throw new Error("Not sent: choose a valid shop and branch before submitting.");
  }
  const normalized: SubmissionAnswers = {
    ...answers,
    shop: {
      selection: answers.shop.selection,
      branchId: answers.shop.branchId,
      id: selectedShop.retailer.id,
      ref: selectedShop.retailer.serial,
    },
    pictures: { ...answers.pictures },
  };
  for (const image of images) normalized.pictures[image.key] = "";
  const imageHashes = await Promise.all(images.map(async (image) => {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${image.key}:${image.fileType}:${image.base64}`));
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }));
  const attempt = getAttempt(normalized, imageHashes);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    let response: Response;
    try {
      response = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        cache: "no-store",
        redirect: "error",
        referrerPolicy: "no-referrer",
        signal: controller.signal,
        body: JSON.stringify({ credentials: { email: email.trim(), password }, schemaVersion: "kcg-retailer-survey-v1", submissionId: attempt.submissionId, answers: attempt.answers, ...(images.length ? { images: images.map(({ key, fileType, base64 }) => ({ key, fileType, base64 })) } : {}) }),
      });
    } catch {
      throw new Error("Not confirmed: connection failed or timed out. Your answers and submission ID are retained; retry with the same answers.");
    }
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(ERRORS[response.status] ?? "Not confirmed: unexpected server response. Keep the same answers and submission ID when retrying.");
    }
    let body;
    try { body = await response.json(); } catch { /* Malformed success is not acceptance. */ }
    const receipt = body?.receipt;
    if (!receipt || typeof receipt.surveyID !== "string" || !receipt.surveyID.trim() || receipt.submissionId !== attempt.submissionId || receipt.status !== "received" || typeof receipt.receivedDate !== "string" || !receipt.receivedDate.trim()) {
      throw new Error("Not confirmed: no valid receipt was returned. Retry with the same answers and submission ID.");
    }
    return { surveyID: receipt.surveyID, submissionId: receipt.submissionId, status: "received", receivedDate: receipt.receivedDate };
  } finally {
    clearTimeout(timeout);
  }
}
