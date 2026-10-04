# CLAUDE.md

Guidance for Claude (and any AI agent) working in this repository.

## What this is

The personal portfolio of **Vamshi Krishna Garega**, an AI Engineer (currently a
Software Engineer at Apple via OSI Engineering). It is a single-page site that
deploys to GitHub Pages at <https://vamshigarega.github.io>.

The site is built around one idea: **the platform he built is the portfolio.**
The top of the page is a scroll-driven 3D tour of that platform (teams, AI
agents, the MCP gateway, MCP servers, the data fleet), and everything below it
is evidence: shipped work, experience, toolkit, research.

The design language is **"Keynote"**: true black (or near-white in light mode),
large tight display type, small monospace labels, and a single spectrum
gradient spent on the moments that matter (one phrase in the headline, the
gateway in the 3D scene, key figures, the rim of a hovered card).

One material runs the whole page: **gloss**. The 3D scene is glossy objects
under studio light, and every section below it is built from the same thing in
CSS (`.gloss` cards with a lit edge, a cursor glare, a spectrum rim, and a
tilt).

**Every section gets its own 3D picture, and the same picture is never shown
twice.** Vamshi's words when the platform diagram came back in two lower
sections: "same picture everywhere the diagram". So the platform stack belongs
to the hero tour only. Before-and-after is three stacks of slabs you can
count, contact is a paper plane in flight, the case cards turn over in 3D, and
the toolkit is a 3D ring. His other standard: the bottom of the page must be
as alive and as interactive as the top. Real 3D and things to touch all the
way down, never a showpiece hero over flat sections. Professional first:
every effect supports content, none competes with it.

The reader is a recruiter, a hiring manager, or an interviewer. So the actions
they need (resume, email, copy the address, LinkedIn) are one click away at the
top and at the close, every figure says what it measures, and each case card
answers the follow-up question ("how does it work?") on its back.

## Tech stack

- **Vite** + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (via `@tailwindcss/vite`; tokens are defined with `@theme`
  in `src/index.css`, not a `tailwind.config.js`)
- **three.js** for the 3D platform scene, loaded as its own chunk through a
  dynamic import so it never blocks first paint
- **lucide-react** + **react-icons** for icons
- **Self-hosted variable fonts** (`@fontsource-variable/inter` with optical
  sizing, `@fontsource-variable/jetbrains-mono`)
- No animation library: scroll reveals are CSS transitions driven by a native
  IntersectionObserver.

## Commands

```bash
npm install     # install dependencies
npm run dev     # local dev server (http://localhost:5173)
npm run build   # type-check (tsc -b) + production build to dist/
npm run preview # serve the production build locally
```

## Project structure

```
index.html                 Vite entry, SEO / link-preview meta, JSON-LD
src/
  main.tsx                 React root, font imports
  App.tsx                  Page order
  index.css                Tailwind import + Keynote tokens, type, and primitives
  data/content.ts          SINGLE SOURCE OF TRUTH for all copy + metrics
  three/kit.ts             What every 3D stage shares: renderer, studio light,
                           sizing, staged start-up, the loop, drag to turn
  three/PlatformScene.ts   Hero tour: the platform, five tiers, real counts
  three/TowersScene.ts     Before and after: three stacks that build
  three/PlaneScene.ts      Contact: a paper plane with ribbons of light
  hooks/useActiveSection.ts  Scrollspy for the top bar
  hooks/useGloss.ts        Cursor glare and tilt for any `.gloss` element
  components/
    TopBar.tsx             Flat bar: name, sections, theme toggle, resume
    Tour.tsx               Hero + four chapters beside (or under) the pinned stage
    Stage.tsx              Hosts one 3D scene (`scene` prop), lazy-loads it,
                           pins the tour's tier callouts
    Shift.tsx              Before and after: the ledger beside three stacks
                           that build, over veiled server footage
    Shipped.tsx            Case cards that turn over: the outcome on the front,
                           how it works on the back
    About.tsx              Portrait, profile, four facts
    Experience.tsx         Every role, nothing hidden behind a click
    Principles.tsx         Cinema band: how I work, over editor footage
    Toolkit.tsx            Two 3D rings of tool marks, then the full list
    Research.tsx           Publication, education, honors
    Projects.tsx           Earlier independent and academic projects
    Contact.tsx            The close: actions beside the paper plane, then
                           one console holding the form and the map
    ContactForm.tsx, Map.tsx
    Footer.tsx             Compact: name, sections, links
    GlossCard.tsx          THE card: reveal, light sweep, tilt, glare, spectrum rim
    Counter.tsx            Figures that count up when they scroll into view
    BackdropVideo.tsx      Lazy, in-view-only looping footage with a poster
    Picture.tsx            AVIF with JPEG fallback, intrinsic size reserved
    Reveal.tsx, SectionHead.tsx, ThemeToggle.tsx   Shared helpers
  assets/img/              Portrait and band posters (AVIF + JPEG)
  assets/video/            Band loops (H.264 mp4)
public/
  resume/                  Resume PDF (served as-is)
  og-image.jpg             1200x630 link-preview card (a capture of the hero)
  favicon.svg, robots.txt, sitemap.xml
.github/workflows/deploy.yml  Builds and deploys to GitHub Pages on push to main
```

