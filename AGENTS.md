# VowSpace architecture

## Overview

VowSpace is a TanStack Start application deployed on Netlify. The public landing page and each authenticated role workspace currently live in the root route. Authentication is handled by Netlify Identity and persistent application records live in Netlify Database.

## Key directories

- src/routes contains the page route and authenticated API routes.
- src/lib contains the browser Identity provider.
- src/components contains cross-cutting UI behavior such as Identity callback handling.
- db contains the Drizzle schema and Netlify Database client.
- netlify/database/migrations contains deploy-time database migrations.

## Conventions

- Use TypeScript and functional React components.
- Keep browser authentication calls in @netlify/identity and verify the current user again on every server mutation.
- Store structured persistent data in Netlify Database. Never substitute local files or in-memory state.
- Use snake_case names in Postgres while keeping TypeScript properties camelCase.
- Generate a named migration after every schema change.
- Reuse the CSS variables in src/styles.css to preserve the editorial coral, lime, gold, cream, and ink palette.
- Maintain keyboard-focusable native controls and responsive layouts.

## Role model

Customer and vendor account types are saved in Identity user metadata at signup. Admin authorization comes only from the server-controlled Identity admin role. Vendor mutations must remain scoped to records owned by the authenticated vendor. The first administrator is assigned through the Netlify Identity dashboard.

## Non-obvious decisions

The initial migration seeds three curated platform-owned venues so newly confirmed customer accounts have bookable inventory. Vendor accounts see only bookings for halls they own. Identity authentication works on a deployed Netlify environment, not a plain local Vite server.
