"use client";

import type { FormEvent, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { useFormity } from "@formity/react";
import type { Flow, OnReturn, State, s } from "@formity/react";
import {
  CHAIN_GROUPS,
  PLAY_AREA_SAMPLES,
  RETAIL_AREA_SAMPLES,
  STANDALONE_RETAILERS,
  branchOptionLabel,
  emptyShopValue,
  findPictureSample,
  resolveShop,
  type PictureSample,
  type ShopValue,
} from "./surveyData";
import {
  DAY_KEYS,
  DRAFT_VERSION,
  TOTAL_STEPS,
  defaultEventValue,
  defaultFeedbackValue,
  defaultHoursValue,
  defaultPicturesValue,
  defaultSeatingValue,
  defaultSocialValue,
  draftToFormityState,
  draftToSurveyValues,
  useSurveyDraft,
  type DayKey,
  type DraftField,
  type EventValue,
  type FeedbackValue,
  type HoursValue,
  type PicturesValue,
  type SeatingValue,
  type SocialValue,
  type SurveyDraft,
  type SurveyDraftValues,
  type SurveyStep,
  type SurveyValues,
} from "./useSurveyDraft";

const DAY_LABELS: Record<DayKey, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const SEATING_MAX = 99999;

const fieldLabelClass =
  "mb-2 block font-display text-base font-semibold text-white";

const inputClass =
  "w-full rounded-lg border border-navy-700 bg-navy-900/50 px-4 py-3 text-white placeholder-navy-400 outline-none ring-2 ring-transparent transition-all focus:ring-amber-400/60";

const selectClass =
  "w-full rounded-lg border border-navy-700 bg-navy-900/70 px-4 py-3 text-white outline-none ring-2 ring-transparent transition-all focus:ring-amber-400/60";

const nextButtonClass =
  "mt-4 inline-flex min-w-[160px] items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-yellow-300 px-6 py-3 text-base font-bold text-navy-950 shadow-lg transition-all hover:brightness-110 active:scale-[0.98]";

// Formity's recursive tuple inference exceeds TypeScript's depth for twelve
// large sections. Each runtime node is checked below; this compact boundary
// schema preserves the aggregate return type without expanding that tuple.
type RetailerSurveySchema = {
  render: ReactNode;
  struct: [s.Form<SurveyValues>, s.Return<SurveyValues>];
  inputs: Record<never, never>;
  params: Record<never, never>;
};

type StepRender<K extends keyof SurveyValues> = (args: {
  fields: Pick<SurveyValues, K>;
  next: (fields: Pick<SurveyValues, K>) => void;
  back: (fields: Pick<SurveyValues, K>) => void;
}) => ReactNode;

function formStep<K extends keyof SurveyValues>(
  key: K, initial: SurveyValues[K], render: StepRender<K>,
) {
  return { form: { fields: () => ({ [key]: [initial, []] }), render } };
}

type DraftStore = {
  saveDraft: (next: {
    step: SurveyStep;
    values: SurveyDraftValues;
    completed?: true;
  }) => void;
  saveField: (field: DraftField, partial: unknown) => void;
};

/** Formity controls the steps; callbacks mirror transitions into the session draft. */
function createSurveyFlow({ saveDraft, saveField }: DraftStore) {
  return [
    formStep("shop", emptyShopValue(), ({ fields, next }) => (
          <ShopStep
            value={fields.shop}
            onNext={(fields) => { saveDraft({ step: 1, values: fields }); next(fields); }}
            onDraftChange={(partial) => saveField("shop", partial)}
          />
        )),
    formStep("pictures", defaultPicturesValue(), ({ fields, next, back }) => (
          <PicturesStep
            value={fields.pictures}
            onNext={(fields) => { saveDraft({ step: 2, values: fields }); next(fields); }}
            onBack={(fields) => { saveDraft({ step: 0, values: fields }); back(fields); }}
            onDraftChange={(partial) => saveField("pictures", partial)}
          />
        )),
    formStep("seating", defaultSeatingValue(), ({ fields, next, back }) => (
          <SeatingStep
            value={fields.seating}
            onNext={(fields) => { saveDraft({ step: 3, values: fields }); next(fields); }}
            onBack={(fields) => { saveDraft({ step: 1, values: fields }); back(fields); }}
            onDraftChange={(partial) => saveField("seating", partial)}
          />
        )),
    formStep("social", defaultSocialValue(), ({ fields, next, back }) => (
          <SocialStep
            value={fields.social}
            onNext={(fields) => { saveDraft({ step: 4, values: fields }); next(fields); }}
            onBack={(fields) => { saveDraft({ step: 2, values: fields }); back(fields); }}
            onDraftChange={(partial) => saveField("social", partial)}
          />
        )),
    formStep("hours", defaultHoursValue(), ({ fields, next, back }) => (
          <HoursStep
            value={fields.hours}
            onNext={(fields) => { saveDraft({ step: 5, values: fields }); next(fields); }}
            onBack={(fields) => { saveDraft({ step: 3, values: fields }); back(fields); }}
            onDraftChange={(partial) => saveField("hours", partial)}
          />
        )),
    formStep("event", defaultEventValue(), ({ fields, next, back }) => (
          <EventStep
            key="event-step-6"
            current={6}
            title="Event"
            hint="Share an event your shop runs or plans to run — e.g. a tournament, launch night, or organised play session."
            toggleLabel="I have an event to share"
            value={fields.event}
            onNext={(fields) => { saveDraft({ step: 6, values: fields }); next(fields); }}
            onBack={(fields) => { saveDraft({ step: 4, values: fields }); back(fields); }}
            onDraftChange={(partial) => saveField("event", partial)}
          />
        )),
    formStep("notableEvent", defaultEventValue(), ({ fields, next, back }) => (
          <EventStep
            key="event-step-7"
            current={7}
            title="Notable event"
            hint="A standout event your shop has hosted or is preparing — one KC Games should know about."
            toggleLabel="I have a notable event to share"
            value={fields.notableEvent}
            onNext={(fields) => { const answer = { notableEvent: fields.event }; saveDraft({ step: 7, values: answer }); next(answer); }}
            onBack={(fields) => { const answer = { notableEvent: fields.event }; saveDraft({ step: 5, values: answer }); back(answer); }}
            onDraftChange={(partial) => saveField("notableEvent", partial)}
          />
        )),
    formStep("learnToPlay", defaultEventValue(), ({ fields, next, back }) => (
          <EventStep
            key="event-step-8"
            current={8}
            title="Learn to play"
            hint="A learn-to-play session where new players can pick up the game with guidance."
            toggleLabel="I have a learn-to-play session to share"
            value={fields.learnToPlay}
            onNext={(fields) => { const answer = { learnToPlay: fields.event }; saveDraft({ step: 8, values: answer }); next(answer); }}
            onBack={(fields) => { const answer = { learnToPlay: fields.event }; saveDraft({ step: 6, values: answer }); back(answer); }}
            onDraftChange={(partial) => saveField("learnToPlay", partial)}
          />
        )),
    formStep("externalEvent", defaultEventValue(), ({ fields, next, back }) => (
          <EventStep
            key="event-step-9"
            current={9}
            title="External event"
            hint="An event outside your shop — e.g. a convention booth, mall activation, or community gathering."
            toggleLabel="I have an external event to share"
            value={fields.externalEvent}
            onNext={(fields) => { const answer = { externalEvent: fields.event }; saveDraft({ step: 9, values: answer }); next(answer); }}
            onBack={(fields) => { const answer = { externalEvent: fields.event }; saveDraft({ step: 7, values: answer }); back(answer); }}
            onDraftChange={(partial) => saveField("externalEvent", partial)}
          />
        )),
    formStep("feedback", defaultFeedbackValue(), ({ fields, next, back }) => (
          <FeedbackStep
            value={fields.feedback}
            onNext={(fields) => { saveDraft({ step: 10, values: fields }); next(fields); }}
            onBack={(fields) => { saveDraft({ step: 8, values: fields }); back(fields); }}
            onDraftChange={(partial) => saveField("feedback", partial)}
          />
        )),
    formStep("personalEvent", defaultEventValue(), ({ fields, next, back }) => (
          <EventStep
            key="event-step-11"
            current={11}
            title="Personal event"
            hint="Any personal event you would like KC Games to know about."
            toggleLabel="I have a personal event to share"
            value={fields.personalEvent}
            onNext={(fields) => { const answer = { personalEvent: fields.event }; saveDraft({ step: 11, values: answer }); next(answer); }}
            onBack={(fields) => { const answer = { personalEvent: fields.event }; saveDraft({ step: 9, values: answer }); back(answer); }}
            onDraftChange={(partial) => saveField("personalEvent", partial)}
          />
        )),
    formStep("otherProducts", "", ({ fields, next, back }) => (
          <OtherProductsStep
            value={fields.otherProducts}
            onNext={(fields) => { saveDraft({ step: 11, values: fields }); next(fields); }}
            onBack={(fields) => { saveDraft({ step: 10, values: fields }); back(fields); }}
            onDraftChange={(value) => saveField("otherProducts", value)}
          />
        )),
    {
      return: (values: SurveyValues) => ({
        shop: values.shop,
        pictures: values.pictures,
        seating: values.seating,
        social: values.social,
        hours: values.hours,
        event: values.event,
        notableEvent: values.notableEvent,
        learnToPlay: values.learnToPlay,
        externalEvent: values.externalEvent,
        feedback: values.feedback,
        personalEvent: values.personalEvent,
        otherProducts: values.otherProducts,
      }),
    },
  ];
}

export default function SurveyForm() {
  const { draft, ready, saveDraft, saveField, clearDraft } = useSurveyDraft();
  const [values, setValues] = useState<SurveyValues | null>(null);

  // Formity hands the accumulated answers back here. They are kept in React
  // state and the tab's session draft only — never submitted or sent anywhere.
  const handleReturn = useCallback<OnReturn<RetailerSurveySchema>>(
    (returned) => {
      setValues(returned);
      saveDraft({ step: 11, values: returned, completed: true });
    },
    [saveDraft],
  );

  // Start over: drop the displayed answers and clear only the survey's own
  // session draft key, so a fresh flow mounts from step 1.
  const handleStartOver = useCallback(() => {
    clearDraft();
    setValues(null);
  }, [clearDraft]);

  const restoredValues = useMemo<SurveyValues | null>(
    () => (draft?.completed ? draftToSurveyValues(draft.values) : null),
    [draft],
  );

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
          <h1 className="mb-2 font-display text-2xl font-bold text-white sm:text-3xl">KC Games Retailer Survey</h1>
          <p className="mb-6 text-sm text-navy-200">A demo simulation of the KC Games retailer survey. Share details about your shop, your events, and your KC Games experience.</p>

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
  saveDraft: (next: {
    step: SurveyStep;
    values: SurveyDraftValues;
    completed?: true;
  }) => void;
  saveField: (field: DraftField, partial: unknown) => void;
  onReturn: OnReturn<RetailerSurveySchema>;
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

  return useFormity<RetailerSurveySchema>({
    flow: flow as unknown as Flow<RetailerSurveySchema>,
    initialState,
    onReturn,
  });
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

function FieldError({ message }: { message: string | null }) {
  return (
    <div className="min-h-[20px] text-xs text-red-300/90">
      {message && (
        <span role="alert" aria-live="polite">
          {message}
        </span>
      )}
    </div>
  );
}

function DemoNotice() {
  return (
    <div className="mb-6 rounded-xl border border-amber-400/30 bg-[rgba(50,42,28,0.6)] p-4 text-xs leading-relaxed text-amber-200/80">
      <strong className="text-amber-100">Demo mode</strong> — This retailer survey is a simulation. Your answers stay in this browser tab only. They are not sent anywhere or saved to any server, and no real submission happens. Progress and unsent inputs are kept in this tab session and reappear if you refresh; closing the tab ends the session.
    </div>
  );
}

const STANDALONE_BY_REGION: { region: string; retailers: typeof STANDALONE_RETAILERS }[] =
  (() => {
    const regions = Array.from(new Set(STANDALONE_RETAILERS.map((row) => row.region))).sort();
    return regions.map((region) => ({
      region,
      retailers: STANDALONE_RETAILERS.filter((row) => row.region === region),
    }));
  })();

function ShopStep({
  value,
  onNext,
  onDraftChange,
}: {
  value: ShopValue;
  onNext: (fields: { shop: ShopValue }) => void;
  onDraftChange: (partial: Partial<ShopValue>) => void;
}) {
  const [shop, setShop] = useState<ShopValue>(value);
  const [error, setError] = useState<string | null>(null);

  const selectedChain = shop.selection.startsWith("chain:")
    ? CHAIN_GROUPS.find(
        (group) => group.slug === shop.selection.slice("chain:".length),
      ) ?? null
    : null;

  function handleSelectionChange(selection: string) {
    setShop({ selection, branchId: 0 });
    onDraftChange({ selection, branchId: 0 });
    setError(null);
  }

  function handleBranchChange(branchId: number) {
    setShop((current) => ({ ...current, branchId }));
    onDraftChange({ branchId });
    setError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!shop.selection) {
      setError("Please choose your shop.");
      return;
    }
    if (selectedChain && !shop.branchId) {
      setError(`Please choose the branch for ${selectedChain.label}.`);
      return;
    }
    if (!resolveShop(shop)) {
      setError("Please choose a valid KC Games retailer and branch from the list.");
      return;
    }
    setError(null);
    onNext({ shop });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader current={1} />
      <div className="mb-4 rounded-xl border border-amber-400/30 bg-[rgba(50,42,28,0.6)] p-4 text-xs leading-relaxed text-amber-200/80">
        <strong className="text-amber-100">Demo simulation</strong> — multi-branch chains below are grouped by shop name prefix for this simulation only. The branch grouping is not connected to actual KC Games B2B relationships, and every option comes straight from the public retailer list.
      </div>
      <div className="mb-1">
        <label htmlFor="shop-selection" className={fieldLabelClass}>
          Choose your shop
          <span className="ml-2 text-xs font-normal text-amber-200/80">(required)</span>
        </label>
        <select
          id="shop-selection"
          name="shopSelection"
          value={shop.selection}
          onChange={(event) => handleSelectionChange(event.target.value)}
          className={selectClass}
        >
          <option value="">Select a shop…</option>
          <optgroup label="Multi-branch chains (demo simulation)">
            {CHAIN_GROUPS.map((group) => (
              <option key={group.slug} value={`chain:${group.slug}`}>
                {group.label} — {group.branches.length} branches
              </option>
            ))}
          </optgroup>
          {STANDALONE_BY_REGION.map(({ region, retailers }) => (
            <optgroup key={region} label={region}>
              {retailers.map((retailer) => (
                <option key={retailer.id} value={`retailer:${retailer.id}`}>
                  {retailer.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      {selectedChain && (
        <div className="mb-1 mt-4">
          <label htmlFor="shop-branch" className={fieldLabelClass}>
            Which branch of {selectedChain.label}?
            <span className="ml-2 text-xs font-normal text-amber-200/80">(required)</span>
          </label>
          <select
            id="shop-branch"
            name="shopBranch"
            value={shop.branchId ? String(shop.branchId) : ""}
            onChange={(event) =>
              handleBranchChange(event.target.value ? Number(event.target.value) : 0)
            }
            className={selectClass}
          >
            <option value="">Select a branch…</option>
            {selectedChain.branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branchOptionLabel(branch)}
              </option>
            ))}
          </select>
        </div>
      )}
      <FieldError message={error} />
      <button type="submit" className={nextButtonClass}>
        Next
      </button>
    </form>
  );
}

function PicturePreview({ sample }: { sample: PictureSample | null }) {
  if (!sample) {
    return (
      <div className="flex h-36 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-navy-600 bg-navy-900/40 p-4 text-center">
        <ImageIcon className="h-6 w-6 text-navy-400" aria-hidden />
        <p className="text-xs text-navy-200">
          No picture selected yet. Pick a simulated sample to preview it here.
        </p>
      </div>
    );
  }
  const SampleIcon = sample.icon;
  return (
    <div
      className={`relative flex h-36 items-center justify-center overflow-hidden rounded-xl border border-navy-700 bg-gradient-to-br ${sample.gradient} p-4`}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="relative flex flex-col items-center gap-1.5 text-center">
        <SampleIcon className="h-8 w-8 text-white/90" aria-hidden />
        <span className="font-display text-sm font-semibold text-white">
          {sample.label}
        </span>
        <span className="max-w-[280px] text-[10px] leading-snug text-white/75">
          {sample.description}
        </span>
      </div>
    </div>
  );
}

function PictureSelector({
  id,
  label,
  samples,
  selectedId,
  onChange,
}: {
  id: string;
  label: string;
  samples: PictureSample[];
  selectedId: string;
  onChange: (sampleId: string) => void;
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
        <span className="ml-2 text-xs font-normal text-silver-400">(optional)</span>
      </label>
      <select
        id={id}
        value={selectedId}
        onChange={(event) => onChange(event.target.value)}
        className={selectClass}
      >
        <option value="">No sample selected</option>
        {samples.map((sample) => (
          <option key={sample.id} value={sample.id}>
            {sample.label}
          </option>
        ))}
      </select>
      <div className="mt-3">
        <PicturePreview sample={findPictureSample(selectedId, samples)} />
      </div>
    </div>
  );
}

function PicturesStep({
  value,
  onNext,
  onBack,
  onDraftChange,
}: {
  value: PicturesValue;
  onNext: (fields: { pictures: PicturesValue }) => void;
  onBack: (fields: { pictures: PicturesValue }) => void;
  onDraftChange: (partial: Partial<PicturesValue>) => void;
}) {
  const [pictures, setPictures] = useState<PicturesValue>(value);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onNext({ pictures });
      }}
      noValidate
    >
      <StepHeader current={2} onBack={() => onBack({ pictures })} />
      <div className="mb-4 rounded-xl border border-amber-400/30 bg-[rgba(50,42,28,0.6)] p-4 text-xs leading-relaxed text-amber-200/80">
        <strong className="text-amber-100">Simulated samples only</strong> — this demo does not upload photos. Choose from the sample pictures to see how shop photos would be previewed.
      </div>
      <PictureSelector
        id="retail-area-picture"
        label="Retail area picture"
        samples={RETAIL_AREA_SAMPLES}
        selectedId={pictures.retailArea}
        onChange={(sampleId) => {
          setPictures((current) => ({ ...current, retailArea: sampleId }));
          onDraftChange({ retailArea: sampleId });
        }}
      />
      <PictureSelector
        id="play-area-picture"
        label="Play area picture"
        samples={PLAY_AREA_SAMPLES}
        selectedId={pictures.playArea}
        onChange={(sampleId) => {
          setPictures((current) => ({ ...current, playArea: sampleId }));
          onDraftChange({ playArea: sampleId });
        }}
      />
      <button type="submit" className={nextButtonClass}>
        Next
      </button>
    </form>
  );
}

function parseSeatingCount(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  if (!/^\d+$/.test(trimmed)) return null;
  const parsed = Number(trimmed);
  if (parsed > SEATING_MAX) return null;
  return parsed;
}

function SeatingStep({
  value,
  onNext,
  onBack,
  onDraftChange,
}: {
  value: SeatingValue;
  onNext: (fields: { seating: SeatingValue }) => void;
  onBack: (fields: { seating: SeatingValue }) => void;
  onDraftChange: (partial: Partial<SeatingValue>) => void;
}) {
  const [tables, setTables] = useState(value.tables === null ? "" : String(value.tables));
  const [chairs, setChairs] = useState(value.chairs === null ? "" : String(value.chairs));
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedTables = parseSeatingCount(tables);
    const parsedChairs = parseSeatingCount(chairs);
    if (parsedTables === null) {
      setError("Please enter the number of tables (a whole number of 0 or more, up to 99999).");
      return;
    }
    if (parsedChairs === null) {
      setError("Please enter the number of chairs (a whole number of 0 or more, up to 99999).");
      return;
    }
    setError(null);
    onNext({ seating: { tables: parsedTables, chairs: parsedChairs } });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader current={3} onBack={() => onBack({ seating: { tables: parseSeatingCount(tables), chairs: parseSeatingCount(chairs) } })} />
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="seating-tables" className={fieldLabelClass}>
            Tables
            <span className="ml-2 text-xs font-normal text-amber-200/80">(required)</span>
          </label>
          <input
            id="seating-tables"
            name="seatingTables"
            type="number"
            min={0}
            max={SEATING_MAX}
            step={1}
            value={tables}
            onChange={(event) => {
              setTables(event.target.value);
              onDraftChange({ tables: parseSeatingCount(event.target.value) });
            }}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="seating-chairs" className={fieldLabelClass}>
            Chairs
            <span className="ml-2 text-xs font-normal text-amber-200/80">(required)</span>
          </label>
          <input
            id="seating-chairs"
            name="seatingChairs"
            type="number"
            min={0}
            max={SEATING_MAX}
            step={1}
            value={chairs}
            onChange={(event) => {
              setChairs(event.target.value);
              onDraftChange({ chairs: parseSeatingCount(event.target.value) });
            }}
            className={inputClass}
          />
        </div>
      </div>
      <p className="mb-2 text-xs text-navy-200">
        Sitting capacity counts are simulated answers — whole numbers of 0 or more.
      </p>
      <FieldError message={error} />
      <button type="submit" className={nextButtonClass}>
        Next
      </button>
    </form>
  );
}

function SocialStep({
  value,
  onNext,
  onBack,
  onDraftChange,
}: {
  value: SocialValue;
  onNext: (fields: { social: SocialValue }) => void;
  onBack: (fields: { social: SocialValue }) => void;
  onDraftChange: (partial: Partial<SocialValue>) => void;
}) {
  const [social, setSocial] = useState<SocialValue>(value);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onNext({
          social: {
            instagram: social.instagram.trim(),
            facebook: social.facebook.trim(),
            tiktok: social.tiktok.trim(),
          },
        });
      }}
      noValidate
    >
      <StepHeader
        current={4}
        onBack={() =>
          onBack({
            social: {
              instagram: social.instagram.trim(),
              facebook: social.facebook.trim(),
              tiktok: social.tiktok.trim(),
            },
          })
        }
      />
      <div className="mb-4 space-y-4">
        {(
          [
            ["instagram", "Instagram", "e.g. @yourshop"],
            ["facebook", "Facebook", "e.g. yourshop page or profile"],
            ["tiktok", "TikTok", "e.g. @yourshop"],
          ] as const
        ).map(([key, label, placeholder]) => (
          <div key={key}>
            <label htmlFor={`social-${key}`} className={fieldLabelClass}>
              {label}
              <span className="ml-2 text-xs font-normal text-silver-400">(optional)</span>
            </label>
            <input
              id={`social-${key}`}
              type="text"
              maxLength={300}
              placeholder={placeholder}
              value={social[key]}
              onChange={(event) => {
                const next = event.target.value;
                setSocial((current) => ({ ...current, [key]: next }));
                onDraftChange({ [key]: next });
              }}
              className={inputClass}
            />
          </div>
        ))}
      </div>
      <button type="submit" className={nextButtonClass}>
        Next
      </button>
    </form>
  );
}