## How the tour works

`Tour.tsx` renders the hero and the chapters in one column and pins `Stage`
beside it (large screens) or above it (small screens). On scroll it measures
where each chapter sits relative to the reader's eye line and sends one number
to the scene: `0` is the overview, `1..4` are the chapters, fractions are the
transitions. `PlatformScene.ts` holds one keyframe per chapter (camera height,
zoom, how far the stack opens, turn, and which tiers are lit) and eases toward
whatever that number says. Scrolling is never hijacked.

The scene's counts are real and must stay in step with `content.ts`: 8 team
tiles, 9 agent cubes, 1 gateway, 13 server cubes, 350 pods in 9 blocks.

## The three 3D scenes

`Stage` takes a `scene` and loads that scene's own small chunk on top of the
shared three.js chunk. All three extend `StageBase` in `kit.ts`.

- **platform** (`PlatformScene`, the hero tour): described above. Hovering
  lights the tier under the cursor and clicking it opens that tier's chapter.
  Picking raycasts the actual meshes first (what you point at is what you get)
  and falls back to the tier's footprint for the gaps between objects.
- **towers** (`TowersScene`, in `Shift.tsx`): three stacks, one slab per real
  thing. Silver slabs are what existed when he joined (1 AI agent, 0 MCP
  servers, 1 team); colored slabs are what was added, up to 9, 13 and 8.
  `setProgress(0..1)` drops them in one at a time, and `Shift` drives that
  from the stage's own scroll position: nothing added as it enters, complete
  once it is centered. A count rides above each stack (`towerLabels` in
  `content.ts`). These numbers are the `shift` rows; keep the two in step.
  With reduced motion the chart is simply shown complete.
- **plane** (`PlaneScene`, in `Contact.tsx`): a folded paper plane in the
  spectrum colors with a ribbon of light off each wing tip. It leans toward
  the cursor, a click rolls it, and when the contact form succeeds
  (`ContactForm` calls `onSent`, `Contact` calls `stage.signal("sent")`) it
  leaves the frame and a fresh one glides in.

Every scene can be dragged to turn it (the canvas sets `touch-action: pan-y`,
so a vertical swipe still scrolls the page), and it coasts and settles when
released.

Start-up is staged so that building a scene never drops a frame: a scene's
constructor only makes geometry, then `prepare()` builds the reflection map
and compiles the shaders asynchronously, each in its own task, and nothing is
drawn before it resolves. A stage is built when it comes within 900px of the
viewport. The two lower stages use a smaller shadow map and pixel budget, and
they float on the page, so their canvases fade out at the frame
(`.stage-soft`) and a ground shadow never ends in a straight line.

Adding a section that needs 3D: write a new scene on `StageBase`, give it a
name in `Stage.tsx`, and make it a different picture from the ones above.
Studio light washes a pure spectrum color out to pastel, so paint goes on
darker than the CSS color it is meant to match (see `PAINT` in the scenes).

## Content rules (important, from Vamshi)

