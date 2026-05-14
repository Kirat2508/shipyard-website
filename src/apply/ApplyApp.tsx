import { useState } from "react";
import type { FieldPath } from "react-hook-form";
import { useForm } from "react-hook-form";

import {
  applicationSchema,
  applicationStepSchemas,
  COMMITMENT_LABELS,
  COMMITMENT_VALUES,
  STAGE_LABELS,
  STAGE_VALUES,
  stripForStorage,
  type ApplicationInput,
} from "../../lib/applicationSchema";

const STEPS = [
  { prelude: "The start", title: "Tell us who you are", sub: "Basics we need to review your application." },
  { prelude: "The build", title: "What you’ve been making", sub: "Links and short written answers." },
  {
    prelude: "The commitment",
    title: "Sundays & how you work",
    sub: "Project Shipyard is three focused Sundays — we need people who intend to ship.",
  },
  { prelude: "The line", title: "One last honest question", sub: "Helps us understand fit." },
];

function applyZodIssuesToForm<T extends Record<string, unknown>>(
  issues: { path: (string | number)[]; message: string }[],
  setError: (name: FieldPath<T>, err: { message: string }) => void,
) {
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string") {
      setError(key as FieldPath<T>, { message: issue.message });
    }
  }
}

export function ApplyApp() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<ApplicationInput>({
    defaultValues: {
      fullName: "",
      linkedIn: "",
      stage: "",
      recentBuildLink: "",
      wantToBuild: "",
      unfinishedStory: "",
      commitment: "",
      soloOrTeam: "",
      teammateName: "",
      teammateLinkedIn: "",
      quitReason: "",
      botcheck: "",
    },
  });

  const { register, watch, setError, clearErrors, handleSubmit, getValues } = form;
  const soloOrTeam = watch("soloOrTeam");

  async function goNext() {
    clearErrors();
    setSubmitError(null);
    const values = getValues();
    const schema = applicationStepSchemas[step];
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      applyZodIssuesToForm(parsed.error.issues, setError);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    clearErrors();
    setSubmitError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  const onFinalSubmit = handleSubmit(async (data) => {
    clearErrors();
    setSubmitError(null);
    const full = applicationSchema.safeParse(data);
    if (!full.success) {
      applyZodIssuesToForm(full.error.issues, setError);
      return;
    }
    setSaving(true);
    try {
      const payload = stripForStorage(full.data);
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        detail?: string;
        hint?: string;
      };
      if (!res.ok) {
        const parts = [body.error, body.detail, body.hint].filter(
          (s): s is string => typeof s === "string" && s.length > 0,
        );
        setSubmitError(
          parts.length > 0 ? parts.join(" ") : `Could not submit (${res.status}). Try again later.`,
        );
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  });

  if (submitted) {
    return (
      <div className="apply apply--done">
        <header className="apply__header px-page">
          <a href="/" className="apply__brand">
            Project <em>Shipyard</em>
          </a>
          <a href="/" className="apply__exit">
            Back home
          </a>
        </header>
        <div className="apply__done-inner px-page">
          <p className="apply__prelude">Received</p>
          <h1 className="apply__title">Thank you — we have your application.</h1>
          <p className="apply__lede body-lg">
            We read every submission. If it looks like a fit, you’ll hear from us with next steps.
          </p>
          <a href="/" className="btn-primary apply__done-btn">
            <span className="btn__label btn__label--default">Return home</span>
            <span className="btn__label btn__label--hover">Home</span>
            <span className="material-symbols-outlined btn__icon btn__icon--default" aria-hidden>
              arrow_back
            </span>
            <span className="material-symbols-outlined btn__icon btn__icon--hover" aria-hidden>
              home
            </span>
          </a>
        </div>
      </div>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="apply">
      <header className="apply__header px-page">
        <a href="/" className="apply__brand">
          Project <em>Shipyard</em>
        </a>
        <nav className="apply__nav" aria-label="Apply navigation">
          <a href="/" className="apply__exit">
            Exit
          </a>
        </nav>
      </header>

      <div className="apply__progress-wrap px-page" aria-hidden>
        <div className="apply__progress-track">
          <div className="apply__progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="apply__step-meta">
          Step {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
        </p>
      </div>

      <form className="apply__form px-page" onSubmit={step === STEPS.length - 1 ? onFinalSubmit : (e) => e.preventDefault()}>
        <div className="apply__form-inner max-w-content">
          <p className="apply__prelude">{STEPS[step].prelude}</p>
          <h1 className="apply__title">{STEPS[step].title}</h1>
          <p className="apply__sub body-md">{STEPS[step].sub}</p>

          {step === 0 && (
            <div className="apply__fields">
              <label className="apply__field">
                <span className="apply__question">Full name</span>
                <input type="text" autoComplete="name" className="apply__input" {...register("fullName")} />
                {form.formState.errors.fullName && (
                  <span className="apply__err">{form.formState.errors.fullName.message}</span>
                )}
              </label>
              <label className="apply__field">
                <span className="apply__question">LinkedIn profile</span>
                <input
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="https://linkedin.com/in/…"
                  className="apply__input"
                  {...register("linkedIn")}
                />
                {form.formState.errors.linkedIn && (
                  <span className="apply__err">{form.formState.errors.linkedIn.message}</span>
                )}
              </label>
              <fieldset className="apply__fieldset">
                <legend className="apply__question">What stage are you at right now?</legend>
                <div className="apply__pills">
                  {STAGE_VALUES.map((val) => (
                    <label key={val} className="apply__pill">
                      <input type="radio" value={val} className="u-sr-only" {...register("stage")} />
                      <span>{STAGE_LABELS[val]}</span>
                    </label>
                  ))}
                </div>
                {form.formState.errors.stage && (
                  <span className="apply__err">{form.formState.errors.stage.message}</span>
                )}
              </fieldset>
            </div>
          )}

          {step === 1 && (
            <div className="apply__fields">
              <label className="apply__field">
                <span className="apply__question">What have you built recently?</span>
                <span className="apply__hint body-md">GitHub / product / demo / anything</span>
                <input
                  type="text"
                  className="apply__input"
                  placeholder="https://…"
                  {...register("recentBuildLink")}
                />
                {form.formState.errors.recentBuildLink && (
                  <span className="apply__err">{form.formState.errors.recentBuildLink.message}</span>
                )}
              </label>
              <label className="apply__field apply__field--block">
                <span className="apply__question">What do you want to build during Project Shipyard?</span>
                <span className="apply__hint body-md">
                  2–3 lines minimum. A direction is enough — it doesn’t need to be fully locked.
                </span>
                <textarea className="apply__textarea" rows={5} {...register("wantToBuild")} />
                {form.formState.errors.wantToBuild && (
                  <span className="apply__err">{form.formState.errors.wantToBuild.message}</span>
                )}
              </label>
              <label className="apply__field apply__field--block">
                <span className="apply__question">
                  What is something you started building but never finished? What stopped you?
                </span>
                <textarea className="apply__textarea" rows={5} {...register("unfinishedStory")} />
                {form.formState.errors.unfinishedStory && (
                  <span className="apply__err">{form.formState.errors.unfinishedStory.message}</span>
                )}
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="apply__fields">
              <fieldset className="apply__fieldset">
                <legend className="apply__question">
                  Are you willing to commit to all 3 Sundays and ship by the end?
                </legend>
                <div className="apply__pills apply__pills--tall">
                  {COMMITMENT_VALUES.map((val) => (
                    <label key={val} className="apply__pill">
                      <input type="radio" value={val} className="u-sr-only" {...register("commitment")} />
                      <span>{COMMITMENT_LABELS[val]}</span>
                    </label>
                  ))}
                </div>
                {form.formState.errors.commitment && (
                  <span className="apply__err">{form.formState.errors.commitment.message}</span>
                )}
              </fieldset>
              <fieldset className="apply__fieldset">
                <legend className="apply__question">Are you planning to build solo or with someone?</legend>
                <div className="apply__pills">
                  <label className="apply__pill">
                    <input type="radio" value="solo" className="u-sr-only" {...register("soloOrTeam")} />
                    <span>Solo</span>
                  </label>
                  <label className="apply__pill">
                    <input type="radio" value="team" className="u-sr-only" {...register("soloOrTeam")} />
                    <span>In a team</span>
                  </label>
                </div>
                {form.formState.errors.soloOrTeam && (
                  <span className="apply__err">{form.formState.errors.soloOrTeam.message}</span>
                )}
              </fieldset>
              {soloOrTeam === "team" && (
                <div className="apply__team reveal-in">
                  <label className="apply__field">
                    <span className="apply__question">Teammate full name</span>
                    <input type="text" className="apply__input" {...register("teammateName")} />
                    {form.formState.errors.teammateName && (
                      <span className="apply__err">{form.formState.errors.teammateName.message}</span>
                    )}
                  </label>
                  <label className="apply__field">
                    <span className="apply__question">Teammate LinkedIn</span>
                    <input
                      type="url"
                      className="apply__input"
                      placeholder="https://linkedin.com/in/…"
                      {...register("teammateLinkedIn")}
                    />
                    {form.formState.errors.teammateLinkedIn && (
                      <span className="apply__err">{form.formState.errors.teammateLinkedIn.message}</span>
                    )}
                  </label>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="apply__fields">
              <label className="apply__field apply__field--block">
                <span className="apply__question">What would make you quit Shipyard halfway through?</span>
                <textarea className="apply__textarea" rows={5} {...register("quitReason")} />
                {form.formState.errors.quitReason && (
                  <span className="apply__err">{form.formState.errors.quitReason.message}</span>
                )}
              </label>
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="apply__honeypot"
                {...register("botcheck")}
              />
            </div>
          )}

          {submitError && <p className="apply__err apply__err--banner">{submitError}</p>}

          <div className="apply__actions">
            {step > 0 && (
              <button type="button" className="apply__btn-secondary body-md" onClick={goBack}>
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" className="btn-primary apply__next" onClick={goNext}>
                <span className="btn__label">Next step</span>
                <span className="material-symbols-outlined btn__icon" aria-hidden>
                  arrow_forward
                </span>
              </button>
            ) : (
              <button type="submit" className="btn-primary apply__submit" disabled={saving}>
                <span className="btn__label">{saving ? "Sending…" : "Submit application"}</span>
                {!saving && (
                  <span className="material-symbols-outlined btn__icon" aria-hidden>
                    send
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
