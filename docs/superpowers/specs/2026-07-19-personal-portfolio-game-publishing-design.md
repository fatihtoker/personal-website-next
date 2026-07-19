# Personal Portfolio and Game Publishing Design

**Date:** 2026-07-19

**Status:** Approved design

**Primary repository:** `fatihtoker/personal-website-next`

**Source repository:** `fatihtoker/idea-generator`

## 1. Purpose

Transform the nearly empty personal website into a polished, English-language portfolio centered on Fatih Toker's browser games while retaining room for non-playable applications and bespoke product landing pages such as LingoLink.

The system must also provide a one-click, GitHub Actions-based publishing path from a selected game in `idea-generator` to a pull request in `personal-website-next`. Every import pull request must include a playable full-site Vercel preview before it can be merged and deployed to production.

## 2. Product Positioning

The site is a personal brand and game showcase rather than a studio site or a traditional résumé.

The primary visitor goal is to browse the project catalog. The personal identity is intentionally minimal:

- Name: Fatih Toker
- Positioning line: “Full-stack developer turning spare-time ideas into games and useful apps.”
- Public links: GitHub at `https://github.com/fatihtoker` and email at `mailto:fatihhtoker@gmail.com`
- No résumé, employment timeline, skill matrix, or long-form biography in the initial release

All visitor-facing site copy is English.

## 3. Goals

- Deliver a distinctive, responsive landing page with a premium “digital playground” character.
- Present playable games and non-playable apps in one filterable Projects catalog.
- Give every playable game a standard detail page and a separate focused play page.
- Preserve support for bespoke landing pages, including the existing `/lingolink` route.
- Keep game engines and their dependencies isolated from the Next.js application runtime.
- Publish built games from `idea-generator` through reviewable pull requests, never direct production pushes.
- Provide a full-site Vercel preview URL on every import pull request.
- Make repeated imports of the same game safe and idempotent.
- Launch with six real browser games plus LingoLink.

## 4. Non-Goals

- Building or redesigning the six games' gameplay.
- Moving game source code into `personal-website-next`.
- Hosting game source packages as part of the Next.js dependency graph.
- Adding accounts, comments, ratings, favorites, leaderboards, payments, or a CMS.
- Adding full-text search for the initial seven-project catalog.
- Adding a résumé, blog, or detailed professional history.
- Automatically deleting projects from the target repository.
- Automatically merging import pull requests.
- Publishing directly to `main` from the source repository.
- Supporting multiple site languages in the initial release.

## 5. Repository Responsibilities

### 5.1 `idea-generator`

`idea-generator` is the source of truth for:

- Game source code
- Game dependencies and build configuration
- Game-specific tests
- The publication descriptor for each game
- The 1600×900 portfolio cover for each game
- Generation instructions that require future games to provide the publication descriptor and cover
- The manual cross-repository publishing workflow

### 5.2 `personal-website-next`

`personal-website-next` is the source of truth for:

- The personal portfolio interface and design system
- Project catalog ordering and featured selections
- Bespoke project landing-page routing
- Standard project detail and play-page templates
- Validated project records used by the site
- Built, deployable game bundles only
- Cross-repository import validation and application
- Pull-request CI and Vercel preview URL reporting

The target repository must not contain the games' TypeScript/JavaScript source trees, package manifests, lockfiles, or development dependencies. It stores only validated production output, covers, and catalog data.

## 6. Architectural Decision

Use manifest-driven static game bundles.

Each playable game is built in `idea-generator` and its production `dist` directory is copied to:

`public/playables/<slug>/`

Each game's entry point is therefore served at:

`/playables/<slug>/index.html`

Each project cover is stored at:

`public/project-covers/<slug>.webp`

A validated project manifest drives the landing page, filters, standard detail pages, metadata, sitemap, and play-page device checks. The manifest uses a discriminated content model so playable games and non-playable showcase projects cannot accidentally expose the wrong actions.

Game bundles run in an iframe on the dedicated play route. Phaser, Three.js, Vite, and other game runtime dependencies never enter the Next.js bundle.

