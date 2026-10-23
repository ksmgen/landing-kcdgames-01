import type { SurveyValues } from "./useSurveyDraft";

export const SUBMIT_URL = "https://livetest-api.betobee.co/api/survey/sales-distributor/submitSurvey";
export const RETRY_KEY = "kcgames-retailer-survey-submit-v1";
export type Receipt = { surveyID: string; submissionId: string; status: "received"; receivedDate: string };

type Attempt = { submissionId: string; answers: SurveyValues };

/** Credential-free snapshot: ambiguous outcomes must retry the exact same payload. */
function getAttempt(answers: SurveyValues): Attempt {
  try {
    const raw = sessionStorage.getItem(RETRY_KEY);
    if (raw) {
      if (raw.length > 40000) throw new Error();
      const saved = JSON.parse(raw) as Attempt;
      if (!saved || typeof saved.submissionId !== "string" || !/^[A-Za-z0-9_-]{8,100}$/.test(saved.submissionId) || !saved.answers) throw new Error();
      if (JSON.stringify(saved.answers) !== JSON.stringify(answers)) {
        throw new Error("CHANGED");
      }
      return { submissionId: saved.submissionId, answers };
    }
    const attempt = { submissionId: crypto.randomUUID(), answers };
    sessionStorage.setItem(RETRY_KEY, JSON.stringify(attempt));
    return attempt;
  } catch (error) {
    if (error instanceof Error && error.message === "CHANGED") {
      throw new Error("Rejected: answers differ from the previous submission attempt. Restore those answers before retrying; do not create a duplicate submission.");
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

export async function submitSurvey(answers: SurveyValues, email: string, password: string): Promise<Receipt> {
  const attempt = getAttempt(answers);
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
        body: JSON.stringify({ credentials: { email: email.trim(), password }, schemaVersion: "kcg-retailer-survey-v1", ...attempt }),
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
