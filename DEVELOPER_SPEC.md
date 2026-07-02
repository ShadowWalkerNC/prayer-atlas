# Prayer Atlas Developer Specification

## Overview

Prayer Atlas is a geospatial prayer and missions web application built around one central interaction: browse a map, open a region, view people and prayer needs in that place, and respond through prayer or follow-up engagement. The product combines map-based navigation, structured content, lightweight community interaction, and administrative moderation into one platform.

The most realistic implementation for a solo developer is a phased MVP using low-cost or free-friendly infrastructure first.

## Product goals

The application should solve four problems:

1. Make global and regional prayer needs discoverable through a map interface.
2. Allow missionaries, ministries, or churches to publish structured requests and updates.
3. Give users a lightweight prayer engagement flow such as "I prayed," save, and follow.
4. Provide moderation and privacy controls for sensitive or restricted information.

## Scope strategy

The build should be phased so the application remains achievable for one developer with limited hosting budget. A broad v1 with live globe effects, complex org dashboards, private messaging, and fine-grained roles would create unnecessary cost and delay.

### MVP scope

The MVP should include:

- Interactive map or region browser
- Country-first or country-plus-state navigation
- Region detail panel or region page
- Prayer request list tied to region
- Basic missionary or ministry profile records
- Public user accounts for save/follow/prayed actions
- Admin moderation queue
- Answered prayer and simple update posts

### Deferred scope

These features should wait until after launch:

- Realtime maps with heavy live activity overlays
- Advanced church dashboards
- Private chat or direct messaging
- Complex organization hierarchies
- Exact missionary location display in sensitive regions
- Custom vector tile hosting

## Recommended architecture

The most practical architecture is a Next.js frontend connected to a Supabase-backed PostgreSQL database, with a Python service added only when Python-specific processing becomes necessary.

### Frontend

Use Next.js for the application shell, routing, and UI rendering. Use Tailwind CSS or a lightweight component system for speed, and Leaflet or MapLibre for the map interface.

Suggested frontend responsibilities:

- Render world and regional map views
- Handle search, filters, and region navigation
- Display region drawers, profile cards, and request feeds
- Handle auth state and protected admin screens
- Submit prayer interactions and request forms

### Backend

The cheapest realistic first version is to let Supabase handle authentication, database access, storage, and possibly basic realtime. A separate Python backend should be added when the project needs import jobs, moderation automation, geodata processing, reporting, or external integrations that are better handled in Python.

Suggested Python responsibilities when introduced:

- GeoJSON import and normalization
- Scheduled digests and summary jobs
- Content moderation helpers
- Data cleanup and migration scripts
- Reporting and analytics generation

FastAPI is a strong fit for this service because it is lean and easy to split into background and API tasks.

### Database

Use PostgreSQL with PostGIS support for storing locations, boundaries, and geospatial queries.

Core tables should include:

- `users`
- `organizations`
- `regions`
- `missionaries`
- `ministries`
- `prayer_requests`
- `request_updates`
- `prayer_interactions`
- `follows`
- `moderation_queue`
- `media_assets`

## Data model

### Regions

The `regions` table is the geographic backbone of the app.

Suggested fields:

- `id`
- `name`
- `slug`
- `type` (`country`, `state`, `province`, `city`)
- `parent_region_id`
- `latitude`
- `longitude`
- `geometry` or boundary reference
- `visibility`
- `created_at`
- `updated_at`

### Missionaries and ministries

Missionary or ministry records should be attachable to a region without forcing exact public coordinates.

Suggested fields:

- `display_name`
- `organization_id`
- `region_id`
- `bio`
- `avatar_url`
- `category`
- `visibility_level`
- `status`

### Prayer requests

Prayer requests are the primary content object in the app.

Suggested fields:

- `id`
- `region_id`
- `missionary_id` or `ministry_id`
- `title`
- `body`
- `category`
- `urgency`
- `visibility`
- `status` (`pending`, `approved`, `archived`, `answered`)
- `created_by`
- `created_at`
- `expires_at`

### Prayer interactions

These records support lightweight community engagement.

Suggested fields:

- `id`
- `request_id`
- `user_id`
- `interaction_type` (`prayed`, `saved`, `followed`)
- `created_at`

