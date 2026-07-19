# Personal Portfolio and Game Publishing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Fatih Toker's game-centered personal portfolio and a safe one-click pipeline that publishes validated browser-game bundles from `idea-generator` into previewable pull requests on the Vercel-hosted site.

**Architecture:** The Next.js repository renders a manifest-driven Projects catalog and isolates each built game in a dedicated iframe route under `/playables/<slug>/`. The source repository owns game code, publication metadata, covers, builds, and a manual GitHub workflow; the target repository owns editorial data, validation, import, pull-request CI, and Vercel preview reporting.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5, Tailwind CSS 3, Zod 3, Vitest 3, Testing Library, Playwright 1.61, Node.js 20, GitHub Actions, Vercel Git deployments, Vite-built Phaser/Three.js games.

**Scope Note:** This remains one cross-repository plan because the source workflow cannot function until the target importer, validation commands, CI, and preview reporting have landed. The execution checkpoints keep the two repository PRs independently reviewable.

## Global Constraints

- Read `docs/superpowers/specs/2026-07-19-personal-portfolio-game-publishing-design.md` before starting and treat it as authoritative.
- Work in both `/Users/fatihtoker/Code/personal-website-next` and `/Users/fatihtoker/Code/idea-generator`; create a separate `codex/portfolio-*` branch and separate commits in each repository.
- Use `main` as the pull-request base. This project has no `master` branch.
- Keep all visitor-facing portfolio copy in English.
- Follow the approved premium digital-playground direction: graphite surfaces, warm off-white text, restrained vivid accents, editorial typography, asymmetric featured cards, and no generic neon cyberpunk or excessive glassmorphism.
- Use the exact hero line: “Full-stack developer turning spare-time ideas into games and useful apps.”
- Public identity links are only `https://github.com/fatihtoker` and `mailto:fatihhtoker@gmail.com`.
- Store built game output only in the target repository; never copy game source, `package.json`, lockfiles, tests, or `node_modules`.
- Store playable bundles at `public/playables/<slug>/` and covers at `public/project-covers/<slug>.webp`.
- Every cover is exactly 1600×900 WebP, no more than 600 KB, text-free, center-safe, representative of the actual game, and paired with meaningful English alt text.
- Every published bundle is at most 50 MiB uncompressed; no individual file exceeds 20 MiB; source maps and symbolic links are forbidden.
- The iframe sandbox is exactly `allow-scripts allow-same-origin allow-pointer-lock`; iframe permissions are `autoplay; fullscreen; gamepad`; set `allowFullScreen`; do not grant popups or top navigation.
- Device classes are viewport-based: `<768` mobile, `768–1023` tablet, and `>=1024` desktop.
- Automation opens or updates PRs only. It never pushes to `main`, merges a PR, deletes a project, or deploys directly to production.
- Preserve unrelated user changes in both repositories.
- Use TDD, run the stated failing test before implementation, and make the listed commit after each green task.

## Locked File Structure

### `personal-website-next`

- `app/layout.tsx`: global metadata, Space Grotesk/Manrope fonts, shared body classes.
- `app/globals.css`: portfolio design tokens, base accessibility rules, reduced-motion behavior.
- `app/page.tsx`: server-rendered home composition.
- `app/not-found.tsx`: portfolio-styled 404.
- `app/games/[slug]/page.tsx`: standard playable-game detail page and static metadata.
- `app/games/[slug]/play/page.tsx`: server guard and play-shell composition.
- `app/projects/[slug]/page.tsx`: standard showcase fallback for future non-bespoke projects.
- `app/sitemap.ts`, `app/robots.ts`: manifest-driven indexing policy.
- `components/site/SiteHeader.tsx`, `SiteFooter.tsx`: global navigation and identity.
- `components/home/Hero.tsx`, `FeaturedProjects.tsx`, `ProjectCatalog.tsx`, `ProjectCard.tsx`: home sections.
- `components/games/DeviceBadges.tsx`, `PlayAvailability.tsx`, `GamePlayer.tsx`: game compatibility, detail CTA, and iframe controls.
- `lib/site-url.ts`: canonical production URL resolution from Vercel or an explicit override.
- `content/projects.json`: canonical target-site catalog and editorial values.
- `lib/projects/schema.ts`: Zod schemas and exported project types.
- `lib/projects/repository.ts`: parsed catalog query functions.
- `lib/projects/device.ts`: exact viewport classification and support decision.
- `lib/projects/schema.test.ts`, `repository.test.ts`, `device.test.ts`: domain tests.
- `scripts/project-contract.mjs`: source descriptor/static bundle validation primitives.
- `scripts/import-game.mjs`: atomic, idempotent target importer.
- `scripts/validate-projects.mjs`: site-manifest and artifact validator.
- `scripts/__tests__/project-contract.test.mjs`, `import-game.test.mjs`: Node-level contract/import tests.
- `tests/e2e/portfolio.spec.ts`: primary visitor journeys.
- `tests/e2e/play.spec.ts`: compatible, incompatible, reload, fullscreen, and load-error journeys.
- `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`: test configuration.
- `.github/workflows/ci.yml`: required target checks.
- `.github/workflows/vercel-preview-comment.yml`, `.github/preview-comment-script.mjs`: marker-based Vercel URL comment.

### `idea-generator`

- `AGENTS.md`: web-game output requirement summary.
- `.agents/agents/game_juice_audio.md`: portfolio-cover generation rule.
- `.agents/agents/game_qa_tester.md`: portfolio verification requirement.
- `.agents/skills/game-deploy/SKILL.md`: publication descriptor, nested-path build, and publishing handoff.
- `scripts/validate-portfolio.mjs`: source-side contract validator.
- `scripts/__tests__/validate-portfolio.test.mjs`: source validator tests.
- `.github/workflows/publish-game-to-portfolio.yml`: manual one-click publisher.
- `games/<slug>/portfolio.json`, `games/<slug>/portfolio-cover.webp`: per-game publication files.
- Each selected game's Vite config and `package.json`: relative base and normalized `portfolio:verify` script.

---

### Task 1: Establish the Target Test Harness and Typed Project Domain

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `content/projects.json`
- Create: `lib/projects/schema.ts`
- Create: `lib/projects/repository.ts`
- Create: `lib/projects/schema.test.ts`
- Create: `lib/projects/repository.test.ts`

**Interfaces:**
- Produces: `Project`, `PlayableGame`, `ShowcaseProject`, `projectManifestSchema`, `getAllProjects()`, `getFeaturedProjects()`, `getProjectBySlug(slug)`, `getPlayableGameBySlug(slug)`.
- Consumers: every page/component and the sitemap in later tasks.

- [ ] **Step 1: Install exact runtime and test dependencies and add scripts**

Run:

```bash
cd /Users/fatihtoker/Code/personal-website-next
npm install zod@3.25.76
npm install --save-dev vitest@3.2.4 jsdom@26.1.0 @testing-library/react@16.3.0 @testing-library/jest-dom@6.6.4 @testing-library/user-event@14.6.1 @playwright/test@1.61.1 @axe-core/playwright@4.10.2 sharp@0.34.3
```

