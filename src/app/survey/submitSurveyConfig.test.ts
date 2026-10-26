import { afterEach, describe, expect, it, vi } from "vitest";

describe("survey build endpoint", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

  it("keeps demo/local on the test API by default", async () => {
    vi.stubEnv("NEXT_PUBLIC_SURVEY_SUBMIT_URL", "");
    delete process.env.NEXT_PUBLIC_SURVEY_SUBMIT_URL;
    vi.resetModules();
    const { SUBMIT_URL } = await import("./submitSurvey");
    expect(SUBMIT_URL).toBe("https://livetest-api.betobee.co/api/survey/sales-distributor/submitSurvey");
  });

  it("uses the production URL supplied by the live build", async () => {
    vi.stubEnv("NEXT_PUBLIC_SURVEY_SUBMIT_URL", "https://api.betobee.co/api/survey/sales-distributor/submitSurvey");
    vi.resetModules();
    const { SUBMIT_URL } = await import("./submitSurvey");
    expect(SUBMIT_URL).toBe("https://api.betobee.co/api/survey/sales-distributor/submitSurvey");
  });
});
