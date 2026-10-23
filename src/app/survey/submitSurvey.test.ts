import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { draftToSurveyValues } from "./useSurveyDraft";
import { RETRY_KEY, SUBMIT_URL, clearSubmissionAttempt, submitSurvey } from "./submitSurvey";

const answers = () => draftToSurveyValues({ otherProducts: "TEST-sleeves" });
const success = (status: number) => vi.fn().mockImplementation(async (_url, init) => ({ status, json: async () => ({ receipt: { surveyID: "TEST-reference", submissionId: JSON.parse(init.body).submissionId, status: "received", receivedDate: "2026-10-23T00:00:00Z" } }) }));

describe("livetest survey request", () => {
  beforeEach(() => { sessionStorage.clear(); });
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); vi.useRealTimers(); });

  it.each([200, 201])("accepts only the confirmed receipt for HTTP %i", async (status) => {
    const fetch = success(status); vi.stubGlobal("fetch", fetch);
    const receipt = await submitSurvey(answers(), "TEST@example.invalid", "TEST-secret");
    expect(receipt.surveyID).toBe("TEST-reference");
    const [url, request] = fetch.mock.calls[0];
    expect(url).toBe(SUBMIT_URL);
    expect(request.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(request.body)).toMatchObject({ credentials: { email: "TEST@example.invalid", password: "TEST-secret" }, schemaVersion: "kcg-retailer-survey-v1", answers: answers() });
    expect(sessionStorage.getItem(RETRY_KEY)).not.toContain("TEST-secret");
    expect(sessionStorage.getItem(RETRY_KEY)).not.toContain("TEST@example.invalid");
  });

  it.each([400, 401, 403, 409, 429, 500, 502])("retains retry identity and does not echo error bodies for %i", async (status) => {
    const fetch = vi.fn().mockResolvedValue({ status, json: async () => ({ error: "TEST-secret must not be echoed" }) }); vi.stubGlobal("fetch", fetch);
    await expect(submitSurvey(answers(), "a@example.invalid", "TEST-secret")).rejects.not.toThrow("TEST-secret");
    const snapshot = sessionStorage.getItem(RETRY_KEY);
    const acceptedFetch = success(200); vi.stubGlobal("fetch", acceptedFetch);
    await submitSurvey(answers(), "a@example.invalid", "different-password");
    expect(sessionStorage.getItem(RETRY_KEY)).toBe(snapshot);
    expect(JSON.parse(acceptedFetch.mock.calls[0][1].body).submissionId).toBe(JSON.parse(snapshot!).submissionId);
  });

  it("retains the exact attempt after a network failure and across fresh answer objects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    await expect(submitSurvey(answers(), "a@example.invalid", "secret")).rejects.toThrow(/Not confirmed/);
    const snapshot = sessionStorage.getItem(RETRY_KEY);
    vi.stubGlobal("fetch", success(200));
    await submitSurvey(answers(), "a@example.invalid", "secret");
    expect(sessionStorage.getItem(RETRY_KEY)).toBe(snapshot);
  });

  it("does not reuse the attempt for changed answers", async () => {
    const fetch = vi.fn().mockResolvedValue({ status: 401 }); vi.stubGlobal("fetch", fetch);
    await expect(submitSurvey(answers(), "a@example.invalid", "secret")).rejects.toThrow();
    await expect(submitSurvey({ ...answers(), otherProducts: "changed" }, "a@example.invalid", "secret")).rejects.toThrow(/answers differ/);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it.each([{}, { receipt: { status: "processing" } }, { receipt: { surveyID: "x", submissionId: "wrong-id", status: "received", receivedDate: "now" } }])("does not accept malformed or unrelated success receipts", async (body) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 201, json: async () => body }));
    await expect(submitSurvey(answers(), "a@example.invalid", "secret")).rejects.toThrow(/Not confirmed/);
    expect(sessionStorage.getItem(RETRY_KEY)).not.toBeNull();
  });

  it("times out without losing retry identity", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn().mockImplementation((_url, init) => new Promise((_resolve, reject) => init.signal.addEventListener("abort", () => reject(new Error("aborted"))))));
    const result = submitSurvey(answers(), "a@example.invalid", "secret");
    const assertion = expect(result).rejects.toThrow(/timed out/);
    await vi.advanceTimersByTimeAsync(45000); await assertion;
    expect(sessionStorage.getItem(RETRY_KEY)).not.toBeNull();
  });

  it("fails closed when retry storage is corrupt or blocked", async () => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    sessionStorage.setItem(RETRY_KEY, "{broken");
    await expect(submitSurvey(answers(), "a@example.invalid", "secret")).rejects.toThrow(/Not sent/);
    sessionStorage.clear();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    await expect(submitSurvey(answers(), "a@example.invalid", "secret")).rejects.toThrow(/Not sent/);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("clears only its retry key", () => {
    sessionStorage.setItem(RETRY_KEY, "test"); sessionStorage.setItem("unrelated", "keep");
    clearSubmissionAttempt(); expect(sessionStorage.getItem(RETRY_KEY)).toBeNull(); expect(sessionStorage.getItem("unrelated")).toBe("keep");
  });
});
