"use client";

import type { FormEvent, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useFormity } from "@formity/react";
import type { Flow, OnReturn, State, s } from "@formity/react";
import {
  draftToFormityState,
  useSurveyDraft,
  type DraftField,
  type SurveyDraft,
} from "./useSurveyDraft";

const TOTAL_STEPS = 3;

const RATINGS = [
  { value: 1, label: "Novice" },
  { value: 2, label: "Beginner" },
  { value: 3, label: "Intermediate" },
  { value: 4, label: "Experienced" },
  { value: 5, label: "Expert" },
];

type SurveyValues = {
  gameInterest: string;
  experienceRating: number;
  feedback: string;
};

type SurveySchema = {
  render: ReactNode;
  struct: [
    s.Form<{ gameInterest: string }>,
    s.Yield<{
      next: [{ type: "next"; data: { gameInterest: string } }];
      back: [{ type: "back"; data: { gameInterest: string } }];
    }>,
    s.Form<{ experienceRating: number }>,
    s.Yield<{
      next: [{ type: "next"; data: { experienceRating: number } }];
      back: [{ type: "back"; data: { experienceRating: number } }];
    }>,
    s.Form<{ feedback: string }>,
    s.Yield<{
      next: [{ type: "next"; data: { feedback: string } }];
      back: [{ type: "back"; data: { feedback: string } }];
    }>,
    s.Return<SurveyValues>,
  ];
  inputs: Record<never, never>;
  params: Record<never, never>;
};

type SurveyDraftStore = {
  saveDraft: (draft: SurveyDraft) => void;
  saveField: (field: DraftField, value: string | number) => void;
};

/**
 * Build the Formity flow with yield handlers that mirror every navigation
 * into the session draft: `next` stores the step being entered with the
 * accumulated answers, `back` stores the step being returned to.
 */
function createSurveyFlow({
  saveDraft,
  saveField,
}: SurveyDraftStore): Flow<SurveySchema> {
  return [
    {
      form: {
        fields: () => ({ gameInterest: ["", []] }),
        render: ({ fields, next }) => (
          <InterestStep
            gameInterest={fields.gameInterest}
            onNext={next}
            onDraftChange={(value) => saveField("gameInterest", value)}
          />
        ),
      },
    },
    {
      yield: {
        next: (values) => {
          saveDraft({
            version: 1,
            step: 1,
            values: { gameInterest: values.gameInterest },
          });
          return [{ type: "next", data: { gameInterest: values.gameInterest } }];
        },
        back: (values) => {
          saveDraft({
            version: 1,
            step: 0,
            values: { gameInterest: values.gameInterest },
          });
          return [{ type: "back", data: { gameInterest: values.gameInterest } }];
        },
      },
    },
    {
      form: {
        fields: () => ({ experienceRating: [0, []] }),
        render: ({ fields, values, next, back }) => (
          <ExperienceStep
            rating={fields.experienceRating}
            gameInterest={values.gameInterest}
            onNext={next}
            onBack={back}
            onDraftChange={(value) => saveField("experienceRating", value)}
          />
        ),
      },
    },
    {
      yield: {
        next: (values) => {
          saveDraft({
            version: 1,
            step: 2,
            values: {
              gameInterest: values.gameInterest,
              experienceRating: values.experienceRating,
            },
          });
          return [
            { type: "next", data: { experienceRating: values.experienceRating } },
          ];
        },
        back: (values) => {
          saveDraft({
            version: 1,
            step: 1,
            values: {
              gameInterest: values.gameInterest,
              experienceRating: values.experienceRating,
            },
          });
          return [
            { type: "back", data: { experienceRating: values.experienceRating } },
          ];
        },
      },
    },
    {
      form: {
        fields: () => ({ feedback: ["", []] }),
        render: ({ fields, next, back }) => (
          <FeedbackStep
            feedback={fields.feedback}
            onNext={next}
            onBack={back}
            onDraftChange={(value) => saveField("feedback", value)}
          />
        ),
      },
    },
    {
      yield: {
        next: (values) => [{ type: "next", data: { feedback: values.feedback } }],
        back: (values) => [{ type: "back", data: { feedback: values.feedback } }],
      },
    },
    {
      return: ({ gameInterest, experienceRating, feedback }) => ({
        gameInterest,
        experienceRating,
        feedback,
      }),
    },
  ];
}

