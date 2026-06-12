# SLA Ticketing System — Frontend

A full-stack helpdesk and SLA-based ticketing platform built with Next.js (App Router) and TypeScript. This is the frontend, communicating with a NestJS backend via a cookie-based JWT authentication flow.

**Live:** [nextjs-sla-ticketing.vercel.app](https://nextjs-sla-ticketing.vercel.app)
**Backend repo:** [nestjs-sla-ticketing-system](https://github.com/TanishSharma151/nestjs-sla-ticketing-system)

## Features

- Role-based dashboards for Admin, Agent, and Client
- Ticket creation, assignment, and status tracking
- Real-time SLA breach detection with pause/resume logic
- Member management (promote/demote roles within an organization)
- SLA policy configuration (response & resolution time targets by priority)
- Comments and full ticket activity history
- File attachments on tickets
- Email notifications for ticket lifecycle events
- Responsive UI with dark/light mode

## Tech Stack

- **Framework:** Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **State/Data:** Axios
- **Auth:** JWT via HTTP-only cookies (proxied through Next.js API routes for cross-origin compatibility)

## Architecture Notes

The frontend and backend are deployed on different origins (Vercel + Render). Since browsers block third-party cookies, all API calls are routed through a Next.js API proxy (`/app/api/[...path]/route.ts`), which forwards requests — and `Set-Cookie` headers — between the browser and the NestJS backend. This makes authentication cookies first-party from the browser's perspective.

## Getting Started

```bash
npm install
```

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Run the dev server:

```bash
npm run dev
```

The app runs on [http://localhost:3001](http://localhost:3001) (or next available port).

## Project Structure

```
app/
  (dashboard)/
    dashboard/        # Role-aware dashboard
    tickets/          # Ticket list, detail, create
    members/          # Member management (admin)
    sla/              # SLA policy management (admin)
  api/[...path]/       # Proxy route to NestJS backend
  login/ signup/       # Auth pages
services/               # API call wrappers (auth, tickets, organizations)
lib/                    # Axios instance, auth helpers, utils
components/             # UI components (shadcn/ui based)
```

## Related Repo

Backend (NestJS + Prisma + PostgreSQL): [nestjs-sla-ticketing-system](https://github.com/TanishSharma151/nestjs-sla-ticketing-system)
