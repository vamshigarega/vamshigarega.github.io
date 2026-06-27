# CLAUDE.md

Guidance for Claude (and any AI agent) working in this repository.

## What this is

The personal portfolio of **Vamshi Krishna Garega**, an AI Engineer (currently a
Software Engineer at Apple via OSI Engineering). It is a single-page site that
deploys to GitHub Pages at <https://vamshigarega.github.io>.

It was rebranded in 2026 from a legacy static Bootstrap page to a modern
component-based app. The aesthetic is **"Apple-grade Noir"**: a near-black
canvas, glassmorphism, generous whitespace, restrained motion, and a single
cool accent. The goal is a classy, professional brand that impresses engineers,
recruiters, and interviewers.

## Tech stack

- **Vite** (build tool + dev server)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (via `@tailwindcss/vite`; tokens are defined with `@theme`
  in `src/index.css`, not a `tailwind.config.js`)
- **motion** (Framer Motion) for scroll-reveal animations
- **lucide-react** for icons

## Commands

```bash
npm install     # install dependencies
npm run dev     # local dev server (http://localhost:5173)
npm run build   # type-check (tsc -b) + production build to dist/
npm run preview # serve the production build locally
```

## Project structure

```
index.html                 Vite entry (links /src/main.tsx)
src/
  main.tsx                 React root
  App.tsx                  Section composition / page order
  index.css                Tailwind import + Apple-Noir design tokens (@theme)
  data/content.ts          SINGLE SOURCE OF TRUTH for all copy + metrics
  components/
    Background.tsx         Ambient aurora + grid + grain backdrop
    Navbar.tsx             Sticky glass nav (+ mobile menu)
    Hero.tsx               Landing hero
    Marquee.tsx            Scrolling tech strip
    About.tsx              Portrait + bio + stats
    Experience.tsx         Vertical timeline
    Skills.tsx             Categorized skill grid
    Projects.tsx           Project cards
    Research.tsx           Publication + education + honors
    Contact.tsx            CTA + contact links
    Footer.tsx
    Section.tsx, Reveal.tsx  Shared layout + animation helpers
  assets/img/              Portrait + project images (imported, hashed by Vite)
public/
  resume/                  Resume PDF (served as-is)
  favicon.svg
.github/workflows/deploy.yml  Builds and deploys to GitHub Pages on push to main
```

## Content rules (important, from Vamshi)

- **Edit copy in `src/data/content.ts`.** Components are presentational; do not
  hardcode strings in them.
- **Strictly NO em dashes (—) or en dashes (–).** Use a plain hyphen " - ".
- **Never invent metrics or projects.** Every number here is real and defensible
  (e.g. 9 AI agents, 13+ MCP servers, central gateway 505+ queries at 95.6%
  success). Do not add figures that are not already sourced.
- Keep the tone classy and professional. No filler like "added 1000 LOC".

## Workflow rules (important, from Vamshi)

- **Do NOT `git commit`, push, or open/merge a PR unless Vamshi explicitly says
  so.** He previews locally, confirms, then raises the PR to `main` and merges to
  production himself.
- Work on a feature branch and leave the tree ready for local preview.
- Keep everything in-repo; install any new tooling as local dependencies.

## Deployment

Deployment is via GitHub Actions (`.github/workflows/deploy.yml`): on push to
`main` it runs `npm ci && npm run build` and publishes `dist/` to Pages.

**One-time setting:** in the GitHub repo, set
**Settings -> Pages -> Build and deployment -> Source = "GitHub Actions".**
Until that is switched from the old "Deploy from a branch", the Actions workflow
will not publish.
