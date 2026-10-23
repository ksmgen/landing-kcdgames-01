"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, EyeOff } from "lucide-react";
import { submitSurvey, type Receipt } from "./submitSurvey";
import type { SurveyImage } from "./surveyImages";
import type { SurveyValues } from "./useSurveyDraft";

/** Credentials go only to the staging API, never to the session draft. */
export default function SubmissionModal({ answers, images = [], onClose, onAccepted }: { answers: SurveyValues; images?: SurveyImage[]; onClose: () => void; onAccepted: (receipt: Receipt) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);

  // Reset visibility each time the modal opens or after an attempt.
  const handleReset = useCallback(() => {
    setShowPassword(false);
  }, []);

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    handleReset();
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [handleReset]);

  const inputClass = "mt-2 w-full rounded-lg border border-navy-700 bg-navy-950 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-amber-400";

  return createPortal(
    <dialog
      ref={dialog}
      aria-labelledby="submission-title"
      aria-describedby="submission-notice"
      aria-modal="true"
      onCancel={(event) => event.preventDefault()}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-md overflow-y-auto rounded-2xl border border-navy-700 bg-navy-900 p-6 text-white shadow-2xl backdrop:bg-black/75 sm:p-8"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="submission-title" className="font-display text-xl font-bold">Ready to submit</h2>
        <button type="button" aria-label="Close submission dialog" disabled={busy} onClick={() => { if (!inFlight.current) onClose(); }} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-navy-700 text-xl hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">×</button>
      </div>
      <p id="submission-notice" className="mb-6 text-sm text-silver-300">
        Submit sends your survey and distributor email/password securely to the livetest API. The backend handles sign-in. Credentials are not saved.
      </p>
      <form aria-busy={busy} onSubmit={async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (inFlight.current) return;
        inFlight.current = true;
        setBusy(true);
        setShowPassword(false);
        setMessage("");
        try {
          const receipt = await submitSurvey(answers, username, password, images);
          setUsername("");
          setPassword("");
          handleReset();
          onAccepted(receipt);
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Not confirmed: retry with the same answers.");
          setPassword("");
          handleReset();
        } finally {
          setUsername("");
          inFlight.current = false;
          setBusy(false);
        }
      }}>
        <label className="mb-4 block font-semibold" htmlFor="submission-username">
          Email
          <input autoFocus required id="submission-username" name="email" type="email" disabled={busy} autoComplete="off" maxLength={254} value={username} onChange={(event) => setUsername(event.target.value)} className={inputClass} />
        </label>
        <div className="mb-4">
          <label className="block font-semibold" htmlFor="submission-password">Password</label>
          <div className="relative mt-2">
            <input required id="submission-password" name="password" disabled={busy} type={showPassword ? "text" : "password"} autoComplete="off" maxLength={1024} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-navy-700 bg-navy-950 px-4 py-3 pr-14 text-white outline-none focus:ring-2 focus:ring-amber-400" aria-describedby="password-hint" />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              disabled={busy}
              aria-pressed={showPassword}
              aria-controls="submission-password"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-silver-300 hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 disabled:opacity-40"
            >
              {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
          <p id="password-hint" className="mt-1 text-xs text-silver-400">Passwords are case-sensitive.</p>
        </div>
        {message && <p role="status" className="mb-4 rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-sm text-amber-200">{message}</p>}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" disabled={busy} onClick={() => { if (!inFlight.current) onClose(); }} className="min-h-12 rounded-lg border border-silver-400/40 px-5 py-3 font-semibold hover:bg-navy-800">Cancel</button>
          <button type="submit" disabled={busy} className="min-h-12 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-300 px-6 py-3 font-bold text-navy-950 hover:brightness-110">{busy ? "Sending…" : "Submit"}</button>
        </div>
      </form>
    </dialog>,
    document.body,
  );
}