export default function SurveyForm() {
  const { draft, ready, saveDraft, saveField, clearDraft } = useSurveyDraft();
  const [values, setValues] = useState<SurveyValues | null>(null);

  // Formity hands the accumulated answers back here. They are kept in React
  // state and the tab's session draft only — never submitted or sent anywhere.
  const handleReturn = useCallback<OnReturn<SurveySchema>>(
    (returned) => {
      setValues(returned);
      saveDraft({
        version: 1,
        step: 2,
        values: {
          gameInterest: returned.gameInterest,
          experienceRating: returned.experienceRating,
          feedback: returned.feedback,
        },
        completed: true,
      });
    },
    [saveDraft],
  );

  // Start over: drop the displayed answers and clear only the survey's own
  // session draft key, so a fresh flow mounts from step 1.
  const handleStartOver = useCallback(() => {
    clearDraft();
    setValues(null);
  }, [clearDraft]);

  const restoredValues = useMemo<SurveyValues | null>(() => {
    if (!draft?.completed) return null;
    return {
      gameInterest: draft.values.gameInterest ?? "",
      experienceRating: draft.values.experienceRating ?? 0,
      feedback: draft.values.feedback ?? "",
    };
  }, [draft]);

  const summaryValues = values ?? restoredValues;

  return (
    <main className="relative min-h-screen overflow-hidden bg-navy-950 pb-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-navy-800 via-navy-950 to-navy-950 opacity-80" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)", backgroundSize: "24px 24px" }} />

      <div className="relative mx-auto max-w-2xl px-6 py-12 sm:px-10 sm:py-16">
        <a href="/" className="group mb-8 inline-flex min-h-12 items-center rounded-lg border border-silver-400/30 bg-navy-900/60 px-4 py-2 text-sm font-semibold text-silver-200 backdrop-blur-sm transition-all hover:border-white hover:bg-navy-800 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
          Back to Home
        </a>

        <div className="rounded-2xl border border-navy-700/50 bg-card-gradient p-6 shadow-2xl sm:p-10">
          <h1 className="mb-2 font-display text-2xl font-bold text-white sm:text-3xl">KC Games Player Survey</h1>
          <p className="mb-6 text-sm text-navy-200">Help us shape what comes next. Share your game interest and experience.</p>

          <DemoNotice />

          {ready ? (
            summaryValues ? (
              <SurveySummary
                values={summaryValues}
                onStartOver={handleStartOver}
              />
            ) : (
              <SurveyFlow
                initialDraft={draft}
                saveDraft={saveDraft}
                saveField={saveField}
                onReturn={handleReturn}
              />
            )
          ) : null}
        </div>

        <footer className="mt-12 flex justify-center">
          <a href="/" className="group inline-flex min-h-12 items-center rounded-lg border border-amber-400/40 bg-[rgba(32,28,21,0.78)] px-6 py-3 text-sm font-semibold text-amber-200 backdrop-blur-sm transition-all hover:border-amber-300 hover:bg-[rgba(50,42,28,0.85)] hover:text-amber-100">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
            Back to Home
          </a>
        </footer>
      </div>
    </main>
  );
}

function SurveyFlow({
  initialDraft,
  saveDraft,
  saveField,
  onReturn,
}: {
  initialDraft: SurveyDraft | null;
  saveDraft: (draft: SurveyDraft) => void;
  saveField: (field: DraftField, value: string | number) => void;
  onReturn: OnReturn<SurveySchema>;
}) {
  // The draft snapshot taken at mount is the only input Formity needs to
  // resume. It is captured once so the flow and its state stay stable while
  // the draft keeps updating as the user answers.
  const [initialState] = useState<State | undefined>(() =>
    initialDraft && !initialDraft.completed
      ? draftToFormityState(initialDraft)
      : undefined,
  );

  const flow = useMemo(
    () => createSurveyFlow({ saveDraft, saveField }),
    [saveDraft, saveField],
  );

  return useFormity<SurveySchema>({ flow, initialState, onReturn });
}