## 7. Content Model

The catalog supports two project kinds.

### 7.1 `playable-game`

A playable game has:

- A standard detail route at `/games/<slug>`
- A dedicated play route at `/games/<slug>/play`
- A local static entry point at `/playables/<slug>/index.html`
- Explicit device and control support
- A visible `Play now` action only on compatible devices

### 7.2 `showcase`

A showcase represents a non-playable app, product, or game. It has:

- A standard project detail route or a bespoke `detailHref`
- No play route or play action
- The same cover, summary, category, tags, and SEO fields as the rest of the catalog where applicable

LingoLink is a `showcase` with the bespoke route `/lingolink`.

### 7.3 Required Site Manifest Fields

Every site project record must include:

- `schemaVersion`
- `kind`: `playable-game` or `showcase`
- `slug`
- `title`
- `cardSummary`
- `description`
- `category`: `game` or `app`
- A controlled list of `tags`
- `coverSrc`
- `coverAlt`
- `publishedAt`
- `featured`
- `sortOrder`
- SEO title and description

Playable games additionally require:

- `playablePath`
- `supportedDevices`: one or more of `desktop`, `tablet`, and `mobile`
- `controls`: one or more of `keyboard`, `mouse`, `touch`, and `gamepad`
- `recommendedAspectRatio`
- `minimumViewport`
- Source repository URL and imported source commit SHA

Showcases additionally require either a standard detail-page content definition or `detailHref`.

Site-only editorial values such as `featured`, `sortOrder`, and bespoke routing are owned by `personal-website-next`. Re-importing a game must not overwrite them.

## 8. Source Publication Contract

Every publishable game in `idea-generator/games/<slug>/` must contain:

- `portfolio.json`
- `portfolio-cover.webp`
- A production build that creates `dist/index.html`

The publication descriptor must supply:

- Schema version
- Slug matching the parent directory
- Display title
- Card summary
- Detail description
- SEO title and description
- Genre and controlled tags
- Supported devices
- Supported controls
- Recommended aspect ratio
- Minimum viewport
- Accessible cover alt text

The pipeline adds provenance, including the source repository and exact source commit SHA. Source metadata must not set target-site featured state, ordering, or bespoke routes.

### 8.1 Cover Contract

`portfolio-cover.webp` must:

- Be exactly 1600×900 pixels
- Use WebP format
- Be no larger than 600 KB
- Contain no marketing copy, CTA text, or small unreadable text
- Keep the main visual subject within a center-safe composition
- Represent the game's actual art direction rather than a generic placeholder
- Have a concise, meaningful `coverAlt` value in `portfolio.json`

The game-creation instructions in `idea-generator` must make both publication files mandatory for every newly created web game. Asset-generation guidance must include the cover requirement, dimensions, format, composition rule, and text prohibition.

### 8.2 Static Bundle Contract

The built game must:

