import { beforeEach, describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import SurveyForm from "./SurveyForm";
import { SURVEY_DRAFT_STORAGE_KEY as DRAFT_KEY } from "./useSurveyDraft";

function seedDraft(draft: unknown) {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function replaceSessionStorage(impl: PropertyDescriptor) {
  Object.defineProperty(window, "sessionStorage", impl);
}

function goToExperienceStep(gameTitle: string) {
  fireEvent.change(screen.getByLabelText(/which kc games title/i), {
    target: { value: gameTitle },
  });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
}

function goToFeedbackStep(gameTitle: string, rating: number) {
  goToExperienceStep(gameTitle);
  fireEvent.click(screen.getByRole("radio", { name: new RegExp(String(rating)) }));
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
}

function completeSurvey(gameTitle: string, rating: number, feedback?: string) {
  goToFeedbackStep(gameTitle, rating);
  const feedbackField = screen.getByLabelText(/additional feedback/i);
  if (feedback) {
    fireEvent.change(feedbackField, { target: { value: feedback } });
  }
  fireEvent.click(screen.getByRole("button", { name: /see my answers/i }));
}

describe("SurveyForm", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders the demo notice, step 1, and accessible progress", () => {
    render(<SurveyForm />);

    expect(screen.getByText(/demo mode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/which kc games title/i)).toBeInTheDocument();

    const progress = screen.getByRole("progressbar", {
      name: /survey progress/i,
    });
    expect(progress).toHaveAttribute("aria-valuemin", "1");
    expect(progress).toHaveAttribute("aria-valuemax", "3");
    expect(progress).toHaveAttribute("aria-valuenow", "1");

    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /back to home/i })).toHaveLength(2);
  });

  it("requires a game title before continuing", () => {
    render(<SurveyForm />);

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      /please enter a game title/i,
    );
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
  });

  it("advances to the experience step with the accumulated game interest", () => {
    render(<SurveyForm />);

    goToExperienceStep("Riftbound");

    expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: /survey progress/i }),
    ).toHaveAttribute("aria-valuenow", "2");
    expect(
      screen.getByText(/experience with riftbound/i),
    ).toBeInTheDocument();
  });

  it("requires an experience rating before continuing", () => {
    render(<SurveyForm />);

    goToExperienceStep("Riftbound");
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      /please select a rating/i,
    );
    expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();
  });

  it("keeps earlier answers when navigating back and forward", () => {
    render(<SurveyForm />);

    goToFeedbackStep("Riftbound", 4);

    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /4/ })).toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/which kc games title/i)).toHaveValue(
      "Riftbound",
    );

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByRole("radio", { name: /4/ })).toBeChecked();
  });

  it("shows the completion summary with all collected values", () => {
    render(<SurveyForm />);

    completeSurvey("Riftbound", 5, "More Riftbound events please");

    const summary = screen.getByText(/thank you!/i).closest("div");
    expect(summary).not.toBeNull();
    expect(within(summary as HTMLElement).getByText("Riftbound")).toBeInTheDocument();
    expect(within(summary as HTMLElement).getByText("5/5")).toBeInTheDocument();
    expect(
      within(summary as HTMLElement).getByText(/more riftbound events please/i),
    ).toBeInTheDocument();
  });

  it("treats feedback as optional and reports it as not provided", () => {
    render(<SurveyForm />);

    completeSurvey("King's Quest", 3);

    const summary = screen.getByText(/thank you!/i).closest("div");
    expect(summary).not.toBeNull();
    expect(summary).toHaveTextContent(/not provided/i);
    expect(within(summary as HTMLElement).getByText("3/5")).toBeInTheDocument();
  });

  it("keeps the typed feedback when navigating back and then forward", () => {
    render(<SurveyForm />);

    goToFeedbackStep("Riftbound", 4);
    fireEvent.change(screen.getByLabelText(/additional feedback/i), {
      target: { value: "More local tournaments" },
    });

    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByText(/step 3 of 3/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/additional feedback/i)).toHaveValue(
      "More local tournaments",
    );
  });

  it("restarts the survey from scratch", () => {
    render(<SurveyForm />);

    completeSurvey("Riftbound", 2);
    fireEvent.click(screen.getByRole("button", { name: /start over/i }));

    expect(screen.queryByText(/thank you!/i)).not.toBeInTheDocument();
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/which kc games title/i)).toHaveValue("");
    expect(
      screen.getByRole("progressbar", { name: /survey progress/i }),
    ).toHaveAttribute("aria-valuenow", "1");
    expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it("persists progress in the session draft while answering", () => {
    render(<SurveyForm />);

    goToExperienceStep("Riftbound");
    expect(JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "")).toEqual({
      version: 1,
      step: 1,
      values: { gameInterest: "Riftbound" },
    });

    fireEvent.click(screen.getByRole("radio", { name: /4/ }));
    expect(JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "")).toEqual({
      version: 1,
      step: 1,
      values: { gameInterest: "Riftbound", experienceRating: 4 },
    });
  });

  it("restores an in-progress first step with its saved input", () => {
    seedDraft({ version: 1, step: 0, values: { gameInterest: "Riftbound" } });
    render(<SurveyForm />);

    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/which kc games title/i)).toHaveValue(
      "Riftbound",
    );
  });

  it("restores the experience step with the saved rating and continues from it", () => {
    seedDraft({
      version: 1,
      step: 1,
      values: { gameInterest: "Riftbound", experienceRating: 4 },
    });
    render(<SurveyForm />);

    expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();
    expect(screen.getByText(/experience with riftbound/i)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /4/ })).toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByText(/step 3 of 3/i)).toBeInTheDocument();
  });

  it("restores the feedback step with unsent feedback and finishes from it", () => {
    seedDraft({
      version: 1,
      step: 2,
      values: {
        gameInterest: "Riftbound",
        experienceRating: 4,
        feedback: "Half-typed thought",
      },
    });
    render(<SurveyForm />);

    expect(screen.getByText(/step 3 of 3/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/additional feedback/i)).toHaveValue(
      "Half-typed thought",
    );

    fireEvent.click(screen.getByRole("button", { name: /see my answers/i }));
    expect(screen.getByText(/thank you!/i)).toBeInTheDocument();
  });

  it("keeps unsent typing across a remount", () => {
    const { unmount } = render(<SurveyForm />);
    fireEvent.change(screen.getByLabelText(/which kc games title/i), {
      target: { value: "Riftb" },
    });
    unmount();

    render(<SurveyForm />);
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/which kc games title/i)).toHaveValue("Riftb");
  });

  it("keeps an unsent rating selection across a remount", () => {
    const { unmount } = render(<SurveyForm />);
    goToExperienceStep("Riftbound");
    fireEvent.click(screen.getByRole("radio", { name: /4/ }));
    unmount();

    render(<SurveyForm />);
    expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /4/ })).toBeChecked();
  });

  it("keeps earlier answers when navigating back after a restore", () => {
    seedDraft({
      version: 1,
      step: 1,
      values: { gameInterest: "Riftbound", experienceRating: 4 },
    });
    render(<SurveyForm />);

    fireEvent.click(screen.getByRole("button", { name: /back/i }));

    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/which kc games title/i)).toHaveValue(
      "Riftbound",
    );
  });

  it("keeps later draft answers when going back and refreshing", () => {
    seedDraft({ version: 1, step: 2, values: {
      gameInterest: "Riftbound", experienceRating: 4, feedback: "Unsent draft",
    } });
    const { unmount } = render(<SurveyForm />);
    fireEvent.click(screen.getByRole("button", { name: /^back$/i }));
    unmount();
    render(<SurveyForm />);
    expect(screen.getByRole("radio", { name: /4/ })).toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByLabelText(/additional feedback/i)).toHaveValue("Unsent draft");
  });

  it("restores a completed survey as the summary and clears it on start over", () => {
    seedDraft({
      version: 1,
      step: 2,
      values: { gameInterest: "Riftbound", experienceRating: 5, feedback: "Great" },
      completed: true,
    });
    render(<SurveyForm />);

    expect(screen.getByText(/thank you!/i)).toBeInTheDocument();
    expect(screen.getByText("Riftbound")).toBeInTheDocument();
    expect(screen.getByText("5/5")).toBeInTheDocument();
    expect(screen.getByText("Great")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /start over/i }));
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/which kc games title/i)).toHaveValue("");
    expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it("start over clears only the survey draft key", () => {
    sessionStorage.setItem("unrelated-app-key", "keep me");
    render(<SurveyForm />);

    completeSurvey("Riftbound", 2);
    fireEvent.click(screen.getByRole("button", { name: /start over/i }));

    expect(sessionStorage.getItem("unrelated-app-key")).toBe("keep me");
    expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it("treats a corrupt draft as no draft", () => {
    sessionStorage.setItem(DRAFT_KEY, "{not json at all");
    render(<SurveyForm />);

    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/which kc games title/i)).toHaveValue("");
  });

  it("rejects drafts with an unknown version", () => {
    seedDraft({
      version: 2,
      step: 1,
      values: { gameInterest: "Riftbound", experienceRating: 4 },
    });
    render(<SurveyForm />);

    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/which kc games title/i)).toHaveValue("");
  });

  it("still completes the survey when storage access throws", () => {
    const original = Object.getOwnPropertyDescriptor(window, "sessionStorage");
    expect(original).toBeDefined();
    replaceSessionStorage({
      configurable: true,
      get() {
        throw new DOMException("Storage blocked", "SecurityError");
      },
    });

    try {
      render(<SurveyForm />);
      completeSurvey("Riftbound", 5, "Still works");
      expect(screen.getByText(/thank you!/i)).toBeInTheDocument();
    } finally {
      replaceSessionStorage(original!);
    }
  });

  it("still completes the survey when storage writes fail", () => {
    const original = Object.getOwnPropertyDescriptor(window, "sessionStorage");
    expect(original).toBeDefined();
    replaceSessionStorage({
      configurable: true,
      value: {
        getItem: () => null,
        setItem: () => {
          throw new DOMException("Quota exceeded", "QuotaExceededError");
        },
        removeItem: () => {},
      },
    });

    try {
      render(<SurveyForm />);
      completeSurvey("Riftbound", 4);
      expect(screen.getByText(/thank you!/i)).toBeInTheDocument();
    } finally {
      replaceSessionStorage(original!);
    }
  });
});