function HoursStep({
  value,
  onNext,
  onBack,
  onDraftChange,
}: {
  value: HoursValue;
  onNext: (fields: { hours: HoursValue }) => void;
  onBack: (fields: { hours: HoursValue }) => void;
  onDraftChange: (partial: Partial<HoursValue>) => void;
}) {
  const [hours, setHours] = useState<HoursValue>(value);
  const [error, setError] = useState<string | null>(null);

  function updateDay(day: DayKey, patch: Partial<HoursValue[DayKey]>) {
    setHours((current) => ({ ...current, [day]: { ...current[day], ...patch } }));
    onDraftChange({ [day]: { ...hours[day], ...patch } });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    for (const day of DAY_KEYS) {
      const entry = hours[day];
      if (!entry.closed && (entry.open === "" || entry.close === "")) {
        setError(
          `Please enter the opening and closing times for ${DAY_LABELS[day]}, or mark it as closed.`,
        );
        return;
      }
    }
    setError(null);
    onNext({ hours });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader current={5} onBack={() => onBack({ hours })} />
      <p className="mb-4 text-xs text-navy-200">
        Set your weekly operation hours. Open days need both an opening and a closing time; toggle a day as closed to skip it.
      </p>
      <div className="space-y-3">
        {DAY_KEYS.map((day) => {
          const entry = hours[day];
          return (
            <div
              key={day}
              className="grid items-center gap-3 rounded-xl border border-navy-700/60 bg-navy-900/40 p-3 sm:grid-cols-[7rem_1fr_1fr]"
            >
              <span className="font-display text-sm font-semibold text-white">
                {DAY_LABELS[day]}
              </span>
              <div className="flex items-center gap-3">
                <input
                  id={`hours-${day}-closed`}
                  type="checkbox"
                  checked={entry.closed}
                  onChange={(event) =>
                    updateDay(day, event.target.checked ? { closed: true, open: "", close: "" } : { closed: false })
                  }
                  className="h-4 w-4 rounded border-navy-600 bg-navy-900 text-amber-400 focus:ring-amber-400/60"
                  aria-label={`${DAY_LABELS[day]} closed`}
                />
                <label htmlFor={`hours-${day}-closed`} className="text-xs font-semibold text-silver-300">
                  Closed
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id={`hours-${day}-open`}
                  type="time"
                  value={entry.open}
                  disabled={entry.closed}
                  onChange={(event) => updateDay(day, { open: event.target.value })}
                  className={`${inputClass} px-2 py-2 text-sm disabled:opacity-40`}
                  aria-label={`${DAY_LABELS[day]} opening time`}
                />
                <input
                  id={`hours-${day}-close`}
                  type="time"
                  value={entry.close}
                  disabled={entry.closed}
                  onChange={(event) => updateDay(day, { close: event.target.value })}
                  className={`${inputClass} px-2 py-2 text-sm disabled:opacity-40`}
                  aria-label={`${DAY_LABELS[day]} closing time`}
                />
              </div>
            </div>
          );
        })}
      </div>
      <FieldError message={error} />
      <button type="submit" className={nextButtonClass}>
        Next
      </button>
    </form>
  );
}