Add these scripts without removing existing scripts:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "validate:projects": "node scripts/validate-projects.mjs",
  "import:game": "node scripts/import-game.mjs"
}
```

Expected: `package-lock.json` changes and `npm ls zod vitest @playwright/test sharp` exits 0.

- [ ] **Step 2: Configure Vitest**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}", "scripts/__tests__/*.test.mjs"],
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Add `"@/*": ["./*"]` under `compilerOptions.paths` in `tsconfig.json`.

- [ ] **Step 3: Write the failing schema and repository tests**

In `lib/projects/schema.test.ts`, assert that the approved LingoLink showcase parses, a playable game without `supportedDevices` fails, duplicate slugs fail at manifest level, and unsafe slugs such as `../escape` fail. In `repository.test.ts`, assert stable `sortOrder`, featured filtering, and kind-safe lookup. Use this exact fixture shape:

```ts
const playable = {
  schemaVersion: 1,
  kind: "playable-game",
  slug: "test-game",
  title: "Test Game",
  cardSummary: "A deterministic test game.",
  description: "A complete description used by the detail page.",
  category: "game",
  tags: ["Arcade"],
  coverSrc: "/project-covers/test-game.webp",
  coverAlt: "A test arena with a single game token.",
  publishedAt: "2026-07-19",
  featured: false,
  sortOrder: 10,
  seo: { title: "Test Game | Fatih Toker", description: "Play Test Game." },
  playablePath: "/playables/test-game/index.html",
  supportedDevices: ["desktop", "mobile"],
  controls: ["keyboard", "touch"],
  recommendedAspectRatio: "16:9",
  minimumViewport: { width: 390, height: 700 },
  source: { repository: "https://github.com/fatihtoker/idea-generator", commit: "a".repeat(40) }
};
```

- [ ] **Step 4: Run the tests and confirm the red state**

Run: `npm test -- lib/projects/schema.test.ts lib/projects/repository.test.ts`

Expected: FAIL because `schema.ts` and `repository.ts` do not exist.

- [ ] **Step 5: Implement the discriminated schema and query API**

In `schema.ts`, define strict Zod objects with these exact enums and refinements:

```ts
export const deviceSchema = z.enum(["desktop", "tablet", "mobile"]);
export const controlSchema = z.enum(["keyboard", "mouse", "touch", "gamepad"]);
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const projectManifestSchema = z.array(projectSchema).superRefine((items, ctx) => {
  const seen = new Set<string>();
  items.forEach((item, index) => {
    if (seen.has(item.slug)) ctx.addIssue({ code: "custom", path: [index, "slug"], message: `Duplicate slug: ${item.slug}` });
    seen.add(item.slug);
  });
});
export type Project = z.infer<typeof projectSchema>;
export type PlayableGame = Extract<Project, { kind: "playable-game" }>;
export type ShowcaseProject = Extract<Project, { kind: "showcase" }>;
```

Use strict base fields from the design spec. Allow `detailHref` to be omitted for future standard showcases; when present it must begin with `/`. In `repository.ts`, parse `content/projects.json` once and export pure sorted query functions. `getPlayableGameBySlug` must return `undefined` for a showcase.

- [ ] **Step 6: Seed only the LingoLink showcase**

Create `content/projects.json` with one record:

```json
[
  {
    "schemaVersion": 1,
    "kind": "showcase",
    "slug": "lingolink",
    "title": "LingoLink",
    "cardSummary": "A fast-paced mobile game for testing your linguistic instincts.",
    "description": "Connect words and languages through quick, highly replayable challenges built around linguistic intuition.",
    "category": "app",
    "tags": ["Mobile", "Language", "Game"],
    "coverSrc": "/project-covers/lingolink.webp",
    "coverAlt": "LingoLink language challenge displayed on a mobile phone.",
    "publishedAt": "2026-07-19",
    "featured": false,
    "sortOrder": 70,
    "seo": {
      "title": "LingoLink | Fatih Toker",
      "description": "Discover LingoLink, a fast-paced mobile language challenge by Fatih Toker."
    },
    "detailHref": "/lingolink"
  }
]
```

Do not fabricate the cover. Task 2 creates it from the existing LingoLink visual identity.

- [ ] **Step 7: Run domain tests and commit**

Run: `npm test -- lib/projects/schema.test.ts lib/projects/repository.test.ts`

Expected: PASS.

```bash
git add package.json package-lock.json tsconfig.json vitest.config.ts vitest.setup.ts content lib/projects
git commit -m "feat: add typed project catalog domain"
```

### Task 2: Build the Portfolio Design System and Global Shell

**Files:**
- Modify: `app/layout.tsx`
- Replace: `app/globals.css`
- Create: `.eslintrc.json`
- Create: `lib/site-url.ts`
- Create: `components/site/SiteHeader.tsx`
- Create: `components/site/SiteFooter.tsx`
- Create: `components/site/SiteHeader.test.tsx`
- Create: `app/not-found.tsx`
- Create: `public/project-covers/lingolink.webp`

**Interfaces:**
- Produces: shared site shell, anchor IDs `projects` and `about`, global tokens, and the LingoLink catalog cover.
- Consumes: approved name, links, visual direction, and accessibility constraints.

- [ ] **Step 1: Write the failing header accessibility test**

Assert that the logo links to `/`, Projects links to `/#projects`, About links to `/#about`, GitHub opens safely in a new tab, email uses the exact mailto URL, and all interactive names are discoverable by role.

Run: `npm test -- components/site/SiteHeader.test.tsx`

Expected: FAIL because the new header does not exist.

- [ ] **Step 2: Implement fonts, metadata, and the global shell**

Use `Space_Grotesk` for display text and `Manrope` for body text through `next/font/google`. Resolve the canonical origin in `lib/site-url.ts`:

```ts
export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return new URL(process.env.NEXT_PUBLIC_SITE_URL);
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  return new URL("http://localhost:3000");
}
```

Set root metadata to:

```ts
export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: "Fatih Toker — Games & Apps", template: "%s | Fatih Toker" },
  description: "Full-stack developer turning spare-time ideas into games and useful apps.",
};
```

Keep the existing favicon/manifest links. Set `<html lang="en">`. Render `SiteHeader`, `{children}`, and `SiteFooter` inside the body. Create `.eslintrc.json` with `{ "extends": "next/core-web-vitals" }` so `npm run lint` is non-interactive.

- [ ] **Step 3: Implement the locked visual tokens**

Replace the unused RGB defaults with these tokens and extend them with responsive component classes, visible `:focus-visible`, and reduced motion:

