# VowSpace

VowSpace is a function-hall booking and operations platform for customers, venue vendors, and event administrators. Customers can discover verified halls and request dates, vendors can publish inventory and approve booking requests, and administrators can see booking, revenue, capacity, and guest-volume analytics across the platform.

## Technology

- TanStack Start and React
- Tailwind CSS with a custom responsive design system
- Netlify Identity via @netlify/identity
- Netlify Database with Drizzle ORM
- Netlify's TanStack deployment adapter

## Local development

Install dependencies with pnpm install, then run netlify dev --port 8889. Authentication requires a deployed Netlify environment, so use a deploy preview to test full signup, confirmation, and login flows.

Database tables are defined in db/schema.ts. Netlify applies the generated migration from netlify/database/migrations during deployment.

## Roles

Customers and vendors select their account type during signup. Administrative access uses the secure admin role in Netlify Identity. Assign the first administrator from the site's Identity user settings.