function EventStep({
  current,
  title,
  hint,
  toggleLabel,
  value,
  onNext,
  onBack,
  onDraftChange,
}: {
  current: number;
  title: string;
  hint: string;
  toggleLabel: string;
  value: EventValue;
  onNext: (fields: { event: EventValue }) => void;
  onBack: (fields: { event: EventValue }) => void;
  onDraftChange: (partial: Partial<EventValue>) => void;
}) {
  const [event, setEvent] = useState<EventValue>(value);
  const [errors, setErrors] = useState<{
    date?: string;
    time?: string;
    info?: string;
  }>({});

  function update(patch: Partial<EventValue>) {
    setEvent((current) => ({ ...current, ...patch }));
    onDraftChange(patch);
  }

  function handleSubmit(submitted: FormEvent<HTMLFormElement>) {
    submitted.preventDefault();
    if (!event.enabled) {
      setErrors({});
      onNext({ event: { enabled: false, date: "", time: "", info: "" } });
      return;
    }
    const nextErrors: typeof errors = {};
    if (!event.date) nextErrors.date = "Please enter the date.";
    if (!event.time) nextErrors.time = "Please enter the time.";
    if (!event.info.trim()) nextErrors.info = "Please describe the event.";
    if (nextErrors.date || nextErrors.time || nextErrors.info) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    onNext({ event: { ...event, info: event.info.trim() } });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader current={current} onBack={() => onBack({ event })} />
      <div className="mb-4">
        <span className={fieldLabelClass}>{title}</span>
        <p className="text-xs text-navy-200">{hint}</p>
      </div>
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-navy-700/60 bg-navy-900/40 p-3">
        <input
          id="event-enabled"
          type="checkbox"
          checked={event.enabled}
          onChange={(change) =>
            update(
              change.target.checked
                ? { enabled: true }
                : { enabled: false, date: "", time: "", info: "" },
            )
          }
          className="h-4 w-4 rounded border-navy-600 bg-navy-900 text-amber-400 focus:ring-amber-400/60"
          aria-label={toggleLabel}
        />
        <label htmlFor="event-enabled" className="text-sm font-semibold text-white">
          {toggleLabel}
        </label>
      </div>
      {event.enabled && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="event-date" className={fieldLabelClass}>
                Date
                <span className="ml-2 text-xs font-normal text-amber-200/80">(required)</span>
              </label>
              <input
                id="event-date"
                type="date"
                value={event.date}
                onChange={(change) => update({ date: change.target.value })}
                className={inputClass}
              />
              <FieldError message={errors.date ?? null} />
            </div>
            <div>
              <label htmlFor="event-time" className={fieldLabelClass}>
                Time
                <span className="ml-2 text-xs font-normal text-amber-200/80">(required)</span>
              </label>
              <input
                id="event-time"
                type="time"
                value={event.time}
                onChange={(change) => update({ time: change.target.value })}
                className={inputClass}
              />
              <FieldError message={errors.time ?? null} />
            </div>
          </div>
          <div>
            <label htmlFor="event-info" className={fieldLabelClass}>
              Event info
              <span className="ml-2 text-xs font-normal text-amber-200/80">(required)</span>
            </label>
            <textarea
              id="event-info"
              rows={3}
              maxLength={2000}
              placeholder="What is happening, and anything players should know…"
              value={event.info}
              onChange={(change) => update({ info: change.target.value })}
              className={`${inputClass} resize-y`}
            />
            <FieldError message={errors.info ?? null} />
          </div>
        </div>
      )}
      <button type="submit" className={nextButtonClass}>
        Next
      </button>
    </form>
  );
}