```css
:root {
  --ink: #f3efe7;
  --muted: #a9a397;
  --canvas: #121313;
  --surface: #1b1d1c;
  --surface-strong: #252826;
  --line: #343834;
  --acid: #c9f66b;
  --coral: #ff8066;
  --sky: #79c7ff;
  --radius-sm: 0.875rem;
  --radius-lg: 1.75rem;
  --shadow-card: 0 24px 80px rgba(0, 0, 0, 0.28);
}
html { scroll-behavior: smooth; background: var(--canvas); }
body { margin: 0; color: var(--ink); background: var(--canvas); }
:focus-visible { outline: 3px solid var(--acid); outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 4: Implement header, footer, and 404**

Use semantic `<header>`, `<nav aria-label="Primary navigation">`, `<main>`, and `<footer id="about">`. Keep the mobile header readable without a JavaScript drawer: wrap secondary links below the name when space is constrained. Every control must have a minimum 44px hit area. Use `usePathname()` inside the header and footer: on a path matching `^/games/[a-z0-9]+(?:-[a-z0-9]+)*/play$`, the header renders only a Home link and the footer returns `null`, preserving a focused play viewport.

- [ ] **Step 5: Create and validate the LingoLink cover**

Use the existing `public/app_logo.png` and the current LingoLink purple/emerald identity as references. Generate or compose a text-free 1600×900 WebP showing the LingoLink language-choice phone UI on a deep violet background, with the phone and language cards centered inside the middle 70% safe area. Do not add store badges or marketing text.

Run:

```bash
node -e "const sharp=require('sharp'); sharp('public/project-covers/lingolink.webp').metadata().then(m=>{if(m.width!==1600||m.height!==900||m.format!=='webp')process.exit(1);})"
test $(stat -f%z public/project-covers/lingolink.webp) -le 614400
```

Expected: both commands exit 0.

- [ ] **Step 6: Verify and commit**

Run: `npm test -- components/site/SiteHeader.test.tsx && npm run lint`

Expected: PASS with no lint errors.

```bash
git add app/layout.tsx app/globals.css app/not-found.tsx components/site lib/site-url.ts .eslintrc.json public/project-covers/lingolink.webp
git commit -m "feat: add portfolio visual shell"
```

### Task 3: Implement the Home Page and Unified Catalog

**Files:**
- Replace: `app/page.tsx`
- Create: `components/home/Hero.tsx`
- Create: `components/home/FeaturedProjects.tsx`
- Create: `components/home/ProjectCatalog.tsx`
- Create: `components/home/ProjectCard.tsx`
- Create: `components/home/ProjectCatalog.test.tsx`

**Interfaces:**
- Consumes: `Project[]`, `getAllProjects()`, `getFeaturedProjects()`.
- Produces: filter buttons named `All`, `Games`, `Apps`; cards with `View game` or `View project`; `#projects` anchor.

- [ ] **Step 1: Write failing catalog behavior tests**

Render one playable and one showcase fixture. Assert initial visibility of both, Games hides showcase, Apps hides playable, `aria-pressed` follows the selection, playable CTA is `View game`, and showcase CTA is `View project`.

Run: `npm test -- components/home/ProjectCatalog.test.tsx`

Expected: FAIL because the components do not exist.

- [ ] **Step 2: Implement the card and client-side catalog**

`ProjectCard` stays presentational. `ProjectCatalog` owns only this state:

```ts
type CatalogFilter = "all" | "game" | "app";
const [filter, setFilter] = useState<CatalogFilter>("all");
const visible = projects.filter((project) => filter === "all" || project.category === filter);
```

Use `next/image` with `sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"` and a fixed 16:9 wrapper. Link playable cards to `/games/<slug>` and showcases to `detailHref`.

- [ ] **Step 3: Implement the server-rendered home composition**

`app/page.tsx` reads projects through the repository and renders `Hero`, `FeaturedProjects`, and `ProjectCatalog`. The hero H1 must be exactly:

```text
Full-stack developer turning spare-time ideas into games and useful apps.
```

Use a short eyebrow `Fatih Toker — Games & Apps`, a support line `Small experiments, polished into things you can play and use.`, and a primary link `Explore projects` to `#projects`.

When no projects are featured, `FeaturedProjects` must not render an empty section. The final launch state will feature three games in Task 11.

- [ ] **Step 4: Add editorial layout styling**

Use a maximum content width of 1280px. The featured grid is asymmetric at desktop (`first card: span 7`, `second: span 5`, optional third full width) and a single column below 900px. Use cover-derived accent strips, not per-card glass gradients. Keep all text visible without hover.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- components/home/ProjectCatalog.test.tsx && npm run lint && npm run build`

Expected: tests PASS, lint exits 0, and Next build completes with `/` statically generated.

```bash
git add app/page.tsx components/home
git commit -m "feat: build projects landing page"
```

### Task 4: Add Standard Detail Routes and Device Compatibility

**Files:**
- Create: `lib/projects/device.ts`
- Create: `lib/projects/device.test.ts`
- Create: `components/games/DeviceBadges.tsx`
- Create: `components/games/PlayAvailability.tsx`
- Create: `components/games/PlayAvailability.test.tsx`
- Create: `app/games/[slug]/page.tsx`
- Create: `app/projects/[slug]/page.tsx`

**Interfaces:**
- Produces: `classifyViewport(width: number): DeviceClass`, `supportsDevice(game, device): boolean`.
- Consumes: `getAllProjects()`, `getPlayableGameBySlug()`, `getProjectBySlug()`.

- [ ] **Step 1: Write failing boundary tests**

Use exact assertions:

```ts
expect(classifyViewport(767)).toBe("mobile");
expect(classifyViewport(768)).toBe("tablet");
expect(classifyViewport(1023)).toBe("tablet");
expect(classifyViewport(1024)).toBe("desktop");
```

Also assert `supportsDevice` is a plain membership check. Add component tests with a desktop-only fixture that mock widths 390 and 1440: the desktop width renders `Play now`; the mobile width renders no play link and says `Available on: Desktop`.

Run: `npm test -- lib/projects/device.test.ts`

Expected: FAIL because `device.ts` does not exist.

- [ ] **Step 2: Implement compatibility helpers**

```ts
export type DeviceClass = "desktop" | "tablet" | "mobile";
export function classifyViewport(width: number): DeviceClass {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}
export function supportsDevice(game: PlayableGame, device: DeviceClass) {
  return game.supportedDevices.includes(device);
}
```

- [ ] **Step 3: Implement static game detail pages**

Use `generateStaticParams()` from playable project slugs, `notFound()` for unknown/non-playable records, and `generateMetadata()` from the project's SEO and cover. Render cover, description, tags, controls, `DeviceBadges`, and `PlayAvailability`. The client component uses the same resize-aware viewport classification as `GamePlayer`, renders `Play now` only when supported, and otherwise renders the compatibility message. Do not load or reference the iframe here.

- [ ] **Step 4: Implement the standard showcase fallback**

Generate params only for showcases without a bespoke `detailHref`. Render a restrained standard detail layout and return `notFound()` for LingoLink because it owns `/lingolink`.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- lib/projects/device.test.ts components/games/PlayAvailability.test.tsx && npm run build`

Expected: PASS; the LingoLink route remains available and no game paths exist until imports are added.

```bash
git add lib/projects/device.ts lib/projects/device.test.ts components/games/DeviceBadges.tsx components/games/PlayAvailability.tsx components/games/PlayAvailability.test.tsx app/games app/projects
git commit -m "feat: add project detail routes"
```

### Task 5: Build the Isolated Play Experience

**Files:**
- Create: `components/games/GamePlayer.tsx`
- Create: `components/games/GamePlayer.test.tsx`
- Create: `app/games/[slug]/play/page.tsx`

**Interfaces:**
- Consumes: `PlayableGame`, `classifyViewport`, `supportsDevice`.
- Produces: iframe title `${game.title} game`, reload button, fullscreen button, details link, loading/error/unsupported states.

- [ ] **Step 1: Write failing player tests**

Mock `window.innerWidth`, `ResizeObserver` behavior with a `resize` event, `HTMLIFrameElement.requestFullscreen`, and the iframe load/error events. Assert:

- a supported viewport creates one iframe with the exact sandbox and `allow` values;
- an unsupported viewport creates no iframe and names supported devices;
- iframe `load` removes the loading message;
- iframe `error` shows `The game could not be loaded.` and a `Retry` button;
- `Reload game` changes the iframe React key and reconstructs it;
- `Enter fullscreen` calls `requestFullscreen()` on the frame wrapper.