- **Edit copy in `src/data/content.ts`.** Components are presentational.
- **Strictly NO em dashes or en dashes.** Use a plain hyphen, a comma, or a
  period. This includes anything that LOOKS like one: no short horizontal
  lines as bullet markers, list prefixes, or callout leaders. Bullets are dots.
- **Never invent metrics or projects.** Every number here is real and comes
  from his own work record.
- **Every metric says what it measures**: unit, scope, and time window (for
  example "505 queries in a 30-day window", never a bare "505+").
- **Internal names stay internal.** Team names, system names, hostnames,
  product code names, and colleagues are never published; describe the kind of
  system instead ("an internal issue tracker", "a managed vector database").
- Keep the tone plain and professional. Case notes follow problem, what I
  built, result. Each one also has a `flow`: the mechanism in three to five
  short steps, shown on the back of its card. The steps come from the same
  work record as everything else; do not embellish them.

## Layout rules

- **No holes.** A grid never ends with a lone card beside an empty cell (run
  the odd card full width), and a card is never stretched far past its content
  to match a taller neighbor (pair long with short, or change the split).
- **Both themes are one page each.** Nothing stays dark on the light theme or
  light on the dark one. The footage bands are veiled in the page background
  (`--band-veil`) and fade out at their top and bottom edges.
- Section rhythm is `py-16 sm:py-20 lg:py-28`; heading to content is
  `mt-10 lg:mt-14`. Keep new sections on it.
- **The page ends on purpose.** The close is the contact block (invitation and
  actions beside the paper plane), one console holding the form and the map, and
  a compact footer. No separate full-bleed map band, no oversized wordmark, no
  empty band before the footer.
- Nothing may scroll sideways at 320px. Check 320, 390, 820, and 1440.

## Media rules

- **Images** ship as AVIF with a JPEG fallback through `Picture.tsx`. Keep
  pixel dimensions even: an AVIF with an odd height renders blank in Chrome.
- **Footage** is short, silent, seamless H.264 loops (1280x720, 24 fps, about
  7 s, about 300 KB each); the poster is the first frame of the same clip.
  `BackdropVideo.tsx` downloads a clip only when its band nears the viewport,
  plays it only while on screen, and skips it for reduced motion or Save-Data.
- Current clips are from Pexels (free to use, no attribution required):
  `band-servers` = video 7140928, `band-code` = video 11274341. Only use
  footage whose license clearly allows use on a website.

## Performance rules

- There are three WebGL stages (platform, towers, plane), each with its own
  context. A stage renders only while it is on screen and the tab is
  visible. It draws at no less than 2x the CSS size (a 1x canvas looks soft
  and aliased) and no more than 3x, inside a pixel budget. Geometry is
  instanced, there is one soft shadow map, and no post-processing. Reduced
  motion freezes its autonomous motion. If WebGL is unavailable the same five
  tiers render as plain plates.
- Pale glossy objects dissolve into a white page, so materials carry a
  light-theme variant (see `physical()` in `PlatformScene.ts`), and the stack
  gets a ground shadow in light mode.
- Nothing above the fold waits on an image: the hero is type plus the scene.
- `Reveal` ends with `transform: none`, so no element stays promoted to its
  own layer after it has appeared.
- The tool rings are CSS 3D, not WebGL: two rotating parents, static pills.
  Each ring carries its own share of the marks so none shows twice at once.
- The bar to hold: a full-page scroll of the production build with no frame
  over 25 ms and no long task. Measure it after touching the scene.
- The page sets `scroll-behavior: smooth`. In a scripted test, scroll with
  `scrollTo({ top, behavior: "instant" })`; a `scrollBy` on every frame keeps
  restarting the smooth scroll and barely moves.

## Workflow rules (important, from Vamshi)

- **Do NOT `git commit`, push, or open/merge a PR unless Vamshi explicitly says
  so.** He previews locally, confirms, then raises the PR to `main` and merges to
  production himself.
- Work on a feature branch and leave the tree ready for local preview.
- Keep everything in-repo; install any new tooling as local dependencies.

## Deployment

Deployment is via GitHub Actions (`.github/workflows/deploy.yml`): on push to
`main` it runs `npm ci && npm run build` and publishes `dist/` to Pages.
The repo's Pages source must be set to **GitHub Actions** (Settings, then Pages).