function FeedbackStep({
  value,
  onNext,
  onBack,
  onDraftChange,
}: {
  value: FeedbackValue;
  onNext: (fields: { feedback: FeedbackValue }) => void;
  onBack: (fields: { feedback: FeedbackValue }) => void;
  onDraftChange: (partial: Partial<FeedbackValue>) => void;
}) {
  const [feedback, setFeedback] = useState<FeedbackValue>(value);

  return (
    <form
      onSubmit={(submit) => {
        submit.preventDefault();
        onNext({
          feedback: { shop: feedback.shop.trim(), retailer: feedback.retailer.trim() },
        });
      }}
      noValidate
    >
      <StepHeader
        current={10}
        onBack={() =>
          onBack({
            feedback: { shop: feedback.shop.trim(), retailer: feedback.retailer.trim() },
          })
        }
      />
      <div className="mb-4 space-y-4">
        <div>
          <label htmlFor="feedback-shop" className={fieldLabelClass}>
            Shop feedback
            <span className="ml-2 text-xs font-normal text-silver-400">(optional)</span>
          </label>
          <textarea
            id="feedback-shop"
            rows={3}
            maxLength={2000}
            placeholder="Anything about your shop you would like to share — layout, staff, plans…"
            value={feedback.shop}
            onChange={(change) => {
              setFeedback((current) => ({ ...current, shop: change.target.value }));
              onDraftChange({ shop: change.target.value });
            }}
            className={`${inputClass} resize-y`}
          />
        </div>
        <div>
          <label htmlFor="feedback-retailer" className={fieldLabelClass}>
            Retailer feedback
            <span className="ml-2 text-xs font-normal text-silver-400">(optional)</span>
          </label>
          <textarea
            id="feedback-retailer"
            rows={3}
            maxLength={2000}
            placeholder="Feedback for the KC Games retailer team — products, support, communications…"
            value={feedback.retailer}
            onChange={(change) => {
              setFeedback((current) => ({ ...current, retailer: change.target.value }));
              onDraftChange({ retailer: change.target.value });
            }}
            className={`${inputClass} resize-y`}
          />
        </div>
      </div>
      <button type="submit" className={nextButtonClass}>
        Next
      </button>
    </form>
  );
}

