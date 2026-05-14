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

const linkedInRefine = (s: string) =>
  /linkedin\.com/i.test(s.trim()) || /^https?:\/\//i.test(s.trim());

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

const soloTeamField = z
  .string()
  .min(1, "Choose one option")
  .refine((s): s is "solo" | "team" => s === "solo" || s === "team");

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
    stage: stageField,
  }),
  z.object({
    recentBuildLink: z.string().min(4, "Share a link").max(2000),
    wantToBuild: z
      .string()
      .min(80, "Write at least 2–3 lines so we understand what you want to build")
      .max(4000),
    unfinishedStory: z.string().min(20, "Tell us a bit more").max(4000),
  }),
  z
    .object({
      commitment: commitmentField,
      soloOrTeam: soloTeamField,
      teammateName: z.string().max(200).optional(),
      teammateLinkedIn: z.string().max(500).optional(),
    })
    .superRefine(teamRefinement),
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
    stage: stageField,
    recentBuildLink: z.string().min(4, "Share a link").max(2000),
    wantToBuild: z
      .string()
      .min(80, "Write at least 2–3 lines so we understand what you want to build")
      .max(4000),
    unfinishedStory: z.string().min(20, "Tell us a bit more").max(4000),
    commitment: commitmentField,
    soloOrTeam: soloTeamField,
    teammateName: z.string().max(200).optional(),
    teammateLinkedIn: z.string().max(500).optional(),
    quitReason: z.string().min(10, "Please share a short answer").max(4000),
    botcheck: z.string().max(0).optional(),
  })
  .superRefine(teamRefinement);

export type ApplicationInput = z.infer<typeof applicationSchema>;

export function stripForStorage(data: ApplicationInput): Omit<ApplicationInput, "botcheck"> {
  const { botcheck: _b, ...rest } = data;
  return rest;
}