Run: `npm test -- components/games/GamePlayer.test.tsx`

Expected: FAIL because `GamePlayer` does not exist.

- [ ] **Step 2: Implement `GamePlayer` as the only iframe owner**

Use client state with these exact states:

```ts
type LoadState = "loading" | "ready" | "error";
const [device, setDevice] = useState<DeviceClass | null>(null);
const [loadState, setLoadState] = useState<LoadState>("loading");
const [frameKey, setFrameKey] = useState(0);
```

Classify on mount and on `resize`. While `device` is null, show a neutral compatibility check. If unsupported, do not render an iframe. For supported devices render:

```tsx
<iframe
  key={frameKey}
  src={game.playablePath}
  title={`${game.title} game`}
  sandbox="allow-scripts allow-same-origin allow-pointer-lock"
  allow="autoplay; fullscreen; gamepad"
  allowFullScreen
  onLoad={() => setLoadState("ready")}
  onError={() => setLoadState("error")}
/>
```

The reload and retry handlers increment `frameKey` and restore `loading`. Fullscreen targets the wrapper, handles a rejected promise, and announces `Fullscreen is unavailable in this browser.` through an `aria-live="polite"` status.

- [ ] **Step 3: Implement the play route**

Generate static params for playable games, use `notFound()` for invalid slugs, set `robots: { index: false, follow: false }`, and render a minimal chrome with `Back to <title>`, `GamePlayer`, and no normal site footer inside the play viewport. The global header may remain but must collapse to a single back link on this route through CSS.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- components/games/GamePlayer.test.tsx && npm run build`

Expected: tests PASS and play pages compile without accessing `window` on the server.

```bash
git add components/games/GamePlayer.tsx components/games/GamePlayer.test.tsx app/games/*/play
git commit -m "feat: add isolated game player"
```

### Task 6: Complete Metadata, Sitemap, Robots, and Portfolio E2E Coverage

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Create: `playwright.config.ts`
- Create: `tests/e2e/portfolio.spec.ts`
- Create: `tests/e2e/play.spec.ts`
- Modify: `next.config.js`
- Modify: `app/lingolink/page.tsx`

**Interfaces:**
- Produces: crawlable home/detail routes; noindex play/bundle routes; stable E2E server at `127.0.0.1:3100`.

- [ ] **Step 1: Configure Playwright and write failing visitor journeys**

Use this configuration:

```ts
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: { baseURL: "http://127.0.0.1:3100", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["iPhone 13"] } }
  ],
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
```

Before games exist, `portfolio.spec.ts` must test home copy, Apps filtering, LingoLink navigation, GitHub/email links, and keyboard focus. Add game journeys in Task 11. `play.spec.ts` may use a temporary manifest fixture only in unit tests; do not commit a fake public game.

Import `AxeBuilder` from `@axe-core/playwright` and assert `analyze().violations` has no entries with impact `critical` or `serious` on `/`, `/lingolink`, a game detail page, and a play shell after the launch games are imported.

Run: `npm run test:e2e -- tests/e2e/portfolio.spec.ts --project=desktop`

Expected: FAIL until metadata/routes and any missing accessible names are complete.

- [ ] **Step 2: Implement indexing policy**

`sitemap.ts` includes `/`, `/lingolink`, all playable detail routes, and non-bespoke showcase detail routes. `robots.ts` allows `/` and disallows `/games/*/play` plus `/playables/`. Use `getSiteUrl()` consistently so Vercel's production URL or `NEXT_PUBLIC_SITE_URL` controls canonicals.

- [ ] **Step 3: Harden static headers**

In `next.config.js`, add headers for `/playables/:path*`:

```js
{
  source: '/playables/:path*',
  headers: [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'same-origin' },
    { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" }
  ]
}
```

Do not add a global CSP that could silently break existing games. Keep the iframe sandbox as the primary runtime boundary.

- [ ] **Step 4: Make LingoLink a good catalog destination**

Add an accessible link back to `/#projects` near the top and ensure its page metadata matches the manifest. Do not redesign its internal marketing sections in this scope. Replace placeholder Twitter/Instagram URLs in its footer by removing those two icons; retain GitHub and contact.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm test
npm run lint
npm run build
npm run test:e2e -- tests/e2e/portfolio.spec.ts
```

Expected: all commands PASS.

```bash
git add app/sitemap.ts app/robots.ts playwright.config.ts tests/e2e next.config.js app/lingolink components/lingolink/Footer.tsx
git commit -m "feat: add portfolio SEO and browser coverage"
```

### Task 7: Implement the Target Publication Contract and Atomic Importer

**Files:**
- Create: `scripts/project-contract.mjs`
- Create: `scripts/import-game.mjs`
- Create: `scripts/validate-projects.mjs`
- Create: `scripts/__tests__/fixtures/valid-game/portfolio.json`
- Create: `scripts/__tests__/fixtures/valid-game/portfolio-cover.webp`
- Create: `scripts/__tests__/fixtures/valid-game/dist/index.html`
- Create: `scripts/__tests__/fixtures/valid-game/dist/assets/game.js`
- Create: `scripts/__tests__/project-contract.test.mjs`
- Create: `scripts/__tests__/import-game.test.mjs`

**Interfaces:**
- `validatePublication(sourceDir): Promise<Publication>` rejects before target mutation.
- `importGame({ sourceDir, sourceRepository, sourceCommit, targetRoot }): Promise<{ mode: "import" | "update"; slug: string; bundleBytes: number }>`.
- `validateSite(targetRoot): Promise<void>` validates manifest, every cover, and every playable bundle.

- [ ] **Step 1: Build a real 1600×900 test cover fixture**

Run once to create the binary fixture:

```bash
node -e "require('sharp')({create:{width:1600,height:900,channels:3,background:'#223344'}}).webp({quality:60}).toFile('scripts/__tests__/fixtures/valid-game/portfolio-cover.webp')"
```

The fixture is test-only and must never be copied into `public/`.

Create the fixture descriptor and static files exactly as follows:

```json
{"schemaVersion":1,"slug":"valid-game","title":"Valid Game","cardSummary":"A valid publication fixture.","description":"A complete fixture used to exercise the portfolio publication contract.","seoTitle":"Play Valid Game | Fatih Toker","seoDescription":"Play the valid portfolio fixture.","genre":"Arcade","tags":["Arcade"],"supportedDevices":["desktop","mobile"],"controls":["keyboard","touch"],"recommendedAspectRatio":"16:9","minimumViewport":{"width":390,"height":700},"coverAlt":"A plain blue test arena."}
```

```html
<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Valid Game</title></head><body><script type="module" src="./assets/game.js"></script></body></html>
```

```js
document.body.dataset.gameReady = "true";
```

- [ ] **Step 2: Write failing validator tests**

Test the valid fixture and separate temporary copies that introduce: unsafe slug, `../` path traversal, directory/slug mismatch, missing `dist/index.html`, 1601×900 cover, 601 KB cover, source map, disallowed extension, symbolic link, `src="/assets/game.js"`, total size above 50 MiB, and one file above 20 MiB. Assert error messages name the offending path and rule.

Run: `npm test -- scripts/__tests__/project-contract.test.mjs`

Expected: FAIL because `project-contract.mjs` does not exist.

- [ ] **Step 3: Implement strict publication validation**

Export constants `MAX_COVER_BYTES = 614400`, `MAX_BUNDLE_BYTES = 50 * 1024 * 1024`, `MAX_FILE_BYTES = 20 * 1024 * 1024`, and the exact extension allowlist from Global Constraints. Validate real paths remain under `sourceDir`, reject `lstat().isSymbolicLink()`, use `sharp(...).metadata()` for cover checks, recursively total files, and scan HTML/CSS for root-absolute `src`, `href`, and `url()` references. Allow `data:`, `http:`, `https:`, `blob:`, `#`, and relative paths.