- Include `dist/index.html`
- Resolve scripts, styles, fonts, audio, images, and other assets relative to its own nested directory
- Avoid root-absolute `/assets/...` references
- Contain no symbolic links
- Stay at or below 50 MiB total uncompressed size, with no individual file larger than 20 MiB
- Contain only `.html`, `.js`, `.css`, `.json`, `.webmanifest`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`, `.ico`, `.mp3`, `.ogg`, `.wav`, `.m4a`, `.mp4`, `.webm`, `.woff`, `.woff2`, `.ttf`, `.wasm`, `.bin`, `.glb`, and `.gltf` files
- Exclude source maps from the published bundle
- Build deterministically from the committed lockfile with `npm ci`

The initial implementation must normalize the selected games' Vite base-path behavior to satisfy this contract.

## 9. Information Architecture

### 9.1 Global Header

The header contains:

- Fatih Toker wordmark/name linked to `/`
- Projects anchor
- About anchor
- GitHub link
- Email link

The header is compact, keyboard accessible, responsive, and visually subordinate to the project imagery.

### 9.2 Home Page

The home page uses this order:

1. Hero with the positioning line and a primary action that scrolls to Projects
2. Featured Projects with two or three large editorial cards
3. Unified Projects catalog
4. Minimal About/footer area with GitHub and email

The catalog filters are:

- All
- Games
- Apps

Search is omitted because it adds little value for the initial catalog size.

Project cards expose actions by content kind:

- Playable games: `View game`
- Showcases: `View project`

Hover styling may enhance cards but cannot contain information unavailable to keyboard or touch users.

### 9.3 Standard Game Detail Page

`/games/<slug>` contains:

- Cover artwork
- Title, category, tags, and description
- Supported-device badges
- Control information
- `Play now` action when the current device category is supported
- A clear compatibility message when it is not
- Navigation back to the catalog

The detail page does not load the game iframe.

### 9.4 Play Page

`/games/<slug>/play` provides:

- A focused game frame
- Back-to-details control
- Reload control
- Fullscreen control
- A loading state
- A clear load-failure state with retry
- A compatibility guard that prevents iframe loading on unsupported device categories

The iframe loads `/playables/<slug>/index.html` only after compatibility is established. It uses a documented sandbox and permissions policy that supports the games' required storage, audio, input, and fullscreen behavior while preventing unwanted top-level navigation.

Device classification is viewport-based and updates when the viewport crosses a boundary: widths below 768 CSS pixels are `mobile`, widths from 768 through 1023 are `tablet`, and widths of 1024 or more are `desktop`.

The iframe uses `sandbox="allow-scripts allow-same-origin allow-pointer-lock"`, enables `autoplay`, `fullscreen`, and `gamepad` through its permissions policy, and sets `allowFullScreen`. It does not receive top-navigation or popup permissions.

### 9.5 Bespoke Project Pages

Bespoke routes remain independent implementations. Their presence in the catalog is controlled by `detailHref`. The initial implementation preserves `/lingolink` and connects it to the unified catalog without forcing it into the standard game-detail template.

## 10. Visual Direction

The design language is a premium digital playground:

- Dark graphite surfaces rather than pure black
- Warm off-white primary text
- Restrained, vivid accent colors drawn from project covers
- Large editorial typography
- Asymmetric featured-project composition
- Strong image hierarchy
- Generous spacing and purposeful motion

Avoid:

- Generic neon cyberpunk styling
- Excessive glassmorphism
- Dense dashboard-like grids
- Decorative motion that competes with project artwork
- Generic gradient-heavy “AI portfolio” aesthetics

The site must feel energetic enough for a game portfolio and refined enough for a full-stack developer's personal brand.

## 11. Responsive and Accessible Behavior

- Support current desktop, tablet, and mobile viewport classes.
- Use a mobile navigation treatment with controls at least 44×44 CSS pixels.
- Maintain WCAG AA contrast for text and interactive controls.
- Provide visible keyboard focus states.
- Use semantic landmarks and a logical heading hierarchy.
- Provide meaningful image alt text.
- Respect `prefers-reduced-motion` for all non-essential motion.
- Ensure catalog filtering is operable by keyboard and announced appropriately.
- Do not make hover the only way to discover an action or state.
- Keep the play-page controls accessible outside the iframe.

## 12. SEO and Indexing

- Provide unique title and description metadata for the home page and every detail page.
- Generate canonical URLs.
- Generate Open Graph and Twitter card data using project covers.
- Generate the sitemap from the validated project manifest.
- Include standard detail and bespoke project pages in the sitemap.
- Exclude `/games/<slug>/play` and `/playables/` from search indexing.
- Ensure game bundle HTML cannot replace or conflict with the parent site's canonical metadata.

## 13. Performance Principles

- Never load a game bundle on the home page or standard detail page.
- Use responsive Next.js image optimization for project covers outside game bundles.
- Keep most catalog and detail rendering in server components.
- Restrict client components to interactive filters, responsive navigation, device detection, and play controls.
- Lazy-load below-the-fold imagery.
- Prevent layout shift by declaring stable image aspect ratios.
- Treat each game bundle independently in performance reporting so one large game does not obscure site performance.

## 14. Cross-Repository Publishing Workflow

Add a manually dispatched workflow to `idea-generator` with one required input: `game_slug`.

The workflow must:

1. Validate the slug format and `games/<slug>` directory.
2. Install the selected game's dependencies with `npm ci`.
3. Run all applicable committed unit and end-to-end tests through a normalized portfolio verification command.
4. Run the production build.
5. Validate `dist`, `portfolio.json`, and `portfolio-cover.webp` against the publication contract.
6. Check out `personal-website-next` using a narrowly scoped credential.
7. Run the target repository's idempotent import tool.
8. Run target manifest validation, unit tests, lint, production build, and a portfolio smoke test.
9. Commit the resulting bundle, cover, metadata, and provenance on `automation/import-<slug>`.
10. Push or update that branch and open or update a pull request against `main`.

Concurrency is grouped by game slug. A repeated run for a slug with an open automation pull request updates the existing branch and pull request rather than creating duplicates.

The pull-request body must report:

- Whether the operation is an import or update
- Source repository and source commit SHA
- Game bundle size
- Cover validation result
- Source build and test results
- Target validation, test, lint, and build results
- The expected Vercel preview status

The workflow never merges the pull request and never pushes directly to `main`.

## 15. Authentication and Permissions

Store a fine-grained credential in the `idea-generator` repository secrets. It must be restricted to `personal-website-next` and grant only:

- Contents: read and write
- Pull requests: read and write

The credential must not be printed, copied into generated files, embedded in pull-request text, or exposed to game build scripts beyond the step that checks out and publishes to the target repository.

The target repository's workflow token requires only the permissions needed to read deployment status and create or update a pull-request comment.

## 16. Vercel Preview Integration

`personal-website-next` is hosted on Vercel. The repository currently uses `main`; no `master` branch exists. The Vercel project must be verified once to ensure its production branch is `main`.

When an import pull request opens or updates:

1. The existing Vercel Git integration builds the entire Next.js site.
2. Vercel publishes a preview deployment and reports a GitHub deployment status with an environment URL.
3. A `deployment_status` workflow in `personal-website-next` finds the pull request associated with the deployed commit.
4. It creates or updates one marker-based `Portfolio Preview` comment containing the playable full-site preview URL.

The comment is updated in place to avoid notification spam. A failed preview remains a required failed check and blocks merge. Surge is not part of the selected architecture because the Vercel preview validates both the imported game and its real site integration.

## 17. Idempotency and Editorial Preservation

The target import tool uses the slug as the stable identity.

For a new slug, it:

- Adds the validated project record with safe default editorial values
- Copies the cover
- Copies the static bundle
- Records provenance

For an existing slug, it:

- Atomically replaces the static bundle
- Replaces source-owned metadata and cover
- Updates provenance
- Preserves target-owned `featured`, `sortOrder`, and bespoke routing values

The tool must reject invalid slugs, directory traversal, unexpected symbolic links, duplicate manifest slugs, invalid metadata, disallowed file types, and incomplete copy operations. It must not provide a delete mode.

## 18. Error Handling

### 18.1 Source Validation Failure

No target branch or pull request is created. The workflow summary identifies the failing contract field, asset, test, build command, or path.

### 18.2 Target Validation Failure

No publish commit is pushed. The workflow summary identifies the target validation, test, lint, build, or import failure.

### 18.3 Existing Pull Request

The workflow updates the existing automation branch and pull request for the same slug.

### 18.4 Vercel Failure

The pull request stays open, the preview check remains failed, and merge is blocked. The pipeline never falls back to production deployment.

### 18.5 Runtime Game Load Failure

The play page displays a retryable error state and keeps navigation controls usable. It must not leave the user on a blank page.

### 18.6 Unsupported Device

The play page does not create the iframe. It explains the supported devices and offers navigation back to the detail page or catalog.

## 19. Test Strategy

### 19.1 Manifest and Contract Tests

Test:

- Required fields and discriminated project kinds
- Unique and path-safe slugs
- Controlled tags, devices, and controls
- Valid routes and local paths
- Cover dimensions, format, size, and existence
- Playable bundle entry-point existence
- Relative asset references
- Source provenance after import

### 19.2 Import Tool Tests

Test:

- New-game import
- Existing-game update
- Preservation of editorial fields
- Atomic bundle replacement
- Duplicate slug rejection
- Invalid descriptor rejection
- Missing cover or `dist/index.html` rejection
- Path traversal and symbolic-link rejection
- Root-absolute asset reference rejection
- No partial target changes after failure

### 19.3 UI Tests

Test:

- All, Games, and Apps filters
- Correct card action by project kind
- Featured-project ordering
- Supported-device badges and control labels
- Compatibility decision behavior
- LingoLink routing through its bespoke `detailHref`

### 19.4 End-to-End Tests

Test:

- Home → Games filter → game detail → play
- Home → Apps filter → LingoLink
- Compatible-device iframe loading
- Unsupported-device message without iframe loading
- Back, reload, and fullscreen controls
- Game-load failure and retry state
- Keyboard navigation through the primary journey
- Critical accessibility checks on home, detail, and play pages

### 19.5 Required Pull-Request Checks

Every site and import pull request must pass:

- Manifest validation
- Unit/component tests
- Lint
- Next.js production build
- Playwright portfolio smoke test
- Successful Vercel preview deployment

The source publishing workflow must also report the selected game's own build and normalized test result.

## 20. Initial Catalog

The initial playable catalog contains:

1. Chitin Colony (`chitin-colony`)
2. Sunset Circuit (`sunset-circuit`)
3. Afterimage Heist (`afterimage-heist`)
4. Voxel Crush (`voxel-crush`)
5. Ink Slide (`ink-slide`)
6. Snap Slice (`snap-slice`)

LingoLink is included as the initial non-playable `showcase` project and retains `/lingolink`.

Each of the six source games must be brought into compliance with the same publication contract before import. Their current build and test conventions are not assumed to be identical.

## 21. Delivery Sequence

1. Implement the target site's design system, data contract, catalog, detail/play routes, SEO, tests, and import tool.
2. Register LingoLink as a showcase without replacing its bespoke page.
3. Verify Vercel tracks `main` as the production branch and produces pull-request previews.
4. Update `idea-generator` game-creation guidance with the descriptor and cover contract.
5. Add the source validator, normalized verification entry point, and cross-repository publishing workflow.
6. Add compliant descriptors and covers and normalize nested-path builds for the six launch games.
7. Publish each launch game through its own automation pull request.
8. Apply one final target-site editorial change that features Chitin Colony, Sunset Circuit, and Afterimage Heist and sets the catalog order to Chitin Colony, Sunset Circuit, Afterimage Heist, Voxel Crush, Ink Slide, Snap Slice, then LingoLink.
9. Run responsive, accessibility, route, game-load, and production smoke tests.

The site implementation must land before the source workflow is enabled, because the workflow depends on the target import tool and validation commands.

## 22. Acceptance Criteria

- `/` presents the approved premium digital-playground landing page in English.
- The hero uses the approved positioning line.
- The Projects catalog filters between all projects, games, and apps.
- LingoLink appears in the catalog and opens `/lingolink` without a play action.
- Each imported game has a standard detail page and separate play page.
- Game code is not loaded before the play page is reached on a compatible device.
- Unsupported devices receive an explanatory state instead of an iframe.
- Each game runs from a nested local static bundle without broken assets.
- Every project has a compliant 1600×900 WebP cover and meaningful alt text.
- The source workflow accepts a game slug and opens or updates a target pull request.
- Re-importing a game preserves site-owned editorial fields.
- Every import pull request receives a full-site Vercel preview URL comment.
- No automation writes directly to `main` or merges a pull request.
- Production deployment occurs only after an approved pull request is merged to `main`.
- The selected six games and LingoLink form the initial catalog.
- Required validation, tests, lint, build, accessibility smoke checks, and Vercel preview all pass before merge.