## User flows

### Public user flow

1. User opens the map home page.
2. User selects a region from the map or search.
3. App opens a region page or drawer with summary cards.
4. User reads active requests and profiles.
5. User clicks "I prayed," saves a request, or follows the region.
6. User returns later to view updates or answered prayer posts.

### Contributor flow

1. Missionary, church, or admin creates a prayer request.
2. Request is assigned to a region and optional profile.
3. Request enters review if moderation is enabled.
4. Approved request appears in the region feed.
5. Contributor can later post updates or mark the request answered.

### Admin flow

1. Admin opens moderation queue.
2. Admin reviews content for spam, duplicates, privacy issues, and clarity.
3. Admin approves, edits, restricts, or rejects the request.
4. Admin manages profile visibility and location granularity.

## Build order

### Step 1: Foundation

- Create project repository and documentation structure.
- Set up Next.js frontend.
- Set up Supabase project, auth, database, and storage.
- Define environment variables and deploy preview workflow.

### Step 2: Data and schema

- Create database schema for users, regions, requests, profiles, and moderation.
- Add indexes for region lookup and request filtering.
- Add row-level security where appropriate.
- Seed initial regions with country data first.

### Step 3: Frontend shell

- Build homepage, map layout, search, and region drawer.
- Build request cards and profile cards.
- Add auth flows.
- Add responsive mobile views.

### Step 4: Core interactions

- Implement "I prayed" interaction.
- Implement save/follow state.
- Implement prayer request submission form.
- Build region request filtering by category and urgency.

### Step 5: Moderation

- Build admin dashboard.
- Build request approval workflow.
- Add visibility levels for public and restricted entries.
- Add audit fields and moderation notes.

### Step 6: Python service

- Add FastAPI service for scripts, jobs, and future integrations.
- Implement importers for geographic datasets.
- Add scheduled digests or background processing.
- Create migration and reporting utilities.

### Step 7: Post-launch improvements

- Add answered prayer timelines.
- Add organization pages.
- Add analytics and simple dashboarding.
- Add notification and digest strategy.

## Budget-aware recommendations

For a solo developer trying to stay on free or low-cost infrastructure, the most important rule is to reduce moving parts. Supabase can cover the first-stage database, auth, storage, and some realtime needs under one service, which is far cheaper and simpler than immediately splitting database, auth, storage, and API across multiple vendors.

Practical low-cost decisions:

- Use Supabase before adding a separate hosted PostgreSQL provider
- Use OpenStreetMap-based tiles with Leaflet or MapLibre before considering paid maps
- Start with country-level or broad regional shapes instead of detailed global city polygons
- Avoid heavy media uploads in v1 because storage and egress will grow quickly
- Keep realtime optional until users prove they need it

## Risks and holdbacks

### 1. Geospatial complexity

Map products become harder once boundaries, nested region logic, and performance all combine. The app will be easier to ship if the first version uses broad region layers and a simple region drawer instead of trying to support every world administrative level at launch.

### 2. Content moderation

Prayer content sounds low-risk, but user-submitted content still creates moderation overhead. Spam, personal oversharing, privacy-sensitive missionary data, and vague requests will all need review workflows.

### 3. Sensitive location handling

Some mission-related data should not expose exact positions publicly. The data model and admin UI should support broad placement, restricted visibility, or hidden coordinates from the beginning.

### 4. Scope creep

The biggest solo-developer threat is turning the app into a full church platform too early. Messaging, events, donation systems, dashboards, and organization management should remain outside the MVP.

### 5. Free-tier limits

Free services are useful for prototyping, but active project, database size, and bandwidth limits can become meaningful if the app adds many images, frequent revisits, or high traffic.

## Success criteria

The MVP is successful if:

- A user can open the app and find a prayer request by location within a few clicks
- A contributor can submit a request without confusion
- An admin can review and publish safely
- The app runs within free or low-cost infrastructure during early usage
- The product proves that map-based prayer discovery creates repeat engagement

## Final recommendation

Build Prayer Atlas as a focused prayer-request map first, not as a full mission operating system. The smartest launch version is a region-based prayer application with light profiles, admin moderation, and simple engagement actions, then a Python service layered in later for automation, imports, and processing.