Descriptor validation is strict and permits only:

```js
{
  schemaVersion: 1,
  slug: string,
  title: string,
  cardSummary: string,
  description: string,
  seoTitle: string,
  seoDescription: string,
  genre: string,
  tags: string[],
  supportedDevices: ("desktop"|"tablet"|"mobile")[],
  controls: ("keyboard"|"mouse"|"touch"|"gamepad")[],
  recommendedAspectRatio: string,
  minimumViewport: { width: number, height: number },
  coverAlt: string
}
```

- [ ] **Step 4: Write failing importer tests**

Use a temporary target tree. Assert a new import creates the bundle, cover, and record; update replaces old bundle files; update preserves `featured`, `sortOrder`, `publishedAt`, and a pre-existing `detailHref`; provenance updates; invalid imports leave byte-for-byte target snapshots unchanged; duplicate target slugs fail; and there is no delete option.

Run: `npm test -- scripts/__tests__/import-game.test.mjs`

Expected: FAIL because `import-game.mjs` is incomplete.

- [ ] **Step 5: Implement staging, mapping, swap, and rollback**

Parse CLI arguments exactly:

```text
--source <absolute-or-relative-game-directory>
--source-repository https://github.com/fatihtoker/idea-generator
--source-commit 0123456789abcdef0123456789abcdef01234567
--target-root <path, default current working directory>
```

Validate first. Create all new artifacts under the target root's `.portfolio-import/` directory using a cryptographically random staging name. Map source fields to the target project record, set `kind: "playable-game"`, `category: "game"`, `coverSrc`, `playablePath`, and provenance. For a new record set `featured: false`, `sortOrder` to the next multiple of 10 after the current maximum, and `publishedAt` to `SOURCE_DATE` when provided or the UTC date. For updates preserve target-owned `featured`, `sortOrder`, `publishedAt`, and bespoke routing fields.

Before swapping, snapshot the old manifest text and rename existing bundle/cover to unique backups. Rename staged artifacts into place, write the manifest through a same-directory temporary file plus rename, run `validateSite`, then remove backups. On any error restore backups and the exact old manifest text before rethrowing. Always remove `.portfolio-import` staging in `finally`.

- [ ] **Step 6: Implement whole-site artifact validation**

`validate-projects.mjs` imports `validateSite(process.cwd())`, prints one concise success line with project/playable counts, and exits nonzero with the error stack on failure. It must validate LingoLink's cover and every imported playable.

- [ ] **Step 7: Verify and commit**

Run:

```bash
npm test -- scripts/__tests__/project-contract.test.mjs scripts/__tests__/import-game.test.mjs
npm run validate:projects
npm run build
```

Expected: PASS and `validate:projects` reports one project and zero playable games.

```bash
git add scripts package.json package-lock.json
git commit -m "feat: add atomic game importer"
```

### Task 8: Add Target CI and Vercel Preview URL Reporting

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/vercel-preview-comment.yml`
- Create: `.github/preview-comment-script.mjs`
- Create: `.github/preview-comment-script.test.mjs`

**Interfaces:**
- Consumes: GitHub `deployment_status` events produced by Vercel.
- Produces: one updatable PR comment containing marker `<!-- portfolio-preview -->` and the successful `environment_url`.

- [ ] **Step 1: Write a failing pure-function test for PR selection/comment text**

Export `buildPreviewComment(url)` and `selectPullRequest(pulls, sha)` from `preview-comment-script.mjs`. Assert exact body:

```md
<!-- portfolio-preview -->
## Portfolio Preview

