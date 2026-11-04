import { z } from "zod";

export const STAGE_VALUES = [
  "employed_thinking",
  "pre_revenue",
  "early_customers",
  "quit_not_started",
] as const;

export const STAGE_LABELS: Record<(typeof STAGE_VALUES)[number], string> = {
  employed_thinking: "Still employed, thinking about making the jump",
  pre_revenue: "Building but pre-revenue",
  early_customers: "Building with early customers",
  quit_not_started: "Quit, haven't started building yet",
};

export const COMMITMENT_VALUES = [
  "fully_committed",
  "try_unsure",
  "exploring",
] as const;

export const COMMITMENT_LABELS: Record<(typeof COMMITMENT_VALUES)[number], string> = {
  fully_committed: "Yes — fully committed to building and shipping",
  try_unsure: "I'll try, but not fully sure",
  exploring: "Just exploring",
};

export const GOAL_VALUES = [
  "revenue",
  "first_users",
  "startup",
  "explore",
  "other",
] as const;

export const GOAL_LABELS: Record<(typeof GOAL_VALUES)[number], string> = {
  revenue: "Generating revenue",
  first_users: "Getting my first users",
  startup: "Building a startup",
  explore: "Exploring my interests",
  other: "Something else",
};

const linkedInRefine = (s: string) =>
  /linkedin\.com/i.test(s.trim()) || /^https?:\/\//i.test(s.trim());

/** WhatsApp number: digits with optional +, spaces, dashes or brackets; 10 to 15 digits with country code. */
const whatsappField = z
  .string()
  .trim()
  .min(1, "Add your WhatsApp number")
  .max(30)
  .refine((s) => /^\+?[\d\s()-]+$/.test(s) && /^\d{10,15}$/.test(s.replace(/\D/g, "")), {
    message: "Enter a valid WhatsApp number with country code, e.g. +91 98765 43210",
  });

const stageField = z
  .string()
  .min(1, "Choose one option")
  .refine((s): s is (typeof STAGE_VALUES)[number] =>
    (STAGE_VALUES as readonly string[]).includes(s),
  );

const commitmentField = z
  .string()
  .min(1, "Choose one option")
  .refine((s): s is (typeof COMMITMENT_VALUES)[number] =>
    (COMMITMENT_VALUES as readonly string[]).includes(s),
  );

const goalField = z
  .string()
  .min(1, "Choose one option")
  .refine((s): s is (typeof GOAL_VALUES)[number] => (GOAL_VALUES as readonly string[]).includes(s));

/** A live link: with or without https://, e.g. myapp.vercel.app. */
const liveLinkField = z
  .string()
  .trim()
  .min(1, "Share a live link")
  .max(2000)
  .refine((s) => /^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i.test(s), {
    message: "Add a live link, e.g. https://yourproject.vercel.app",
  });

const soloTeamField = z
  .string()
  .min(1, "Choose one option")
  .refine((s): s is "solo" | "team" => s === "solo" || s === "team");

function goalRefinement(data: { goal: string; goalOther?: string | undefined }, ctx: z.RefinementCtx) {
  if (data.goal === "other" && !data.goalOther?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["goalOther"],
      message: "Tell us your goal",
    });
  }
}

function teamRefinement(data: {
  soloOrTeam: string;
  teammateName?: string | undefined;
  teammateLinkedIn?: string | undefined;
}, ctx: z.RefinementCtx) {
  if (data.soloOrTeam !== "team") return;
  if (!data.teammateName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["teammateName"],
      message: "Teammate name required",
    });
  }
  if (!data.teammateLinkedIn?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["teammateLinkedIn"],
      message: "Teammate LinkedIn required",
    });
  } else if (
    !linkedInRefine(data.teammateLinkedIn)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["teammateLinkedIn"],
      message: "Add a LinkedIn URL",
    });
  }
}

