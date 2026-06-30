# Prototype guide for Claude Code

Web-based dashboard for real-time monitoring of mixed-fleet assets (ships, drones, airplanes) with mock data, map/list views, and filtering by type and status.

The source PRD / Epic: https://bytecubed.atlassian.net/wiki/spaces/EA/pages/4658692098/PRD+Fleet+Status+Dashboard+2026-06-30

## How this repo is built

This prototype is built in two phases:

1. **Primary build** — `.github/workflows/build.yml` runs you (Claude Code) once to
   build as much of the product as possible, committed directly to the default branch.
2. **Follow-on issues** — after the primary build, each item below is filed as a GitHub
   issue. `.github/workflows/claude.yml` then runs you to implement that one issue as an
   incremental change on top of the default branch and open a pull request. Those pull
   requests are reviewed and merged by a human — do not merge them yourself.

## Live deployment (GitHub Pages)

`.github/workflows/pages.yml` deploys this repo to GitHub Pages on every push to the
default branch, publishing to https://AgileDefenseEmbeddedAI.github.io/fleet-status-dashboard/. The deploy auto-detects what to serve: it
builds a Node project that has a `build` script and publishes its output (`dist`/`build`/
`out`/`public`), otherwise it serves a static directory containing `index.html`, and
otherwise falls back to a landing page generated from the README. **To make the live site
useful, give the prototype a web-servable front end**: a `build` script that emits static
files into one of those directories, or a static `index.html` at the repo root or in
`public/`. A pure backend with no static entry point still deploys (the README fallback),
it just won't show the product.

## Planned follow-on work

These will be filed as issues after the primary build, so you don't need to complete
them during the primary build — just leave a clean foundation they can build on:

1. Implement map view with asset markers and type-based icons
2. Build asset list sidebar with status badges and metadata display
3. Add filter bar for asset type and status with sub-second response
4. Implement view toggle (map/list) and layout persistence
5. Create configurable mock data scenarios for testing different fleet compositions
6. Add auto-refresh simulation with configurable intervals
7. Optimize dashboard for sub-3-second page load and measure performance

## Tech stack & conventions


**Tech Stack:**
- Frontend: React 18 + TypeScript (Vite for fast builds)
- Map library: Leaflet.js with OpenStreetMap (lightweight, no API key required)
- Styling: Tailwind CSS for rapid prototyping
- State management: React hooks (useState/useContext) — keep it simple
- Mock data: JSON fixture in `src/data/mockFleet.ts`, easily configurable for test scenarios

**Running the prototype:**
```bash
npm install && npm run dev
```
Runs on http://localhost:5173 with fast refresh.

**Key conventions:**
- Keep mock data structure flat: { id, name, type (ship/drone/airplane), status (active/idle/maintenance/offline), lat, lng, lastUpdate }
- Use React components for reusability: AssetList, MapView, FilterBar, StatusBadge
- No backend needed — all data sourced from local fixtures
- Aim for clean, scannable UI with asset cards and a map sidebar for geographic context
- Ensure filtering is sub-second (in-memory array operations)
- Use Leaflet markers with custom icons per asset type for visual distinction


## Working agreement

- Build the simplest thing that satisfies the goal — this is a prototype, not
  production. Favor a working end-to-end slice over breadth.
- Keep the project runnable at every step. Document any new setup/run command in the
  README under a "Running" section.
- For follow-on issues, open one pull request per issue and reference the issue with
  "Closes #<number>". Never merge your own pull request.
- Don't introduce secrets or external services that require credentials the repo
  doesn't have.
