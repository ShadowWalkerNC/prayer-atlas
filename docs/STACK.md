# Prayer Atlas — Stack Reference

This document defines every technology choice in the project, why it was selected, and what it is responsible for.

---

## Frontend

| Tool | Purpose |
|---|---|
| Next.js | App shell, routing, server components, and page rendering |
| Tailwind CSS | Utility-first styling and responsive layout |
| Leaflet or MapLibre | Interactive map rendering with OpenStreetMap tiles |
| Supabase JS Client | Auth, database reads, storage access, and realtime subscriptions |
| Zustand or Context API | Lightweight client state for map selection and auth |

## Backend (Python service)

| Tool | Purpose |
|---|---|
| FastAPI | REST API service for complex logic, jobs, and processing |
| Supabase Python Client | Server-side database access and admin operations |
| Pydantic | Request validation and response modeling |
| APScheduler or similar | Background jobs for digests, cleanup, and expiry checks |

## Database

| Tool | Purpose |
|---|---|
| PostgreSQL | Primary relational database |
| PostGIS | Geospatial extensions for geometry storage and spatial queries |
| Supabase | Hosts database, auth, storage, and realtime under one platform |

## Infrastructure

| Tool | Purpose |
|---|---|
| Supabase Free / Pro | Database, auth, file storage, and realtime |
| Vercel or Render | Frontend hosting for Next.js |
| Render Free Tier | Python FastAPI service hosting (light usage) |
| OpenStreetMap + Leaflet | Free tile-based mapping without API cost |
| GitHub | Source control and CI/CD triggers |

## Cost summary (MVP estimate)

| Service | Free limit | Paid starts at |
|---|---|---|
| Supabase | 500 MB DB, 5 GB egress, 2 projects | $25/month (Pro) |
| Vercel | Generous free tier for Next.js | $20/month (Pro) |
| Render | Free web service with spin-down | $7/month (starter) |
| OpenStreetMap tiles | Free for low volume | Varies by tile provider |

For solo MVP usage the entire stack can run at $0 to $25/month depending on traffic and storage growth.
