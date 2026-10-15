import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import SurveyForm from "./SurveyForm";

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
  });
});