function InterestStep({
  gameInterest,
  onNext,
  onDraftChange,
}: {
  gameInterest: string;
  onNext: (fields: { gameInterest: string }) => void;
  onDraftChange: (value: string) => void;
}) {
  const [value, setValue] = useState(gameInterest);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Please enter a game title.");
      return;
    }
    setError(null);
    onNext({ gameInterest: trimmed });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader current={1} />
      <div className="mb-1">
        <label htmlFor="game-interest" className="block">
          <span className="mb-2 block font-display text-base font-semibold text-white">
            Which KC Games title are you most interested in?
          </span>
          <input
            id="game-interest"
            name="gameInterest"
            maxLength={200}
            type="text"
            autoFocus
            required
            aria-invalid={error ? true : undefined}
            aria-describedby="game-interest-error"
            placeholder="e.g. Riftbound, King's Quest…"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              onDraftChange(event.target.value);
            }}
            className="w-full rounded-lg border border-navy-700 bg-navy-900/50 px-4 py-3 text-white placeholder-navy-400 outline-none ring-2 ring-transparent transition-all focus:ring-amber-400/60"
          />
        </label>
        <div className="min-h-[20px] text-xs text-red-300/90">
          {error && (
            <span id="game-interest-error" role="alert" aria-live="polite">
              {error}
            </span>
          )}
        </div>
      </div>
      <button type="submit" className="mt-4 inline-flex min-w-[160px] items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-yellow-300 px-6 py-3 text-base font-bold text-navy-950 shadow-lg transition-all hover:brightness-110 active:scale-[0.98]">
        Next
      </button>
    </form>
  );
}

function ExperienceStep({
  rating,
  gameInterest,
  onNext,
  onBack,
  onDraftChange,
}: {
  rating: number;
  gameInterest: string;
  onNext: (fields: { experienceRating: number }) => void;
  onBack: (fields: { experienceRating: number }) => void;
  onDraftChange: (value: number) => void;
}) {
  const [selected, setSelected] = useState(rating);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) {
      setError("Please select a rating.");
      return;
    }
    setError(null);
    onNext({ experienceRating: selected });
  }

  function handleBack() {
    onBack({ experienceRating: selected });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader current={2} onBack={handleBack} />
      <fieldset
        aria-describedby="experience-rating-error"
        className="flex flex-wrap gap-3"
      >
        <legend className="mb-3 w-full font-display text-base font-semibold text-white">
          How would you rate your experience with {gameInterest || "trading card games"}?
        </legend>
        {RATINGS.map(({ value, label }) => (
          <div key={value} className="flex cursor-pointer flex-col items-center">
            <input
              id={`experience-rating-${value}`}
              type="radio"
              name="experienceRating"
              value={value}
              checked={selected === value}
              onChange={() => {
                setSelected(value);
                setError(null);
                onDraftChange(value);
              }}
              className="peer sr-only"
            />
            <label
              htmlFor={`experience-rating-${value}`}
              className="peer-checked:border-amber-400 peer-checked:bg-amber-400 peer-checked:text-navy-950 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-amber-400 flex h-12 w-12 items-center justify-center rounded-lg border border-navy-700 bg-navy-900/50 text-lg font-bold text-silver-300 transition-all"
            >
              {value}
            </label>
            <span className="mt-1 text-[10px] text-silver-400">{label}</span>
          </div>
        ))}
        <div className="w-full min-h-[20px] text-xs text-red-300/90">
          {error && (
            <span id="experience-rating-error" role="alert" aria-live="polite">
              {error}
            </span>
          )}
        </div>
      </fieldset>
      <button type="submit" className="mt-4 inline-flex min-w-[160px] items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-yellow-300 px-6 py-3 text-base font-bold text-navy-950 shadow-lg transition-all hover:brightness-110 active:scale-[0.98]">
        Next
      </button>
    </form>
  );
}

