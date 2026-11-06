# Family album implementation plan

Build an Poppins-led family archive in white, purple, and black with a reversible dark theme. A single-line title and subtitle sit beneath compact floating glass controls; the navbar and decorative labels are removed.

Use the six fixtures Iceland 2016, South Africa 2017, Paris 2017, China 2018, Wimbledon 2023, and Greece 2025. Timeline is horizontal by default: small cover thumbnails, title, gray city/month subtext, staggered viewport reveals, one year line, and mouse/touch dragging. Gallery uses a layered carousel with destination selection. Globe rotates and opens the same trips through pins or its accessible list. View changes use a short fade; the title becomes compact in Gallery/Globe and full-size on Timeline. Trip expansion includes story, notes, dates, travelers, itinerary, and a keyboard-capable caption viewer.

Shared Add/Edit sheets let people edit trip details, select/drop images, write image titles/captions, and choose a cover. Persist this mock in browser IndexedDB; no Supabase credentials or uploads are used. Decorative cursor/aura/particles run only on fine pointers and respect reduced motion.

Workspace: apps/web (Next.js), packages/ui (Tailwind/shadcn/Radix), packages/data (typed fixtures/repository/database contracts). Supabase reference schema stays unapplied and RLS-closed. Static export supports private preview publication; future authenticated server features can remove the export setting.

Acceptance: earliest trip initially visible; six trips reachable by arrows/swipe; all three views work; globe mouse/keyboard rotation and pins work; complete metadata/stories/galleries; add/edit/save/reload work; image title/caption/cover editing works; malformed persisted data is rejected; keyboard focus returns on dialog close; no phone page overflow; both themes readable; no exposed secrets; browser-local persistence clearly disclosed.

Brand deliverables: five pixel-chibi animated directions; selected family-on-Earth version in natural Earth colors, static favicons, animated export, and a 16:9 Open Graph card.
