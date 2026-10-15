import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SurveyForm from "./SurveyForm";
import { DAY_KEYS, SURVEY_DRAFT_STORAGE_KEY as KEY, type SurveyDraftValues } from "./useSurveyDraft";

function next() { fireEvent.click(screen.getByRole("button", { name: /^next$/i })); }
function back() { fireEvent.click(screen.getByRole("button", { name: /^back$/i })); }
function change(label: RegExp, value: string) { fireEvent.change(screen.getByLabelText(label), { target: { value } }); }
function seed(step: number, values: SurveyDraftValues = {}) {
  sessionStorage.setItem(KEY, JSON.stringify({ version: 2, step, values }));
}
function chooseShop() { change(/choose your shop/i, "retailer:52"); next(); }
function seating() { change(/^tables/i, "4"); change(/^chairs/i, "16"); next(); }
function closeWeek() { for (const day of DAY_KEYS) fireEvent.click(screen.getByLabelText(new RegExp(`^${day} closed$`, "i"))); next(); }
function progress(n: number) { expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(n)); }
function eventAnswer(info: string) {
  fireEvent.click(screen.getByRole("checkbox"));
  change(/^date/i, "2026-12-10"); change(/^time/i, "14:30"); change(/^event info/i, info); next();
}

describe("retailer survey simulation", () => {
  beforeEach(() => { sessionStorage.clear(); });

  it("shows retailer-only choices and conditional branch selection", () => {
    render(<SurveyForm />); progress(1);
    next(); expect(screen.getByRole("alert")).toHaveTextContent(/choose your shop/i);
    change(/choose your shop/i, "chain:box-hunt"); next();
    expect(screen.getByRole("alert")).toHaveTextContent(/choose the branch/i);
    change(/which branch/i, "1");
    change(/choose your shop/i, "chain:games-haven");
    expect(screen.getByLabelText(/which branch/i)).toHaveValue("");
    change(/choose your shop/i, "retailer:52");
    expect(screen.queryByLabelText(/which branch/i)).not.toBeInTheDocument();
    next(); progress(2);
  });

  it("completes all twelve sections in order with distinct event answers and simulated SUBMIT", () => {
    render(<SurveyForm />);
    chooseShop(); progress(2);
    change(/retail area picture/i, "retail-card-wall"); change(/play area picture/i, "play-table-rows"); next();
    progress(3); seating(); progress(4);
    change(/^instagram/i, "@demo_shop"); change(/^facebook/i, "Demo shop"); change(/^tiktok/i, "@demo"); next();
    progress(5); closeWeek();
    progress(6); eventAnswer("Regular event simulation");
    progress(7); expect(screen.getByRole("checkbox")).not.toBeChecked(); eventAnswer("Notable simulation");
    progress(8); eventAnswer("Learn to play simulation");
    progress(9); eventAnswer("External simulation");
    progress(10); change(/^shop feedback/i, "Shop feedback simulation"); change(/^retailer feedback/i, "Retailer feedback simulation"); next();
    progress(11); eventAnswer("Personal simulation");
    progress(12); change(/^other products sold/i, "Board games and sleeves");
    fireEvent.click(screen.getByRole("button", { name: "SUBMIT" }));
    expect(screen.getByRole("heading", { name: /simulation complete/i })).toBeInTheDocument();
    for (const answer of ["Regular event simulation", "Notable simulation", "Learn to play simulation", "External simulation", "Personal simulation", "Board games and sleeves"]) {
      expect(screen.getByText(answer, { exact: false })).toBeInTheDocument();
    }
    expect(screen.getByText("TCG Malaysia")).toBeInTheDocument();
    expect(JSON.parse(sessionStorage.getItem(KEY)!)).toMatchObject({ completed: true, step: 11 });
  });

  it("allows optional pictures, social, events, feedback and products to be skipped", () => {
    render(<SurveyForm />); chooseShop(); next(); seating(); next(); closeWeek();
    for (let step = 6; step <= 11; step++) { progress(step); next(); }
    progress(12); fireEvent.click(screen.getByRole("button", { name: "SUBMIT" }));
    expect(screen.getByRole("heading", { name: /simulation complete/i })).toBeInTheDocument();
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
    seed(3, { shop: { selection: "retailer:52", branchId: 0 }, seating: { tables: 4, chairs: 16 } });
    const view = render(<SurveyForm />);
    change(/^instagram/i, "@unfinished"); view.unmount();
    const restored = render(<SurveyForm />); progress(4);
    expect(screen.getByLabelText(/^instagram/i)).toHaveValue("@unfinished");
    back(); progress(3); restored.unmount();
    render(<SurveyForm />); progress(3); next(); progress(4);
    expect(screen.getByLabelText(/^instagram/i)).toHaveValue("@unfinished");
  });

  it("restores every section at the same step including future draft answers", () => {
    const values: SurveyDraftValues = { shop: { selection: "retailer:52", branchId: 0 }, seating: { tables: 4, chairs: 16 }, feedback: { shop: "unsent", retailer: "draft" } };
    for (let step = 0; step < 12; step++) {
      seed(step, values); const view = render(<SurveyForm />); progress(step + 1); view.unmount();
    }
    seed(9, values); render(<SurveyForm />);
    expect(screen.getByLabelText(/^shop feedback/i)).toHaveValue("unsent");
  });

  it("restores completed summaries and Start over clears only this survey", () => {
    sessionStorage.setItem("unrelated", "keep");
    sessionStorage.setItem(KEY, JSON.stringify({ version: 2, step: 11, completed: true, values: { shop: { selection: "retailer:52", branchId: 0 }, seating: { tables: 0, chairs: 0 }, otherProducts: "Sleeves" } }));
    render(<SurveyForm />);
    expect(screen.getByRole("heading", { name: /simulation complete/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /start over/i })); progress(1);
    expect(sessionStorage.getItem(KEY)).toBeNull(); expect(sessionStorage.getItem("unrelated")).toBe("keep");
  });

  it.each(["{broken", JSON.stringify({ version: 1, step: 11, values: {} })])("ignores corrupt or incompatible drafts", (payload) => {
    sessionStorage.setItem(KEY, payload); render(<SurveyForm />); progress(1);
  });

  it("continues when storage writes fail", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("blocked"); });
    try { render(<SurveyForm />); chooseShop(); progress(2); } finally { spy.mockRestore(); }
  });
});
