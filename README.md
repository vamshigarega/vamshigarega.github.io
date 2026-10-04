# Vamshi Krishna Garega: Portfolio

Personal portfolio of **Vamshi Krishna Garega**, an AI Engineer building LLM
agents, MCP servers, and large-scale data systems. Currently a Software Engineer
at Apple.

Live: <https://vamshigarega.github.io>

## Built with

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [three.js](https://threejs.org/) for the 3D platform tour
- [lucide-react](https://lucide.dev/) icons
- Self-hosted variable fonts (Inter, JetBrains Mono)

The page opens with a scroll-driven 3D tour of the platform described in the
copy: teams, AI agents, the MCP gateway, MCP servers, and the data fleet. The
model can be dragged, hovered, and clicked. Each later section has its own 3D
picture: stacks that build from 1 agent to 9 in the before-and-after section,
case cards that turn over to show how each piece of work operates, a ring of
tool marks, and a paper plane that takes off when the contact form is sent.

The 3D engine loads after first paint and starts up in small steps so it never
drops a frame, footage loads only when scrolled into view, images ship as AVIF
with JPEG fallbacks, and motion respects reduced-motion settings.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes it to GitHub Pages. The repository's Pages source must be set to
**GitHub Actions** (Settings, then Pages).

## Editing content

All copy and data live in [`src/data/content.ts`](src/data/content.ts).
Components are presentational; update content there.