export const applicationStepSchemas = [
  z.object({
    fullName: z.string().min(2, "Please enter your name").max(200),
    linkedIn: z
      .string()
      .min(4)
      .max(500)
      .refine(linkedInRefine, { message: "Add a LinkedIn profile URL" }),
    whatsapp: whatsappField,
    stage: stageField,
  }),
  z.object({
    recentBuildLink: z.string().min(4, "Share a link").max(2000),
    wantToBuild: z
      .string()
      .min(80, "Write at least 2–3 lines so we understand what you want to build")
      .max(4000),
    unfinishedStory: z.string().min(20, "Tell us a bit more").max(4000),
    personalProject: z.string().trim().min(20, "Tell us a bit about it").max(4000),
    personalProjectLink: liveLinkField,
  }),
  z
    .object({
      goal: goalField,
      goalOther: z.string().max(500).optional(),
      commitment: commitmentField,
      soloOrTeam: soloTeamField,
      teammateName: z.string().max(200).optional(),
      teammateLinkedIn: z.string().max(500).optional(),
    })
    .superRefine((data, ctx) => {
      goalRefinement(data, ctx);
      teamRefinement(data, ctx);
    }),
  z.object({
    quitReason: z.string().min(10, "Please share a short answer").max(4000),
    botcheck: z.string().max(0).optional(),
  }),
] as const;

export const applicationSchema = z
  .object({
    fullName: z.string().min(2, "Please enter your name").max(200),
    linkedIn: z
      .string()
      .min(4)
      .max(500)
      .refine(linkedInRefine, { message: "Add a LinkedIn profile URL" }),
    whatsapp: whatsappField,
    stage: stageField,
    recentBuildLink: z.string().min(4, "Share a link").max(2000),
    wantToBuild: z
      .string()
      .min(80, "Write at least 2–3 lines so we understand what you want to build")
      .max(4000),
    unfinishedStory: z.string().min(20, "Tell us a bit more").max(4000),
    personalProject: z.string().trim().min(20, "Tell us a bit about it").max(4000),
    personalProjectLink: liveLinkField,
    goal: goalField,
    goalOther: z.string().max(500).optional(),
    commitment: commitmentField,
    soloOrTeam: soloTeamField,
    teammateName: z.string().max(200).optional(),
    teammateLinkedIn: z.string().max(500).optional(),
    quitReason: z.string().min(10, "Please share a short answer").max(4000),
    botcheck: z.string().max(0).optional(),
  })
  .superRefine((data, ctx) => {
    goalRefinement(data, ctx);
    teamRefinement(data, ctx);
  });

export type ApplicationInput = z.infer<typeof applicationSchema>;

/** Plain-language names for each answer, used in error messages. */
export const FIELD_LABELS: Record<string, string> = {
  fullName: "Full name",
  linkedIn: "LinkedIn profile",
  whatsapp: "WhatsApp number",
  stage: "Current stage",
  recentBuildLink: "What you built recently",
  wantToBuild: "What you want to build",
  unfinishedStory: "Something you never finished",
  personalProject: "Personal project from the last 6 months",
  personalProjectLink: "Live link to that project",
  goal: "Goal for joining",
  goalOther: "Your goal",
  commitment: "Commitment to all 3 Sundays",
  soloOrTeam: "Solo or team",
  teammateName: "Teammate name",
  teammateLinkedIn: "Teammate LinkedIn",
  quitReason: "What would make you quit",
};

/** Which form step (0-based) each answer lives on. */
export const FIELD_STEP: Record<string, number> = {
  fullName: 0,
  linkedIn: 0,
  whatsapp: 0,
  stage: 0,
  recentBuildLink: 1,
  wantToBuild: 1,
  unfinishedStory: 1,
  personalProject: 1,
  personalProjectLink: 1,
  goal: 2,
  goalOther: 2,
  commitment: 2,
  soloOrTeam: 2,
  teammateName: 2,
  teammateLinkedIn: 2,
  quitReason: 3,
};

export function stripForStorage(data: ApplicationInput): Omit<ApplicationInput, "botcheck"> {
  const { botcheck: _b, ...rest } = data;
  return rest;
}
