import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import SurveyForm from "./SurveyForm";
import { RETRY_KEY } from "./submitSurvey";
import { DAY_KEYS, SURVEY_DRAFT_STORAGE_KEY as KEY, type SurveyDraftValues } from "./useSurveyDraft";

/** Valid standalone retailer selection from authoritative source. */
const VALID_SHOP_SELECTION = "retailer:6a204dcccada14e24b758e79";
/** Valid chain-group branch selection. */
const CHAIN_HAVEN_BRANCH = "chain:games-haven|6a0eaff24e59c09193f726af";

function next() { fireEvent.click(screen.getByRole("button", { name: /^next$/i })); }
function back() { fireEvent.click(screen.getByRole("button", { name: /^back$/i })); }
function change(label: RegExp, value: string) { fireEvent.change(screen.getByLabelText(label), { target: { value } }); }
function seed(step: number, values: SurveyDraftValues = {}) {
  sessionStorage.setItem(KEY, JSON.stringify({ version: 2, step, values }));
}
function chooseShop() {
  change(/choose your shop/i, VALID_SHOP_SELECTION);
  next();
}
function seating() { change(/^tables/i, "4"); change(/^chairs/i, "16"); next(); }
function closeWeek() { for (const day of DAY_KEYS) fireEvent.click(screen.getByLabelText(new RegExp(`^${day} closed$`, "i"))); next(); }
function progress(n: number) { expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(n)); }
function eventAnswer(info: string) {
  fireEvent.click(screen.getByRole("checkbox"));
  change(/^date/i, "2026-12-10"); change(/^time/i, "14:30"); change(/^event info/i, info); next();
}

