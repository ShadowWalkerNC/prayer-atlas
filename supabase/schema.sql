-- Prayer Atlas Database Schema
-- PostgreSQL + PostGIS
-- Run this against your Supabase project SQL editor

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================
-- USERS
-- Managed by Supabase Auth. This table extends auth.users
-- with app-specific profile data.
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user', -- 'user', 'contributor', 'admin'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ORGANIZATIONS
-- Churches, mission agencies, or ministries that manage
-- multiple missionaries or requests.
-- ============================================================
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- REGIONS
-- Geographic backbone of the app.
-- Supports country > state/province > city hierarchy.
-- ============================================================
CREATE TABLE public.regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('country', 'state', 'province', 'city', 'district')),
  parent_region_id UUID REFERENCES public.regions(id) ON DELETE SET NULL,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  geometry GEOMETRY(MULTIPOLYGON, 4326), -- PostGIS boundary shape
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'restricted', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_regions_parent ON public.regions(parent_region_id);
CREATE INDEX idx_regions_type ON public.regions(type);
CREATE INDEX idx_regions_geometry ON public.regions USING GIST(geometry);

-- ============================================================
-- MISSIONARIES
-- Individual people serving in a region.
-- ============================================================
CREATE TABLE public.missionaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  region_id UUID REFERENCES public.regions(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  category TEXT, -- e.g. 'church planting', 'medical', 'education'
  visibility_level TEXT NOT NULL DEFAULT 'public' CHECK (visibility_level IN ('public', 'restricted', 'hidden')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'returned')),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_missionaries_region ON public.missionaries(region_id);

-- ============================================================
-- PRAYER REQUESTS
-- Primary content object. Tied to a region and optionally
-- to a missionary or ministry.
-- ============================================================
CREATE TABLE public.prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  region_id UUID REFERENCES public.regions(id) ON DELETE SET NULL,
  missionary_id UUID REFERENCES public.missionaries(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  category TEXT, -- e.g. 'health', 'safety', 'provision', 'outreach'
  urgency TEXT NOT NULL DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'urgent')),
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'restricted', 'private')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'archived', 'answered')),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_requests_region ON public.prayer_requests(region_id);
CREATE INDEX idx_requests_status ON public.prayer_requests(status);
CREATE INDEX idx_requests_created ON public.prayer_requests(created_at DESC);

-- ============================================================
-- REQUEST UPDATES
-- Progress posts, praise reports, or answered prayer notes
-- attached to a specific prayer request.
-- ============================================================
CREATE TABLE public.request_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.prayer_requests(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  update_type TEXT NOT NULL DEFAULT 'update' CHECK (update_type IN ('update', 'answered', 'praise')),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_updates_request ON public.request_updates(request_id);

-- ============================================================
-- PRAYER INTERACTIONS
-- Tracks user engagement: prayed, saved, or followed.
-- ============================================================
CREATE TABLE public.prayer_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.prayer_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('prayed', 'saved', 'followed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(request_id, user_id, interaction_type)
);

CREATE INDEX idx_interactions_request ON public.prayer_interactions(request_id);
CREATE INDEX idx_interactions_user ON public.prayer_interactions(user_id);

-- ============================================================
-- FOLLOWS
-- Users can follow a region to receive updates.
-- ============================================================
CREATE TABLE public.region_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID NOT NULL REFERENCES public.regions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(region_id, user_id)
);

-- ============================================================
-- MODERATION QUEUE
-- Holds pending submissions for admin review before
-- they are published publicly.
-- ============================================================
CREATE TABLE public.moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('prayer_request', 'missionary', 'update')),
  content_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_id UUID REFERENCES public.profiles(id),
  reviewer_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX idx_moderation_status ON public.moderation_queue(status);
