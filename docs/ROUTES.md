# Prayer Atlas — Route Map

This document defines the page routes for the Next.js frontend and the API endpoints for the Python FastAPI backend service.

---

## Frontend routes (Next.js)

### Public routes

| Route | Page | Description |
|---|---|---|
| `/` | Home / Map | Interactive world map with region discovery |
| `/region/[slug]` | Region Page | Prayer requests, missionaries, and ministries for a region |
| `/missionary/[id]` | Missionary Profile | Individual profile card with linked requests |
| `/org/[slug]` | Organization Page | Ministry or church overview with linked missionaries |
| `/request/[id]` | Request Detail | Full prayer request with updates and interaction |
| `/explore` | Explore | Browse by category, urgency, or recent activity |
| `/search` | Search | Find regions, missionaries, or requests by keyword |

### Auth routes

| Route | Page | Description |
|---|---|---|
| `/login` | Login | Supabase auth sign-in |
| `/register` | Register | New user account creation |
| `/profile` | My Profile | User saved requests, followed regions, prayer history |

### Contributor routes

| Route | Page | Description |
|---|---|---|
| `/submit/request` | Submit Request | Form to post a new prayer request |
| `/submit/missionary` | Submit Profile | Form to add a missionary or ministry |
| `/my/requests` | My Requests | Manage submitted requests and post updates |

### Admin routes

| Route | Page | Description |
|---|---|---|
| `/admin` | Admin Dashboard | Overview of pending items and platform stats |
| `/admin/queue` | Moderation Queue | Review and approve or reject submissions |
| `/admin/regions` | Region Manager | Add or edit regions and visibility settings |
| `/admin/users` | User Manager | View users, update roles, manage access |

---

## Backend API endpoints (FastAPI — Python service)

All endpoints are prefixed with `/api/v1`.

### Regions

| Method | Endpoint | Description |
|---|---|---|
| GET | `/regions` | List all top-level regions (countries) |
| GET | `/regions/{slug}` | Get a single region and its children |
| GET | `/regions/{slug}/requests` | Get approved prayer requests for a region |
| GET | `/regions/{slug}/missionaries` | Get missionaries linked to a region |

### Prayer requests

| Method | Endpoint | Description |
|---|---|---|
| GET | `/requests` | List approved requests with filters |
| GET | `/requests/{id}` | Get a single request with updates |
| POST | `/requests` | Submit a new prayer request |
| PATCH | `/requests/{id}` | Update a request (contributor or admin) |
| POST | `/requests/{id}/updates` | Post an update or answered report |
| POST | `/requests/{id}/interact` | Log a prayed, saved, or followed interaction |

### Missionaries

| Method | Endpoint | Description |
|---|---|---|
| GET | `/missionaries` | List missionaries with optional region filter |
| GET | `/missionaries/{id}` | Get a single missionary profile |
| POST | `/missionaries` | Submit a new missionary profile |

### Organizations

| Method | Endpoint | Description |
|---|---|---|
| GET | `/orgs` | List verified organizations |
| GET | `/orgs/{slug}` | Get a single organization and its missionaries |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/queue` | List pending moderation items |
| PATCH | `/admin/queue/{id}` | Approve or reject a queued item |
| GET | `/admin/stats` | Platform activity summary |

### Auth

Authentication is handled entirely by Supabase Auth on the frontend. The Python service verifies JWT tokens from Supabase on protected endpoints.