function OtherProductsStep({
  value,
  onNext,
  onBack,
  onDraftChange,
}: {
  value: string;
  onNext: (fields: { otherProducts: string }) => void;
  onBack: (fields: { otherProducts: string }) => void;
  onDraftChange: (value: string) => void;
}) {
  const [otherProducts, setOtherProducts] = useState(value);

  return (
    <form
      onSubmit={(submit) => {
        submit.preventDefault();
        onNext({ otherProducts: otherProducts.trim() });
      }}
      noValidate
    >
      <StepHeader current={12} onBack={() => onBack({ otherProducts })} />
      <div className="mb-1">
        <label htmlFor="other-products" className={fieldLabelClass}>
          Other products sold
          <span className="ml-2 text-xs font-normal text-silver-400">(optional)</span>
        </label>
        <textarea
          id="other-products"
          rows={4}
          maxLength={2000}
          placeholder="Board games, accessories, collectibles, snacks… anything besides KC Games products."
          value={otherProducts}
          onChange={(change) => {
            setOtherProducts(change.target.value);
            onDraftChange(change.target.value);
          }}
          className={`${inputClass} resize-y`}
        />
      </div>
      <p className="mb-4 text-xs text-navy-200">
        Pressing SUBMIT finishes the simulation — nothing is sent anywhere, and you will see a summary of every answer.
      </p>
      <button type="submit" className={nextButtonClass}>
        SUBMIT
      </button>
    </form>
  );
}

function SummarySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-navy-700/60 bg-navy-900/60 p-4">
      <h3 className="mb-2 font-display text-sm font-bold text-amber-200">
        {title}
      </h3>
      <div className="space-y-1 text-sm text-silver-300">{children}</div>
    </div>
  );
}

function OrNotProvided({ children }: { children?: ReactNode }) {
  if (children === undefined || children === null || children === "") {
    return <p className="text-navy-300">Not provided</p>;
  }
  return <>{children}</>;
}

function eventSummaryLines(event: EventValue) {
  if (!event.enabled) {
    return <p className="text-navy-300">None planned</p>;
  }
  return (
    <p className="text-white">
      {event.date} · {event.time} — {event.info}
    </p>
  );
}

function SurveySummary({
  values,
  onStartOver,
}: {
  values: SurveyValues;
  onStartOver: () => void;
}) {
  const shop = resolveShop(values.shop);
  const socialLines = [
    values.social.instagram && `Instagram: ${values.social.instagram}`,
    values.social.facebook && `Facebook: ${values.social.facebook}`,
    values.social.tiktok && `TikTok: ${values.social.tiktok}`,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-white">
        Simulation complete!
      </h2>
      <p className="text-sm text-navy-200">
        This was a demo submission — nothing was sent to any server. Here is the complete answer summary of your retailer survey simulation. It stays in this tab session only and disappears when you close the tab.
      </p>
      <div className="space-y-3 rounded-xl border border-navy-700 bg-navy-900/40 p-5">
        <SummarySection title="1. Shop">
          {shop ? (
            <>
              <p className="font-semibold text-white">{shop.retailer.name}</p>
              <p>{shop.retailer.address}</p>
              <p>
                Retailer #{shop.retailer.id} · {shop.retailer.region},{" "}
                {shop.retailer.country} · {shop.retailer.storeType}
                {shop.chain
                  ? ` · ${shop.chain.label} branch (demo grouping)`
                  : ""}
              </p>
              {shop.chain && (
                <p className="pt-1 text-[10px] text-amber-200/70">
                  Branch grouping is a demo simulation and is not connected to
                  actual KC Games B2B relationships.
                </p>
              )}
            </>
          ) : (
            <OrNotProvided />
          )}
        </SummarySection>
        <SummarySection title="2. Shop pictures (simulated)">
          <OrNotProvided>
            {values.pictures.retailArea
              ? findPictureSample(values.pictures.retailArea, RETAIL_AREA_SAMPLES)
                  ?.label
              : ""}
          </OrNotProvided>
          <OrNotProvided>
            {values.pictures.playArea
              ? findPictureSample(values.pictures.playArea, PLAY_AREA_SAMPLES)
                  ?.label
              : ""}
          </OrNotProvided>
        </SummarySection>
        <SummarySection title="3. Sitting capacity">
          <p className="text-white">
            {values.seating.tables} tables · {values.seating.chairs} chairs
          </p>
        </SummarySection>
        <SummarySection title="4. Social media">
          {socialLines.length > 0 ? (
            socialLines.map((line) => (
              <p key={line} className="text-white">
                {line}
              </p>
            ))
          ) : (
            <OrNotProvided />
          )}
        </SummarySection>
        <SummarySection title="5. Operation hours">
          {DAY_KEYS.map((day) => (
            <p key={day} className={values.hours[day].closed ? "text-navy-300" : "text-white"}>
              {DAY_LABELS[day]}:{" "}
              {values.hours[day].closed
                ? "Closed"
                : `${values.hours[day].open} – ${values.hours[day].close}`}
            </p>
          ))}
        </SummarySection>
        <SummarySection title="6. Event">
          {eventSummaryLines(values.event)}
        </SummarySection>
        <SummarySection title="7. Notable event">
          {eventSummaryLines(values.notableEvent)}
        </SummarySection>
        <SummarySection title="8. Learn to play">
          {eventSummaryLines(values.learnToPlay)}
        </SummarySection>
        <SummarySection title="9. External event">
          {eventSummaryLines(values.externalEvent)}
        </SummarySection>
        <SummarySection title="10. Feedback">
          <OrNotProvided>
            {values.feedback.shop ? `Shop: ${values.feedback.shop}` : ""}
          </OrNotProvided>
          <OrNotProvided>
            {values.feedback.retailer
              ? `Retailer: ${values.feedback.retailer}`
              : ""}
          </OrNotProvided>
        </SummarySection>
        <SummarySection title="11. Personal event">
          {eventSummaryLines(values.personalEvent)}
        </SummarySection>
        <SummarySection title="12. Other products sold">
          <OrNotProvided>
            {values.otherProducts ? values.otherProducts : ""}
          </OrNotProvided>
        </SummarySection>
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
