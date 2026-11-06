# Fami-Li Adventures

A minimal family travel journal. Browse Iceland (2016), South Africa and Paris (2017), China (2018), Wimbledon (2023), and Greece (2025) through a horizontal timeline, a destination gallery, or a draggable globe.

## Run locally

Requires Node.js 22+ and npm. No credentials are needed.

```sh
npm install
npm run dev
```

Open http://localhost:3000. For the optimized static build:

```sh
npm run build
npm start
```

## What works

- Draggable/touch-scrollable timeline, one year line, staggered entry reveals, and previous/next controls.
- Layered coverflow destination gallery and an auto-rotating, draggable globe with selectable pins. The globe also supports arrow keys and has a pause control.
- Full trip stories, dates, travelers, itinerary, and captioned photo viewer. Trip stories sit beside the cover, followed by a masonry gallery with readable tooltips. Arrow keys navigate photos; Escape closes the current dialog.
- Minimal floating glass controls for Timeline/Gallery/Globe, adding trips, and light/dark preference. Trip views replace these with Edit and a separate back-arrow bubble.
- Add/edit sheets with image drag-and-drop or file selection, per-image titles/captions, cover selection, and validation. Up to 12 photos per trip, 10 MB each.
- Browser-local IndexedDB persistence for trips and image previews, including after refresh. No image leaves the browser. If browser storage is blocked or full, a notification explains that the change lasts only for the session.
- A dimensional custom cursor, soft purple aura, and click particles for fine pointers. Touch devices use their native interaction. Reduced-motion preferences disable decorative movement.

## Workspace

| Location              | Responsibility                                                                                           |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| `apps/web`            | Next.js App Router application; album, timeline, globe, gallery, and editor                              |
| `packages/ui`         | Shared shadcn-style Radix primitives, Tailwind tokens, Button, Dialog, Sheet, Input, Textarea, and Label |
| `packages/data`       | Trip/photo types, typed mock repository, requested six-trip fixtures, Supabase-shaped database contracts |
| `supabase/schema.sql` | Unapplied reference schema for adventures, photos, and itinerary stops                                   |
| `.env.example`        | Names of the future Supabase environment variables; no secrets                                           |

Tailwind v4 scans the app and shared UI package. Poppins is self-hosted by Next.js at build time. Motion handles view transitions and shared cover expansion; Radix handles modal focus, Escape, and keyboard behavior. d3-geo renders bundled Natural Earth geometry without a runtime map service.

## Data and Supabase

The requested database fields are `title`, `city`, `country`, `notes`, `date`, and `cover_photo`. The month and year are derived from `date`. `photos` stores a title, caption, location, and order for each image; `itinerary_stops` belongs to an adventure. `Database`, `AdventureRow`, `PhotoRow`, and `ItineraryStopRow` are exported by `@fami-li/data`.

The current view model retains `startDate`/`cover` aliases for the presentation layer; validation keeps them consistent with `date`/`cover_photo`. Unknown countries can be saved without coordinates and remain available in the globe's trip list; enter optional coordinates to place a pin. Known countries receive a country-level pin by default.

When connecting Supabase, replace the mock repository and browser save adapter with a typed Supabase implementation, upload actual files to a private Storage bucket, and store object paths instead of preview data URLs. Add family authentication/membership policies before connecting the client. The reference SQL enables RLS with no public policies, so it starts closed. Mock photo IDs are fixtures, not database UUID seed values. Generate database types from the applied schema at that stage. Remove static export only when server features are introduced. Keep the secret key server-only.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

CI runs these commands on pushes and pull requests. `npm run format` applies Prettier. The repository contains regression tests for date/coordinate validation, safe stored photos, UTC formatting, data completeness, local asset availability, and repository lookups.

Stories, traveler names, exact dates, and photographs are sample content for the mock. Photo sources are documented in `packages/data/PHOTO-CREDITS.md`; Wimbledon images are representative tennis stock. This prototype is browser-local, not yet a synchronized family backend.

## Brand assets

The selected pixel-chibi family-on-Earth mark supplies the favicon, Apple icon, and animated brand export. The 1600×900 `public/og-image.png` is wired into Open Graph and Twitter metadata. Set `NEXT_PUBLIC_SITE_URL` when deploying at a different origin. Design variants, sprite sheets, animated previews, and prompts are retained under `design/logomark-options`.

The on-page family mark loops through twelve generated frames with waves, walking-in-place steps, blinks, and changing Earth continents. A native reduced-motion picture source selects its matching still image.