function FeedbackStep({
  feedback,
  onNext,
  onBack,
  onDraftChange,
}: {
  feedback: string;
  onNext: (fields: { feedback: string }) => void;
  onBack: (fields: { feedback: string }) => void;
  onDraftChange: (value: string) => void;
}) {
  const [value, setValue] = useState(feedback);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onNext({ feedback: value.trim() });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader
        current={3}
        onBack={() => onBack({ feedback: value.trim() })}
      />
      <div className="mb-1">
        <label htmlFor="feedback" className="block">
          <span className="mb-2 block font-display text-base font-semibold text-white">
            Any additional feedback or suggestions? (optional)
          </span>
          <textarea
            id="feedback"
            name="feedback"
            maxLength={2000}
            rows={4}
            placeholder="Optional — tell us what you'd like to see…"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              onDraftChange(event.target.value);
            }}
            className="w-full resize-y rounded-lg border border-navy-700 bg-navy-900/50 px-4 py-3 text-white placeholder-navy-400 outline-none ring-2 ring-transparent transition-all focus:ring-amber-400/60"
          />
        </label>
      </div>
      <button type="submit" className="mt-4 inline-flex min-w-[160px] items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-yellow-300 px-6 py-3 text-base font-bold text-navy-950 shadow-lg transition-all hover:brightness-110 active:scale-[0.98]">
        See my answers
      </button>
    </form>
  );
}

function StepHeader({
  current,
  onBack,
}: {
  current: number;
  onBack?: () => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 pb-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 rounded-lg border border-silver-400/30 bg-navy-900/60 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
        )}
        <span className="ml-auto font-display text-sm font-bold text-silver-400" aria-live="polite">
          Step {current} of {TOTAL_STEPS}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Survey progress"
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={current}
        aria-valuetext={`Step ${current} of ${TOTAL_STEPS}`}
        className="h-1 overflow-hidden rounded-full bg-navy-700"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-500"
          style={{ width: `${(current / TOTAL_STEPS) * 100}%` }}
        />
      </div>
    </div>
  );
}

function DemoNotice() {
  return (
    <div className="mb-6 rounded-xl border border-amber-400/30 bg-[rgba(50,42,28,0.6)] p-4 text-xs leading-relaxed text-amber-200/80">
      <strong className="text-amber-100">Demo mode</strong> — Your answers stay in this browser tab only. They are not sent anywhere or saved to any server. Your progress is saved in this tab session and will appear again if you refresh the page. Closing the tab ends the session.
    </div>
  );
}

function SurveySummary({
  values,
  onStartOver,
}: {
  values: SurveyValues;
  onStartOver: () => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-white">Thank you!</h2>
      <p className="text-sm text-navy-200">
        Here is everything you told us. Nothing was submitted — it stays in this tab session and disappears when you close the tab.
      </p>
      <div className="space-y-3 rounded-xl border border-navy-700 bg-navy-900/40 p-5">
        <ul className="space-y-2 text-sm text-silver-300">
          <li className="flex gap-2">
            <span className="shrink-0 text-silver-500">Game:</span>
            <span className="text-white">{values.gameInterest}</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 text-silver-500">Experience:</span>
            <span className="text-white">{values.experienceRating}/5</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 text-silver-500">Feedback:</span>
            <span className="text-white">
              {values.feedback ? values.feedback : "Not provided"}
            </span>
          </li>
        </ul>
      </div>
      <button
        type="button"
        onClick={onStartOver}
        className="inline-flex items-center rounded-lg border border-silver-400/30 bg-navy-900/60 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-navy-800"
      >
        Start over
      </button>
    </div>
  );
}
