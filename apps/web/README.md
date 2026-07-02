# Prayer Atlas — Web App

This is the Next.js frontend for Prayer Atlas.

## Getting started

```bash
npx create-next-app@latest . --typescript --tailwind --app
```

## Environment variables

Create a `.env.local` file with the following:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Folder structure (planned)

```
apps/web/
  app/
    page.tsx               # Home / map
    region/[slug]/
      page.tsx             # Region detail
    missionary/[id]/
      page.tsx             # Missionary profile
    request/[id]/
      page.tsx             # Request detail
    admin/
      page.tsx             # Admin dashboard
      queue/page.tsx       # Moderation queue
    submit/
      request/page.tsx     # Submit prayer request
  components/
    map/                   # Map and region drawer
    cards/                 # Request, missionary, org cards
    forms/                 # Submission forms
    layout/                # Nav, footer, shell
  lib/
    supabase.ts            # Supabase client setup
    api.ts                 # API helper functions
```
