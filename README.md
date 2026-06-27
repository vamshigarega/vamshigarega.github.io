# Vamshi Krishna Garega - Portfolio

Personal portfolio of **Vamshi Krishna Garega**, an AI Engineer building LLM
agents, MCP servers, and large-scale data systems. Currently a Software Engineer
at Apple.

Live: <https://vamshigarega.github.io>

## Built with

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Motion](https://motion.dev/) for animation
- [lucide-react](https://lucide.dev/) icons

The design language is "Apple-grade Noir": a near-black canvas, glassmorphism,
restrained motion, and a single cool accent.

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
**GitHub Actions** (Settings -> Pages).

## Editing content

All copy and data live in [`src/data/content.ts`](src/data/content.ts).
Components are presentational; update content there.
