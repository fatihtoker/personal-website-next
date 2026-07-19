import { z } from "zod";

export const deviceSchema = z.enum(["desktop", "tablet", "mobile"]);
export const controlSchema = z.enum(["keyboard", "mouse", "touch", "gamepad"]);
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const baseProjectSchema = z.object({
  schemaVersion: z.literal(1),
  slug: slugSchema,
  title: z.string(),
  cardSummary: z.string(),
  description: z.string(),
  category: z.enum(["game", "app"]),
  tags: z.array(z.string()),
  coverSrc: z.string().refine(val => val.startsWith("/")),
  coverAlt: z.string(),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  featured: z.boolean(),
  sortOrder: z.number(),
  seo: seoSchema,
});

export const playableGameSchema = baseProjectSchema.extend({
  kind: z.literal("playable-game"),
  playablePath: z.string(),
  supportedDevices: z.array(deviceSchema).min(1),
  controls: z.array(controlSchema).min(1),
  recommendedAspectRatio: z.string(),
  minimumViewport: z.object({
    width: z.number(),
    height: z.number(),
  }),
  source: z.object({
    repository: z.string().url(),
    commit: z.string().regex(/^[0-9a-f]{40}$/i),
  }),
});

export const showcaseSchema = baseProjectSchema.extend({
  kind: z.literal("showcase"),
  detailHref: z.string().refine(val => val.startsWith("/")).optional(),
});

export const projectSchema = z.discriminatedUnion("kind", [
  playableGameSchema,
  showcaseSchema,
]);

export const projectManifestSchema = z.array(projectSchema).superRefine((items, ctx) => {
  const seen = new Set<string>();
  items.forEach((item, index) => {
    if (seen.has(item.slug)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [index, "slug"],
        message: `Duplicate slug: ${item.slug}`,
      });
    }
    seen.add(item.slug);
  });
});

export type Project = z.infer<typeof projectSchema>;
export type PlayableGame = Extract<Project, { kind: "playable-game" }>;
export type ShowcaseProject = Extract<Project, { kind: "showcase" }>;
