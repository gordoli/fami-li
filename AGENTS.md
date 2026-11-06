# Fami-Li Adventures

Next.js TypeScript monorepo using npm workspaces. Read README.md for architecture and local commands. The current product is a browser-local mock; do not introduce live Supabase writes or credentials implicitly.

- UI primitives/tokens belong in packages/ui. Use shared Button/Dialog/Sheet/input components.
- Domain types/mock data/database row contracts belong in packages/data.
- App presentation lives in apps/web/src/components; browser persistence in apps/web/src/lib.
- Keep date and startDate aliases consistent, and cover_photo and cover consistent. Derive displayed month/year from date in UTC.
- Preserve keyboard navigation, focus restoration, reduced motion, theme tokens, and phone layouts.
- Before completion run npm run lint, npm run typecheck, npm test, and npm run build.
- Use focused changes and clear boundaries; avoid speculative backend abstractions.