describe("retailer survey simulation", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks(); vi.unstubAllGlobals();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 401 }));
    HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
    HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
  });

  it("shows retailer-only choices and conditional branch selection", () => {
    render(<SurveyForm />); progress(1);
    next(); expect(screen.getByRole("alert")).toHaveTextContent(/choose your shop/i);
    change(/choose your shop/i, "chain:games-haven"); next();
    expect(screen.getByRole("alert")).toHaveTextContent(/choose the branch/i);
    change(/which branch/i, CHAIN_HAVEN_BRANCH.split("|")[1]);
    change(/choose your shop/i, VALID_SHOP_SELECTION);
    expect(screen.queryByLabelText(/which branch/i)).not.toBeInTheDocument();
    next(); progress(2);
  });

  it("completes all twelve sections in order and opens the submission UI", async () => {
    render(<SurveyForm />);
    chooseShop(); progress(2);
    next(); // Photos are optional; real uploads are covered below.
    progress(3); seating(); progress(4);
    change(/^instagram/i, "@demo_shop"); change(/^facebook/i, "Demo shop"); change(/^tiktok/i, "@demo"); next();
    progress(5); closeWeek();
    progress(6); eventAnswer("Regular event simulation");
    progress(7); expect(screen.getByRole("checkbox")).not.toBeChecked(); eventAnswer("Notable simulation");
    progress(8); eventAnswer("Learn to play simulation");
    progress(9); eventAnswer("External simulation");
    progress(10); eventAnswer("Personal simulation");
    progress(11); change(/^shop feedback/i, "Shop feedback simulation"); change(/^retailer feedback/i, "Retailer feedback simulation"); next();
    progress(12); change(/^other products sold/i, "Board games and sleeves");
    fireEvent.click(screen.getByRole("button", { name: "Ready to submit" }));
    expect(screen.getByRole("dialog", { name: "Ready to submit" })).toBeInTheDocument();
    expect(JSON.parse(sessionStorage.getItem(KEY)!)).toMatchObject({ step: 11, values: { personalEvent: { info: "Personal simulation" }, feedback: { shop: "Shop feedback simulation" }, otherProducts: "Board games and sleeves" } });
    expect(JSON.parse(sessionStorage.getItem(KEY)!)).not.toHaveProperty("completed");
  });

  it("allows optional pictures, social, events, feedback and products to be skipped", () => {
    render(<SurveyForm />); chooseShop(); next(); seating(); next(); closeWeek();
    for (let step = 6; step <= 11; step++) { progress(step); next(); }
    progress(12); fireEvent.click(screen.getByRole("button", { name: "Ready to submit" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("requires whole nonnegative seating counts and accepts zero", () => {
    seed(2); render(<SurveyForm />); next(); progress(3);
    change(/^tables/i, "-1"); change(/^chairs/i, "2.5"); next();
    expect(screen.getByRole("alert")).toHaveTextContent(/whole number/i);
    change(/^tables/i, "0"); change(/^chairs/i, "0"); next(); progress(4);
  });

  it("requires opening and closing times for an open day", () => {
    seed(4); render(<SurveyForm />); next();
    expect(screen.getByRole("alert")).toHaveTextContent(/opening and closing/i);
    closeWeek(); progress(6);
  });

  it("requires event date, time and info only when enabled", () => {
    seed(5); render(<SurveyForm />);
    fireEvent.click(screen.getByRole("checkbox")); next(); progress(6);
    expect(screen.getAllByRole("alert")).toHaveLength(3);
    change(/^date/i, "2026-12-10"); change(/^time/i, "10:00"); change(/^event info/i, "Event simulation"); next(); progress(7);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("restores partial social typing on refresh and preserves it through back navigation", () => {
    seed(3, { shop: { selection: VALID_SHOP_SELECTION, branchId: "" }, seating: { tables: 4, chairs: 16 } });
    const view = render(<SurveyForm />);
    change(/^instagram/i, "@unfinished"); view.unmount();
    const restored = render(<SurveyForm />); progress(4);
    expect(screen.getByLabelText(/^instagram/i)).toHaveValue("@unfinished");
    back(); progress(3); restored.unmount();
    render(<SurveyForm />); progress(3); next(); progress(4);
    expect(screen.getByLabelText(/^instagram/i)).toHaveValue("@unfinished");
  });

  it("restores every section at the same step including future draft answers", () => {
    const values: SurveyDraftValues = { shop: { selection: VALID_SHOP_SELECTION, branchId: "" }, seating: { tables: 4, chairs: 16 }, feedback: { shop: "unsent", retailer: "draft" } };
    for (let step = 0; step < 12; step++) {
      seed(step, values); const view = render(<SurveyForm />); progress(step + 1); view.unmount();
    }
    seed(10, values); render(<SurveyForm />);
    expect(screen.getByLabelText(/^shop feedback/i)).toHaveValue("unsent");
  });

  it("keeps swapped steps aligned through next, back and refresh", () => {
    seed(9);
    const view = render(<SurveyForm />); progress(10);
    expect(screen.getByRole("checkbox", { name: /personal event/i })).toBeInTheDocument();
    eventAnswer("Personal draft"); progress(11);
    change(/^shop feedback/i, "Feedback draft");
    back(); progress(10);
    expect(screen.getByLabelText(/^event info/i)).toHaveValue("Personal draft");
    view.unmount();
    render(<SurveyForm />); progress(10);
    expect(screen.getByLabelText(/^event info/i)).toHaveValue("Personal draft");
    next(); progress(11);
    expect(screen.getByLabelText(/^shop feedback/i)).toHaveValue("Feedback draft");
  });

  it("restores completed summaries and Start over clears only this survey", () => {
    sessionStorage.setItem("unrelated", "keep");
    sessionStorage.setItem(KEY, JSON.stringify({ version: 2, step: 11, completed: true, values: { shop: { selection: VALID_SHOP_SELECTION, branchId: "" }, seating: { tables: 0, chairs: 0 }, otherProducts: "Sleeves" } }));
    render(<SurveyForm />);
    expect(screen.getByRole("heading", { name: /simulation complete/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /start over/i })); progress(1);
    expect(sessionStorage.getItem(KEY)).toBeNull(); expect(sessionStorage.getItem("unrelated")).toBe("keep");
  });

  it.each(["{broken", JSON.stringify({ version: 1, step: 11, values: {} })])("ignores corrupt or incompatible drafts", (payload) => {
    sessionStorage.setItem(KEY, payload); render(<SurveyForm />); progress(1);
  });

  it("dismisses only with X or Cancel and never stores credentials", async () => {
    seed(11, { shop: { selection: VALID_SHOP_SELECTION, branchId: "" }, otherProducts: "Sleeves" });
    render(<SurveyForm />);
    const open = () => fireEvent.click(screen.getByRole("button", { name: "Ready to submit" }));
    open();
    const dialog = screen.getByRole("dialog");
    fireEvent.click(dialog);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(fireEvent(dialog, new Event("cancel", { cancelable: true }))).toBe(false);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    change(/^email/i, "test@example.invalid"); change(/^password/i, "fake-secret");
    fireEvent.click(screen.getByRole("button", { name: /^submit$/i }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/Rejected/i));
    expect(screen.getByLabelText(/^password/i)).toHaveValue("");
    expect(sessionStorage.getItem(KEY)).not.toContain("fake-secret");
    expect(sessionStorage.getItem(KEY)).not.toContain("test@example.invalid");
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/^other products/i)).toHaveValue("Sleeves");
    open(); expect(screen.getByLabelText(/^email/i)).toHaveValue("");
    change(/^password/i, "discard-this");
    fireEvent.click(screen.getByRole("button", { name: /close submission dialog/i }));
    open(); expect(screen.getByLabelText(/^password/i)).toHaveValue("");
  });

  it("sends all answers once, shows an accepted receipt and clears only survey data", async () => {
    sessionStorage.setItem("unrelated", "keep");
    seed(11, { shop: { selection: VALID_SHOP_SELECTION, branchId: "" }, seating: { tables: 4, chairs: 16 }, feedback: { shop: "TEST-feedback", retailer: "" }, otherProducts: "TEST-sleeves" });
    const fetchMock = vi.fn().mockImplementation(async (_url, init) => {
      const payload = JSON.parse(init.body);
      return { status: 201, json: async () => ({ receipt: { surveyID: "TEST-receipt", submissionId: payload.submissionId, status: "received", receivedDate: "2026-10-23T00:00:00Z" } }) };
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<SurveyForm />);
    fireEvent.click(screen.getByRole("button", { name: "Ready to submit" }));
    change(/^email/i, "test@example.invalid"); change(/^password/i, "TEST-password");
    const form = screen.getByRole("button", { name: /^submit$/i }).closest("form")!;
    fireEvent.submit(form); fireEvent.submit(form);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Accepted" })).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload).toMatchObject({ credentials: { email: "test@example.invalid", password: "TEST-password" }, schemaVersion: "kcg-retailer-survey-v1", answers: { seating: { tables: 4, chairs: 16 }, feedback: { shop: "TEST-feedback" }, otherProducts: "TEST-sleeves" } });
    expect(Object.keys(payload.answers)).toHaveLength(12);
    expect(fetchMock.mock.calls[0][1].headers).not.toHaveProperty("Authorization");
    expect(sessionStorage.getItem(KEY)).toBeNull();
    expect(sessionStorage.getItem(RETRY_KEY)).toBeNull();
    expect(sessionStorage.getItem("unrelated")).toBe("keep");
  });

  it("removes the staging notice and provides real file inputs", () => {
    seed(1); render(<SurveyForm />);
    expect(screen.queryByText(/Draft answers stay in this tab session until/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Simulated samples only/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/retail area picture/i)).toHaveAttribute("type", "file");
    expect(screen.getByLabelText(/play area picture/i)).toHaveAttribute("accept", "image/jpeg,image/png,image/webp");
  });

  it("rejects unsupported and oversized files before preparing them", async () => {
    seed(1); render(<SurveyForm />);
    fireEvent.change(screen.getByLabelText(/retail area picture/i), { target: { files: [new File(["svg"], "unsafe.svg", { type: "image/svg+xml" })] } });
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/JPEG, PNG or WebP/i));
    fireEvent.change(screen.getByLabelText(/play area picture/i), { target: { files: [new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.jpg", { type: "image/jpeg" })] } });
    await waitFor(() => expect(screen.getAllByRole("alert").some((node) => node.textContent?.includes("5 MB"))).toBe(true));
    expect(fetch).not.toHaveBeenCalled();
  });

  it("carries real photo bytes through back/next and into the submit request", async () => {
    vi.stubGlobal("Image", class {
      naturalWidth = 80; naturalHeight = 60; onload?: () => void;
      set src(_value: string) { queueMicrotask(() => this.onload?.()); }
    });
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ fillRect: vi.fn(), drawImage: vi.fn() } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/jpeg;base64,/9j/VEVTVC1QSE9UTw==");
    const { webcrypto } = await import("node:crypto"); vi.stubGlobal("crypto", webcrypto);
    seed(1, { shop: { selection: VALID_SHOP_SELECTION, branchId: "" } }); render(<SurveyForm />);
    fireEvent.change(screen.getByLabelText(/retail area picture/i), { target: { files: [new File(["TEST-file"], "private-name.png", { type: "image/png" })] } });
    await waitFor(() => expect(screen.getByAltText(/retail area picture preview/i)).toBeInTheDocument());
    next(); progress(3); back(); progress(2);
    expect(screen.getByAltText(/retail area picture preview/i)).toBeInTheDocument();
    next(); seating(); next(); closeWeek();
    for (let step = 6; step <= 11; step++) next();
    fireEvent.click(screen.getByRole("button", { name: "Ready to submit" }));
    change(/^email/i, "test@example.invalid"); change(/^password/i, "TEST-password");
    fireEvent.click(screen.getByRole("button", { name: /^submit$/i }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/Rejected/i));
    const payload = JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string);
    expect(payload.images).toEqual([{ key: "retailArea", fileType: "image/jpeg", base64: "/9j/VEVTVC1QSE9UTw==" }]);
    expect(payload.answers.pictures.retailArea).toBe("");
    expect(sessionStorage.getItem(KEY)).toContain("upload-selected");
    expect(sessionStorage.getItem(KEY)).not.toContain("/9j/");
    expect(sessionStorage.getItem(RETRY_KEY)).not.toContain("/9j/");
    expect(sessionStorage.getItem(RETRY_KEY)).not.toContain("private-name");
  });

  it("requires reselection or removal after refresh without losing other answers", () => {
    seed(1, { pictures: { retailArea: "upload-selected", playArea: "" }, otherProducts: "retain" });
    render(<SurveyForm />); next(); progress(2);
    expect(screen.getByText(/Reselect or remove the photos before continuing/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /remove retail area picture/i }));
    next(); progress(3);
    expect(JSON.parse(sessionStorage.getItem(KEY)!)).toMatchObject({ values: { pictures: { retailArea: "" }, otherProducts: "retain" } });
  });

  it("continues when storage writes fail", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("blocked"); });
    try { render(<SurveyForm />); chooseShop(); progress(2); } finally { spy.mockRestore(); }
  });

  // --- Hours Step (Step 5) ---

  it("renders wider text inputs with Opening/Closing column headers and closed checkboxes", () => {
    seed(4); render(<SurveyForm />); next();
    // Column header labels (may appear multiple times due to per-day + mobile header)
    expect(screen.getAllByText(/opening/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/closing/i).length).toBeGreaterThan(0);
    // Day name labels still present
    expect(screen.getByText("Monday")).toBeInTheDocument();
    // Closed checkbox per day
    DAY_KEYS.forEach(day => {
      expect(screen.getByLabelText(new RegExp(`^${day} closed$`, "i"))).toBeInTheDocument();
    });
    // Inputs are text type, not native time picker
    DAY_KEYS.forEach(day => {
      const openInput = screen.getByLabelText(new RegExp(`^${day} opening time$`, "i"));
      expect(openInput).toHaveAttribute("type", "text");
      expect(openInput).toHaveAttribute("placeholder", "HH:MM");
    });
  });

  it("normalizes H:MM to HH:MM on blur and accepts on Next", () => {
    seed(4); render(<SurveyForm />); next();
    for (let i = 0; i < 7; i++) {
      const day = DAY_KEYS[i];
      fireEvent.change(screen.getByLabelText(new RegExp(`^${day} opening time$`, "i")), { target: { value: "9:30" } });
      fireEvent.change(screen.getByLabelText(new RegExp(`^${day} closing time$`, "i")), { target: { value: "18:00" } });
    }
    // Blur triggers normalization
    for (const day of DAY_KEYS) {
      fireEvent.blur(screen.getByLabelText(new RegExp(`^${day} opening time$`, "i")));
      fireEvent.blur(screen.getByLabelText(new RegExp(`^${day} closing time$`, "i")));
    }
    // Values should be normalized
    for (const day of DAY_KEYS) {
      expect(screen.getByLabelText(new RegExp(`^${day} opening time$`, "i"))).toHaveValue("09:30");
      expect(screen.getByLabelText(new RegExp(`^${day} closing time$`, "i"))).toHaveValue("18:00");
    }
    next(); progress(6);
  });

  it("preserves unfinished typed values during drafting without losing sibling times", () => {
    seed(4); const view = render(<SurveyForm />); next();
    // Set monday fully
    fireEvent.change(screen.getByLabelText(/monday opening time/i), { target: { value: "10:00" } });
    fireEvent.change(screen.getByLabelText(/monday closing time/i), { target: { value: "18:00" } });
    // Start typing Tuesday with incomplete value
    fireEvent.change(screen.getByLabelText(/tuesday opening time/i), { target: { value: "10:0" } });
    view.unmount();
    // Restore from draft
    const restored = render(<SurveyForm />); next();
    expect(screen.getByLabelText(/monday opening time/i)).toHaveValue("10:00");
    expect(screen.getByLabelText(/monday closing time/i)).toHaveValue("18:00");
    expect(screen.getByLabelText(/tuesday opening time/i)).toHaveValue("10:0");
    // Completing it should normalize on blur
    fireEvent.change(screen.getByLabelText(/tuesday opening time/i), { target: { value: "10:00" } });
    fireEvent.blur(screen.getByLabelText(/tuesday opening time/i));
    expect(screen.getByLabelText(/tuesday opening time/i)).toHaveValue("10:00");
  });

  it("shows day-specific error messages for missing malformed times on open days", () => {
    seed(4); render(<SurveyForm />); next();
    // Set only monday, leave tuesday empty
    fireEvent.change(screen.getByLabelText(/monday opening time/i), { target: { value: "10:00" } });
    fireEvent.change(screen.getByLabelText(/monday closing time/i), { target: { value: "18:00" } });
    // Clicking Next shows error for tuesday
    fireEvent.click(screen.getByRole("button", { name: /^next$/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/tuesday/i);
    // Enter abc as tuesday open (stays as-is since normalize doesn't touch non-time text)
    // and fill close — Tuesday must still be rejected
    fireEvent.change(screen.getByLabelText(/tuesday opening time/i), { target: { value: "abc" } });
    fireEvent.change(screen.getByLabelText(/tuesday closing time/i), { target: { value: "18:00" } });
    fireEvent.click(screen.getByRole("button", { name: /^next$/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/tuesday/i);
    progress(5);
  });

  it.each(["24:00", "12:60", "abc", "12:"])("rejects invalid typed time %s before leaving hours", (invalid) => {
    seed(4); render(<SurveyForm />); next();
    DAY_KEYS.slice(1).forEach(day => fireEvent.click(screen.getByLabelText(new RegExp(`^${day} closed$`, "i"))));
    change(/monday opening time/i, invalid); change(/monday closing time/i, "18:00");
    next(); progress(5);
    expect(screen.getByRole("alert")).toHaveTextContent(/Monday/);
  });

  it("normalizes typed H:MM on Next without requiring a blur", () => {
    seed(4); render(<SurveyForm />); next();
    DAY_KEYS.slice(1).forEach(day => fireEvent.click(screen.getByLabelText(new RegExp(`^${day} closed$`, "i"))));
    change(/monday opening time/i, "9:30"); change(/monday closing time/i, "01:00");
    next(); progress(6);
    expect(JSON.parse(sessionStorage.getItem(KEY)!).values.hours.monday).toEqual({ closed: false, open: "09:30", close: "01:00" });
  });

  it("keeps closed-day behavior: checking closed clears times, disabled inputs", () => {
    seed(4); render(<SurveyForm />); next();
    // Fill in monday
    fireEvent.change(screen.getByLabelText(/monday opening time/i), { target: { value: "10:00" } });
    fireEvent.change(screen.getByLabelText(/monday closing time/i), { target: { value: "18:00" } });
    // Check closed for tuesday-through-sunday
    DAY_KEYS.slice(1).forEach(day => {
      fireEvent.click(screen.getByLabelText(new RegExp(`^${day} closed$`, "i")));
    });
    expect(screen.getByLabelText(/tuesday opening time/i)).toHaveValue("");
    expect(screen.getByLabelText(/tuesday opening time/i)).toBeDisabled();
    expect(screen.getByLabelText(/tuesday closing time/i)).toBeDisabled();
    next(); progress(6);
  });

  it("unchecking closed preserves previously filled times", () => {
    seed(4); render(<SurveyForm />); next();
    // Fill monday and tuesday
    fireEvent.change(screen.getByLabelText(/monday opening time/i), { target: { value: "10:00" } });
    fireEvent.change(screen.getByLabelText(/monday closing time/i), { target: { value: "18:00" } });
    fireEvent.change(screen.getByLabelText(/tuesday opening time/i), { target: { value: "09:00" } });
    fireEvent.change(screen.getByLabelText(/tuesday closing time/i), { target: { value: "17:00" } });
    // Close tuesday by ticking closed — clears its times
    const tuesdayCheckbox = screen.getByLabelText(/tuesday closed/i);
    fireEvent.click(tuesdayCheckbox);
    expect(screen.getByLabelText(/tuesday opening time/i)).toHaveValue("");
    expect(screen.getByLabelText(/tuesday opening time/i)).toBeDisabled();
    // Uncheck closed — times restored from draft via Formity
    fireEvent.click(tuesdayCheckbox);
    expect(screen.getByLabelText(/tuesday opening time/i)).not.toBeDisabled();
    // Re-fill and submit
    fireEvent.change(screen.getByLabelText(/tuesday opening time/i), { target: { value: "09:30" } });
    fireEvent.change(screen.getByLabelText(/tuesday closing time/i), { target: { value: "17:00" } });
    DAY_KEYS.slice(2).forEach(day => fireEvent.click(screen.getByLabelText(new RegExp(`^${day} closed$`, "i"))));
    next(); progress(6);
  });

  // --- Submission Modal Password Toggle ---

  it("opens the submission dialog when user clicks Ready to submit", () => {
    seed(11, { shop: { selection: VALID_SHOP_SELECTION, branchId: "" }, otherProducts: "Sleeves" });
    render(<SurveyForm />);
    fireEvent.click(screen.getByRole("button", { name: "Ready to submit" }));
    expect(screen.getByRole("dialog", { name: /ready to submit/i })).toBeInTheDocument();
  });

  it("toggles password visibility with eye/eyeoff icons and aria-pressed", () => {
    seed(11, { shop: { selection: VALID_SHOP_SELECTION, branchId: "" } });
    render(<SurveyForm />);
    fireEvent.click(screen.getByRole("button", { name: "Ready to submit" }));
    const dialog = screen.getByRole("dialog");
    // Should have an eye button next to the password field
    const eyeButton = within(dialog).getByRole("button", { name: /show password/i });
    expect(eyeButton).toBeInTheDocument();
    expect(eyeButton).toHaveAttribute("aria-pressed", "false");
    // Input should be type password
    const passwordInput = within(dialog).getByLabelText(/^password/i);
    expect(passwordInput).toHaveAttribute("type", "password");
    // Click to show
    fireEvent.click(eyeButton);
    expect(within(dialog).getByRole("button", { name: /hide password/i })).toBeInTheDocument();
    expect(eyeButton).toHaveAttribute("aria-pressed", "true");
    expect(passwordInput).toHaveAttribute("type", "text");
    // Click again to hide
    fireEvent.click(eyeButton);
    expect(within(dialog).getByRole("button", { name: /show password/i })).toBeInTheDocument();
    expect(eyeButton).toHaveAttribute("aria-pressed", "false");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("resets password visibility to masked on reopen and after attempts", async () => {
    seed(11, { shop: { selection: VALID_SHOP_SELECTION, branchId: "" } });
    render(<SurveyForm />);
    const open = () => {
      fireEvent.click(screen.getByRole("button", { name: "Ready to submit" }));
      return screen.getByRole("dialog");
    };
    const dialog = open();
    const eyeButton = within(dialog).getByRole("button", { name: /show password/i });
    fireEvent.click(eyeButton);
    expect(eyeButton).toHaveAttribute("aria-pressed", "true");
    // Submit fails -> closes, reopen -> masked
    change(/^email/i, "test@example.invalid"); change(/^password/i, "fake-secret");
    const form = dialog.querySelector("form")!;
    fireEvent.submit(form);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/Rejected/i));
    // Reopen
    const reopened = open();
    const reEye = within(reopened).getByRole("button", { name: /show password/i });
    expect(reEye).toHaveAttribute("aria-pressed", "false");
    const pwInput = within(reopened).getByLabelText(/^password/i);
    expect(pwInput).toHaveAttribute("type", "password");
  });

  it("preserves password case and spaces through the eye toggle and request", async () => {
    seed(11, { shop: { selection: VALID_SHOP_SELECTION, branchId: "" } });
    const fetchMock = vi.fn().mockResolvedValue({ status: 401 });
    vi.stubGlobal("fetch", fetchMock);
    render(<SurveyForm />);
    fireEvent.click(screen.getByRole("button", { name: "Ready to submit" }));
    const input = screen.getByLabelText(/^password/i);
    change(/^email/i, "test@example.invalid");
    change(/^password/i, " Dummy-Case123! ");
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveValue(" Dummy-Case123! ");
    expect(fetchMock).not.toHaveBeenCalled();
    fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).credentials.password).toBe(" Dummy-Case123! ");
    await waitFor(() => expect(input).toHaveValue(""));
    expect(input).toHaveAttribute("type", "password");
  });

  it("disables eye button while submitting", async () => {
    seed(11, { shop: { selection: VALID_SHOP_SELECTION, branchId: "" } });
    render(<SurveyForm />);
    fireEvent.click(screen.getByRole("button", { name: "Ready to submit" }));
    const dialog = screen.getByRole("dialog");
    const eyeButton = within(dialog).getByRole("button", { name: /show password/i });
    expect(eyeButton).toBeEnabled();
    fireEvent.click(eyeButton);
    expect(within(dialog).getByLabelText(/^password/i)).toHaveAttribute("type", "text");
    // Busy state — disable while submitting
    vi.useFakeTimers();
    const form = dialog.querySelector("form")!;
    // Make fetch hang by not mocking a response
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    change(/^email/i, "test@example.invalid"); change(/^password/i, "secret");
    fireEvent.submit(form);
    expect(eyeButton).toBeDisabled();
    expect(within(dialog).getByLabelText(/^password/i)).toHaveAttribute("type", "password");
    vi.useRealTimers();
  });
});