✅ The full-site Vercel preview is ready: [Open preview](https://preview.example.vercel.app)
```

Run: `node --test .github/preview-comment-script.test.mjs`

Expected: FAIL because the helper does not exist.

- [ ] **Step 2: Implement CI**

`ci.yml` triggers on PRs to `main` and pushes to `main`, uses Node 20 with npm cache, runs `npm ci`, `npx playwright install --with-deps chromium`, `npm run validate:projects`, `npm test`, `npm run lint`, `npm run build`, and `npm run test:e2e -- --project=desktop`. Give it only `contents: read`.

- [ ] **Step 3: Implement preview-comment workflow**

Trigger on `deployment_status`. Continue only when state is `success`, environment contains `Preview`, and environment URL host ends with `.vercel.app`. Use permissions `contents: read`, `pull-requests: write`, `deployments: read`. With `actions/github-script@v7`, find open PRs whose `head.sha` matches the deployment SHA, then update the comment containing the marker or create it.

Do not make this workflow deploy anything and do not accept arbitrary non-Vercel URLs.

- [ ] **Step 4: Verify and commit**

Run:

```bash
node --test .github/preview-comment-script.test.mjs
npm run validate:projects
npm test
npm run build
```

Expected: PASS.

```bash
git add .github
git commit -m "ci: validate portfolio and report previews"
```

### Task 9: Add the Source-Side Publication Contract and Generation Rules

**Repository:** `/Users/fatihtoker/Code/idea-generator`

**Files:**
- Modify: `AGENTS.md`
- Modify: `.agents/agents/game_juice_audio.md`
- Modify: `.agents/agents/game_qa_tester.md`
- Modify: `.agents/skills/game-deploy/SKILL.md`
- Create: `scripts/validate-portfolio.mjs`
- Create: `scripts/__tests__/validate-portfolio.test.mjs`
- Modify: root `package.json`
- Modify: root `package-lock.json`

**Interfaces:**
- Produces: `node scripts/validate-portfolio.mjs --game-dir games/<slug>`.
- Contract: byte-for-byte equivalent rules to the target's `scripts/project-contract.mjs` for descriptor, cover, bundle paths, extensions, and sizes.

- [ ] **Step 1: Create a source branch and install validator dependencies**

```bash
cd /Users/fatihtoker/Code/idea-generator
git switch -c codex/portfolio-publisher
npm install --save-dev sharp@0.34.3
```

Add root scripts:

```json
{
  "test:portfolio-validator": "node --test scripts/__tests__/validate-portfolio.test.mjs",
  "validate:portfolio": "node scripts/validate-portfolio.mjs"
}
```

- [ ] **Step 2: Write failing source-validator contract tests**

Create temporary games with the same valid/invalid cases listed in Task 7 and assert the exact cover, total, individual-file, extension, device, and control constants stated in Global Constraints. Cross-repository parity is proven later when the workflow passes the same artifact through the target importer; the source test must not depend on a sibling checkout.

Run: `npm run test:portfolio-validator`

Expected: FAIL because the source validator does not exist.

- [ ] **Step 3: Implement the CLI validator**

Parse only `--game-dir`. Resolve it under the repository's `games/` directory, reject escape paths, call the same validation algorithm specified in Task 7, and print:

```text
Portfolio contract valid: chitin-colony (3565158 bytes, 24 files)
```

Do not import files from the sibling repository at runtime; duplicate the small versioned contract deliberately and enforce parity in the cross-repository workflow by running the target importer as the second validator.

- [ ] **Step 4: Update game-generation guidance with exact requirements**

Add a `Portfolio Publication Output` section to all four instruction files. It must say:

```text
Every new browser game must include portfolio.json and portfolio-cover.webp in its game root. The cover must be a text-free, center-safe, representative 1600×900 WebP no larger than 600 KB. portfolio.json must use schemaVersion 1 and declare slug, English listing copy, SEO copy, genre, tags, supported devices, controls, recommended aspect ratio, minimum viewport, and meaningful cover alt text. Vite production output must use relative asset paths and pass npm run portfolio:verify plus node ../../scripts/validate-portfolio.mjs --game-dir . before delivery.
```

In `game_juice_audio.md`, extend the assets template with `portfolio-cover.webp`, its exact dimensions, constraints, and a game-specific generation prompt. In `game_qa_tester.md`, require nested-path loading from a non-root URL. In `game-deploy/SKILL.md`, add the personal-portfolio workflow as a distinct publishing target and explicitly state that its Vite base is `./`, overriding the skill's root-host default.

- [ ] **Step 5: Verify and commit**

Run: `npm run test:portfolio-validator && npm run build`

The sample line above defines the format; the actual slug, byte count, and file count are computed values. Expected: validator tests and the existing root TypeScript build PASS.

```bash
git add AGENTS.md .agents/agents/game_juice_audio.md .agents/agents/game_qa_tester.md .agents/skills/game-deploy/SKILL.md scripts package.json package-lock.json
git commit -m "feat: define portfolio publication contract"
```

### Task 10: Add the Manual Cross-Repository Publisher

**Repository:** `/Users/fatihtoker/Code/idea-generator`

**Files:**
- Create: `.github/workflows/publish-game-to-portfolio.yml`
- Create: `scripts/render-portfolio-pr.mjs`
- Create: `scripts/__tests__/render-portfolio-pr.test.mjs`

**Interfaces:**
- Workflow input: required string `game_slug`.
- Required secret: `PERSONAL_WEBSITE_AUTOMATION_TOKEN` scoped only to `fatihtoker/personal-website-next` with Contents and Pull requests read/write.
- Output branch: `automation/import-<slug>`; PR base: `main`.

- [ ] **Step 1: Write failing PR-summary tests**

Test that the helper renders import/update mode, slug, source commit, bundle bytes, cover status, source verification, target validation/test/lint/build status, and the sentence `Vercel will attach a full-site preview after this pull request is opened.` Escape Markdown control characters from untrusted metadata.

Run: `node --test scripts/__tests__/render-portfolio-pr.test.mjs`

Expected: FAIL because the helper does not exist.

- [ ] **Step 2: Implement the pure PR-body renderer**

Export `renderPortfolioPrBody(input)` and keep all shell-derived values passed through environment files rather than string-interpolated into shell commands. The first line is `<!-- automated-portfolio-import -->` so subsequent runs can identify the PR.

- [ ] **Step 3: Implement the workflow**

Use `workflow_dispatch` with required `game_slug`, and:

```yaml
concurrency:
  group: portfolio-${{ inputs.game_slug }}
  cancel-in-progress: false
permissions:
  contents: read
```

Use Node 20. Validate the slug against `^[a-z0-9]+(-[a-z0-9]+)*$` before using it in a path. In the selected game directory run `npm ci` and `npm run portfolio:verify`; then run the source validator from repo root.

Checkout the target repository into `${{ runner.temp }}/personal-website-next` using `PERSONAL_WEBSITE_AUTOMATION_TOKEN`, branch `automation/import-$GAME_SLUG`, and `fetch-depth: 0`. Configure the bot identity locally. Run:

```bash
npm ci
npm run import:game -- --source "$GITHUB_WORKSPACE/games/$GAME_SLUG" --source-repository "https://github.com/fatihtoker/idea-generator" --source-commit "$GITHUB_SHA" --target-root .
npm run validate:projects
npm test
npm run lint
npm run build
npx playwright install --with-deps chromium
npm run test:e2e -- --project=desktop
```

In the actual YAML, pass `GAME_SLUG`, `GITHUB_WORKSPACE`, and computed paths as environment values; do not interpolate the user input directly into a multi-command shell string.

Before invoking the importer, write `SOURCE_DATE` to `$GITHUB_ENV` from the source commit's `%cs` value (`git show -s --format=%cs "$GITHUB_SHA"`). This makes the first imported publication date deterministic.

Commit only when `git status --porcelain` is non-empty. Force-with-lease is allowed only on the exact automation branch so repeat runs update it safely. Use `gh pr list --head "automation/import-$GAME_SLUG" --base main --state open` to update an existing PR, otherwise `gh pr create`. Authenticate `gh` through the same fine-grained token. Never use `pull_request_target`.

- [ ] **Step 4: Add workflow summaries for every failure boundary**

Each major step writes a short success/failure line to `$GITHUB_STEP_SUMMARY`. Failed source verification must occur before target checkout. Failed target checks must occur before commit/push. Include the branch and prospective PR title in the summary but never echo the credential.

- [ ] **Step 5: Verify and commit**

Run:

```bash
node --test scripts/__tests__/render-portfolio-pr.test.mjs
npm run test:portfolio-validator
ruby -e "require 'yaml'; YAML.load_file('.github/workflows/publish-game-to-portfolio.yml'); puts 'valid'"
```

Expected: tests PASS and YAML parses.

```bash
git add .github/workflows/publish-game-to-portfolio.yml scripts/render-portfolio-pr.mjs scripts/__tests__/render-portfolio-pr.test.mjs
git commit -m "ci: publish games to portfolio pull requests"
```

### Task 11: Normalize the Six Launch Games and Create Their Publication Assets

**Repository:** `/Users/fatihtoker/Code/idea-generator`

**Files:**
- Modify: each selected game's `package.json` and lockfile only when its scripts change.
- Modify: `games/chitin-colony/vite.config.ts`
- Modify: `games/sunset-circuit/vite.config.ts`
- Modify: `games/afterimage-heist/vite.config.ts`
- Modify: `games/voxel-crush/vite.config.js`
- Modify: `games/ink-slide/vite.config.ts`
- Modify: `games/snap-slice/vite/config.prod.mjs`
- Modify: `games/snap-slice/playwright.config.ts`
- Create: `games/{chitin-colony,sunset-circuit,afterimage-heist,voxel-crush,ink-slide,snap-slice}/portfolio.json`
- Create: `games/{chitin-colony,sunset-circuit,afterimage-heist,voxel-crush,ink-slide,snap-slice}/portfolio-cover.webp`
- Modify/Create: each game's `assets.md` or `assets-manifest.md` to record the final cover prompt and file.

**Interfaces:**
- Produces: six directories that pass `npm run portfolio:verify` and source validation independently.

- [ ] **Step 1: Add the normalized verification scripts**

Set these exact scripts:

| Game | `portfolio:verify` |
|---|---|
| Chitin Colony | `npm run build` |
| Sunset Circuit | `npm run test -- --run && npm run build` |
| Afterimage Heist | `npm run test:unit && npm run build && npm run test:e2e` |
| Voxel Crush | `npm run build && npm test` |
| Ink Slide | `npm run build && npm test` |
| Snap Slice | `npm run build-nolog && npm run test:e2e` |

Add `"test:e2e": "playwright test"` to Snap Slice. Change its Playwright `webServer.command` to `npm run dev-nolog` so automated publication never runs the template telemetry in `log.js`.

- [ ] **Step 2: Normalize nested-path builds**

Ensure each production Vite config contains `base: './'`. Chitin Colony and Snap Slice already satisfy this and should remain unchanged unless formatting requires it. Add the field to Sunset Circuit, Afterimage Heist, Voxel Crush, and Ink Slide. Remove Voxel Crush's `sourcemap: true` or set it to `false` so the publish validator does not reject source maps.

For each game run `npm run build`, serve `dist` under its final nested URL (`/playables/chitin-colony/`, `/playables/sunset-circuit/`, `/playables/afterimage-heist/`, `/playables/voxel-crush/`, `/playables/ink-slide/`, or `/playables/snap-slice/`), and verify no request resolves to root `/assets/`.

- [ ] **Step 3: Create the exact publication descriptors**

Create each JSON with `schemaVersion: 1` and the following values. Preserve the strings exactly unless a factual gameplay inspection proves one false; if so, stop and update the spec before changing product claims.

**`chitin-colony/portfolio.json`**

```json
{"schemaVersion":1,"slug":"chitin-colony","title":"Chitin Colony: Hex Empire","cardSummary":"Build a living ant colony by digging chambers, assigning castes, and evolving the swarm.","description":"Shape a subterranean hex empire, balance resources, hatch specialized ants, and evolve a resilient colony through active events and long-term progression.","seoTitle":"Play Chitin Colony: Hex Empire | Fatih Toker","seoDescription":"Play Chitin Colony, a browser strategy and colony-management game by Fatih Toker.","genre":"Strategy","tags":["Strategy","Simulation","Idle"],"supportedDevices":["desktop","tablet","mobile"],"controls":["mouse","touch"],"recommendedAspectRatio":"16:9","minimumViewport":{"width":390,"height":700},"coverAlt":"A crowned ant overlooks glowing hexagonal chambers in a warm underground colony."}
```

**`sunset-circuit/portfolio.json`**

```json
{"schemaVersion":1,"slug":"sunset-circuit","title":"Sunset Circuit","cardSummary":"Hold, drift, and release through stylized corners in a one-touch racing challenge.","description":"Race an authored line through vivid worlds, timing each drift entry and release while slow-motion feedback turns every corner into a readable skill test.","seoTitle":"Play Sunset Circuit | Fatih Toker","seoDescription":"Play Sunset Circuit, a one-touch browser drifting game by Fatih Toker.","genre":"Racing","tags":["Racing","Timing","Arcade"],"supportedDevices":["desktop","tablet","mobile"],"controls":["keyboard","mouse","touch"],"recommendedAspectRatio":"16:9","minimumViewport":{"width":390,"height":700},"coverAlt":"A compact racing car drifts around a glowing corner beneath a saturated sunset sky."}
```

**`afterimage-heist/portfolio.json`**

```json
{"schemaVersion":1,"slug":"afterimage-heist","title":"Afterimage Heist","cardSummary":"Record eight-second runs and cooperate with your past selves to crack a clockwork museum.","description":"Plan synchronized museum heists by recording deterministic actions, then coordinate translucent afterimages across compact isometric puzzle levels.","seoTitle":"Play Afterimage Heist | Fatih Toker","seoDescription":"Play Afterimage Heist, an isometric browser puzzle game about cooperating with recorded past selves.","genre":"Puzzle","tags":["Puzzle","Heist","Strategy"],"supportedDevices":["desktop","tablet","mobile"],"controls":["keyboard","mouse","touch","gamepad"],"recommendedAspectRatio":"9:16","minimumViewport":{"width":390,"height":700},"coverAlt":"A masked thief and translucent teal afterimages cross a brass clockwork museum gallery."}
```

**`voxel-crush/portfolio.json`**

```json
{"schemaVersion":1,"slug":"voxel-crush","title":"Voxel Crush","cardSummary":"Time the press, charge Frenzy, and shatter colorful voxel objects piece by piece.","description":"Alternate between precision timing and a rapid, consequence-free Frenzy phase in a tactile browser game filled with crunchy voxel destruction.","seoTitle":"Play Voxel Crush | Fatih Toker","seoDescription":"Play Voxel Crush, a timing and rapid-tap voxel destruction game by Fatih Toker.","genre":"Arcade","tags":["Arcade","Timing","Destruction"],"supportedDevices":["desktop","tablet","mobile"],"controls":["keyboard","mouse","touch","gamepad"],"recommendedAspectRatio":"16:9","minimumViewport":{"width":390,"height":700},"coverAlt":"A hydraulic press bursts through a colorful voxel object as cubes scatter across the workshop."}
```

**`ink-slide/portfolio.json`**

```json
{"schemaVersion":1,"slug":"ink-slide","title":"Ink Slide","cardSummary":"Dash a living drop of ink across parchment, dodging obstacles and collecting gold leaf.","description":"Guide a nimble ink drop through a tactile parchment world using quick directional dashes, precise movement, and momentum-aware obstacle runs.","seoTitle":"Play Ink Slide | Fatih Toker","seoDescription":"Play Ink Slide, a fast browser runner set across parchment and ink by Fatih Toker.","genre":"Runner","tags":["Runner","Arcade","3D"],"supportedDevices":["desktop","tablet","mobile"],"controls":["keyboard","mouse","touch"],"recommendedAspectRatio":"16:9","minimumViewport":{"width":390,"height":700},"coverAlt":"A glossy black ink drop races across parchment between wax seals and scattered gold leaf."}
```

**`snap-slice/portfolio.json`**

```json
{"schemaVersion":1,"slug":"snap-slice","title":"Snap Slice","cardSummary":"Wait for the perfect instant and split each moving shape with a single precise tap.","description":"A focused portrait arcade game about timing one clean slice as geometric targets move through a restrained, high-contrast arena.","seoTitle":"Play Snap Slice | Fatih Toker","seoDescription":"Play Snap Slice, a minimalist one-tap precision game by Fatih Toker.","genre":"Arcade","tags":["Arcade","Timing","Minimalist"],"supportedDevices":["desktop","tablet","mobile"],"controls":["mouse","touch"],"recommendedAspectRatio":"9:16","minimumViewport":{"width":390,"height":700},"coverAlt":"A sharp luminous line splits a dark geometric shape at the exact center of a portrait arena."}
```

- [ ] **Step 4: Generate six production covers using the image-generation skill**

Use the named game's existing screenshot/assets as visual references where available. Generate one text-free 1600×900 composition per game using the corresponding `coverAlt` scene and these art directions:

- Chitin Colony: warm premium 16-bit-inspired subterranean pixel art, umber soil, amber chambers, olive growth, no UI.
- Sunset Circuit: graphic top-down arcade racing art, coral sunset, indigo road, cream car, readable drift smoke.
- Afterimage Heist: bright 2.5D isometric clockwork museum, lacquered wood, brass, teal echoes, family-friendly caper mood.
- Voxel Crush: tactile stylized 3D workshop, hydraulic press at impact, saturated voxel debris, no gore.
- Ink Slide: premium parchment miniature, glossy ink, oxblood wax, restrained gold accents, top-down movement arc.
- Snap Slice: minimalist editorial geometry, charcoal field, warm-white target, one coral slice accent, portrait action centered in landscape safe area.

Convert with `sharp` using WebP quality 78, lower quality only as necessary to reach 600 KB, and record the final prompt plus output dimensions in the game's asset document. Do not stretch an existing square icon.

- [ ] **Step 5: Run every game's verification and contract validation**

Run these exact command groups:

```bash
cd /Users/fatihtoker/Code/idea-generator
for slug in chitin-colony sunset-circuit afterimage-heist voxel-crush ink-slide snap-slice; do
  cd "/Users/fatihtoker/Code/idea-generator/games/$slug"
  npm ci
  npm run portfolio:verify
  cd /Users/fatihtoker/Code/idea-generator
  node scripts/validate-portfolio.mjs --game-dir "games/$slug"
done
```

Expected: all six commands report valid contracts; every game test/build passes; nested assets return 200; browser console has no asset 404 or uncaught error.

- [ ] **Step 6: Commit normalized games in reviewable groups**

```bash
git add games/chitin-colony games/sunset-circuit
git commit -m "feat: prepare strategy and racing games for portfolio"
git add games/afterimage-heist games/voxel-crush
git commit -m "feat: prepare puzzle and arcade games for portfolio"
git add games/ink-slide games/snap-slice
git commit -m "feat: prepare runner games for portfolio"
```

### Task 12: Publish the Launch Catalog, Curate It, and Perform Final Verification

**Repositories:** both repositories plus GitHub/Vercel configuration.

**Files:**
- Modify through importer: `personal-website-next/content/projects.json`
- Create through importer: six `public/playables/<slug>/` trees and six covers.
- Modify: `personal-website-next/tests/e2e/portfolio.spec.ts`
- Modify: `personal-website-next/tests/e2e/play.spec.ts`
- Modify: `personal-website-next/README.md`

**Interfaces:**
- Produces: seven-project production catalog, three featured games, verified preview links, and operator documentation.

- [ ] **Step 1: Merge-order checkpoint**

Do not enable or run the source publisher until the target branch containing Tasks 1–8 has been reviewed and merged to `main`. Verify in Vercel project settings that the Git production branch is exactly `main` and that a normal target-repo PR creates a preview deployment.

- [ ] **Step 2: Configure the narrow source secret**

Create a fine-grained GitHub token restricted to `fatihtoker/personal-website-next` with only Contents read/write and Pull requests read/write. Save it in `idea-generator` as `PERSONAL_WEBSITE_AUTOMATION_TOKEN`. Do not place the token in Vercel or repository variables.

- [ ] **Step 3: Publish one canary game**

Run `publish-game-to-portfolio` for `chitin-colony`. Confirm:

1. source build/tests/contract pass;
2. target branch is `automation/import-chitin-colony`;
3. PR base is `main`;
4. target CI passes;
5. one `Portfolio Preview` comment appears with a `.vercel.app` URL;
6. preview catalog, detail page, and game iframe work on desktop and mobile;
7. direct `/playables/chitin-colony/index.html` loads with no 404s.

Do not merge automatically. Ask the user to approve and merge the canary PR.

- [ ] **Step 4: Prove idempotency before bulk publishing**

While the canary PR is still open, rerun the same slug. Expected: the same branch/PR updates, no duplicate PR/comment is created, and editorial fields remain unchanged. After this proof, use the user's merge approval.

- [ ] **Step 5: Publish the remaining five games**

Run the workflow separately for `sunset-circuit`, `afterimage-heist`, `voxel-crush`, `ink-slide`, and `snap-slice`. For each, wait for target CI and Vercel preview, play the core loop, report results, and leave merge approval to the user.

- [ ] **Step 6: Apply the locked editorial curation after all imports land**

Set `featured: true` only for Chitin Colony, Sunset Circuit, and Afterimage Heist. Set sort order exactly:

```text
10 Chitin Colony
20 Sunset Circuit
30 Afterimage Heist
40 Voxel Crush
50 Ink Slide
60 Snap Slice
70 LingoLink
```

Add E2E assertions for those featured names/order, six Games filter results, one Apps result, every detail route, one desktop play per game, Afterimage/Snap Slice portrait layouts, and an injected unsupported-device fixture at component-test level.

- [ ] **Step 7: Document operator workflow**

Replace the generic README with: architecture summary, local setup, commands, catalog paths, how to run the source GitHub workflow, required secret name/permissions, PR/preview lifecycle, update/idempotency behavior, rollback by reverting an import PR, production branch `main`, and a warning never to commit source-game files into the target.

- [ ] **Step 8: Run final target verification**

```bash
cd /Users/fatihtoker/Code/personal-website-next
npm ci
npm run validate:projects
npm test
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

Expected: seven projects, six playables, all unit/component tests green, lint clean, production build complete, desktop/mobile E2E green.

- [ ] **Step 9: Run final source verification**

```bash
cd /Users/fatihtoker/Code/idea-generator
npm ci
npm run build
npm run test:portfolio-validator
for slug in chitin-colony sunset-circuit afterimage-heist voxel-crush ink-slide snap-slice; do node scripts/validate-portfolio.mjs --game-dir "games/$slug"; done
```

Expected: root build and validator tests PASS; all six contracts report valid.

- [ ] **Step 10: Perform visual and production smoke review**

At 390×844, 768×1024, and 1440×900 inspect the home hero, filters, featured layout, all cards, LingoLink, every game detail, and every play shell. Confirm no clipped text, overflow, hidden action, broken cover, 404, console error, autoplay surprise, inaccessible focus, or motion that ignores reduced-motion. Verify the production deployment only after the user merges the final PR.

- [ ] **Step 11: Commit final target curation and documentation**

```bash
git add content/projects.json tests/e2e README.md
git commit -m "feat: launch browser game portfolio"
```

## Execution Checkpoints

1. Target Tasks 1–8 form one reviewable target-repository feature branch and PR.
2. Source Tasks 9–11 form one source-repository feature branch and PR.
3. Target must merge before the source publisher is enabled.
4. Chitin Colony is the canary; its repeat-run idempotency proof happens before any other import.
5. Every automation import remains a separate user-reviewed PR with a full-site Vercel preview.
6. The final curation/documentation change lands only after all six import PRs are merged.

## Spec Coverage Map

- Product positioning, English copy, minimal identity, and premium visual direction: Tasks 2–3.
- Unified Games/Apps catalog and bespoke LingoLink routing: Tasks 1, 3, 4, and 6.
- Standard detail routes, device compatibility, isolated play routes, and iframe policy: Tasks 4–5.
- SEO, sitemap, robots exclusions, performance boundaries, and accessibility: Tasks 2, 3, 5, and 6.
- Target publication contract, security checks, idempotency, editorial preservation, and rollback: Task 7.
- Required target CI and marker-based Vercel preview URL: Task 8.
- Future game-generation instructions and source contract enforcement: Task 9.
- Manual one-click cross-repository PR automation and narrow permissions: Task 10.
- Six launch-game descriptors, covers, build normalization, and game verification: Task 11.
- Canary proof, separate import PRs, final featured order, production smoke review, and operator docs: Task 12.

## Definition of Done

- All acceptance criteria in the approved design spec have a passing automated or recorded manual check.
- Both repositories are clean except for intentional committed changes.
- Target CI, source game verification, and Vercel preview reporting are green.
- The live site contains the approved seven-project catalog and no fake/sample projects.
- No workflow can merge or push directly to `main`.
