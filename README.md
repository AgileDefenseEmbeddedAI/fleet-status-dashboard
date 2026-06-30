# Fleet Status Dashboard

Web-based dashboard for real-time monitoring of mixed-fleet assets (ships, drones, airplanes) with mock data, map/list views, and filtering by type and status.

**Source PRD / Epic:** https://bytecubed.atlassian.net/wiki/spaces/EA/pages/4658692098/PRD+Fleet+Status+Dashboard+2026-06-30

**Live site:** https://AgileDefenseEmbeddedAI.github.io/fleet-status-dashboard/ (deployed from the default branch via GitHub Pages)

> ⚙️ This is an auto-generated prototype. A primary build workflow builds the
> foundation directly on the default branch; follow-on tickets live as GitHub issues
> and [Claude Code](https://github.com/anthropics/claude-code-action) implements each
> one as a pull request. Pull requests are merged by a human. Every push to the default
> branch deploys to GitHub Pages (`.github/workflows/pages.yml`). See `CLAUDE.md`.

## Features

- **Split / Map / List views** — toggle between a map+list split, full-screen map, or list-only layout via the header buttons
- **21 mock assets** — 7 ships, 7 drones, 7 airplanes spread across the continental US, Hawaii, and coastal waters
- **Interactive map** — Leaflet/OpenStreetMap markers with per-type emoji icons (🚢/🛩/✈️), color-coded by status; click a marker to see details
- **Asset list** — scrollable sidebar with status badges, coordinates, speed, and altitude; click a row to fly the map to that asset
- **Filter bar** — filter by any combination of asset types and statuses; in-memory, sub-second
- **Stats bar** — live count of Active / Idle / Maintenance / Offline across the full fleet
- **Asset detail overlay** — clicking any asset shows a panel with full metadata

## Running

```bash
npm install && npm run dev
```

Opens at http://localhost:5173 with Vite hot-module reload.

### Production build

```bash
npm run build
```

Emits a fully static bundle to `dist/`, which GitHub Pages serves automatically.

## Project layout

```
src/
  data/mockFleet.ts       # 21 fixture assets — edit to test scenarios
  types/index.ts          # Asset, FilterState types
  components/
    MapView.tsx            # Leaflet map with custom markers
    AssetList.tsx          # Scrollable list
    AssetCard.tsx          # Individual asset row
    FilterBar.tsx          # Type + status filter toggles
    StatusBadge.tsx        # Colour-coded status pill
    StatsBar.tsx           # Header summary counts
  App.tsx                  # Root layout, shared state
  main.tsx / index.css     # Entry point + Tailwind
```
