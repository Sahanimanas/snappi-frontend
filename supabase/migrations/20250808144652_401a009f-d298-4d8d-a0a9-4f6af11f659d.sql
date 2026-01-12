-- Ensure we're operating in the correct schema
-- @ignore
set search_path = public, pg_temp;

-- 1) Helper: update_updated_at_column (idempotent)
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = 'public'
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2) Roles enum and user_roles table + helper (skip if already exists)
-- Create enum app_role if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
                 WHERE t.typname = 'app_role' AND n.nspname = 'public') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'user');
  END IF;
END$$;

-- user_roles table
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- has_role helper (SECURITY DEFINER)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = 'public'
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = _user_id and ur.role = _role
  );
$$;

-- Policy: users can view their own roles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_roles' AND policyname='Users can view their roles'
  ) THEN
    DROP POLICY "Users can view their roles" ON public.user_roles;
  END IF;
END$$;
create policy "Users can view their roles"
  on public.user_roles
  for select
  using (user_id = auth.uid());

-- 3) Profiles table with RLS
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Profiles policies (recreate to be safe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Profiles are viewable by everyone') THEN
    DROP POLICY "Profiles are viewable by everyone" ON public.profiles;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Users can update their own profile') THEN
    DROP POLICY "Users can update their own profile" ON public.profiles;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Users can insert their own profile') THEN
    DROP POLICY "Users can insert their own profile" ON public.profiles;
  END IF;
END$$;

create policy "Profiles are viewable by everyone"
  on public.profiles
  for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Trigger for updated_at on profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END$$;

-- 4) Campaigns table & ownership policies
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text,
  type text,
  status text default 'draft',
  brief text default 'NULL',
  budget numeric,
  brand_id uuid default gen_random_uuid(),
  start_date date,
  end_date date,
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamp without time zone default now(),
  updated_at timestamptz not null default now()
);

-- Ensure columns exist (safe no-op if they do)
alter table public.campaigns add column if not exists owner_id uuid references auth.users(id) on delete set null;
alter table public.campaigns add column if not exists created_at timestamp without time zone default now();
alter table public.campaigns add column if not exists updated_at timestamptz not null default now();

alter table public.campaigns enable row level security;

-- Ownership policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='campaigns' AND policyname='campaigns_select_own') THEN
    DROP POLICY "campaigns_select_own" ON public.campaigns;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='campaigns' AND policyname='campaigns_insert_own') THEN
    DROP POLICY "campaigns_insert_own" ON public.campaigns;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='campaigns' AND policyname='campaigns_update_own') THEN
    DROP POLICY "campaigns_update_own" ON public.campaigns;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='campaigns' AND policyname='campaigns_delete_own') THEN
    DROP POLICY "campaigns_delete_own" ON public.campaigns;
  END IF;
END$$;

create policy "campaigns_select_own"
  on public.campaigns
  for select
  using (owner_id = auth.uid());

create policy "campaigns_insert_own"
  on public.campaigns
  for insert
  with check (owner_id = auth.uid());

create policy "campaigns_update_own"
  on public.campaigns
  for update
  using (owner_id = auth.uid());

create policy "campaigns_delete_own"
  on public.campaigns
  for delete
  using (owner_id = auth.uid());

-- updated_at trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_campaigns_updated_at'
  ) THEN
    CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON public.campaigns
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END$$;

-- Helper: is_campaign_owner
create or replace function public.is_campaign_owner(_campaign_id uuid)
returns boolean
language sql
stable
set search_path = 'public'
as $$
  select exists (
    select 1 from public.campaigns c where c.id = _campaign_id and c.owner_id = auth.uid()
  );
$$;

-- 5) Influencers visibility (public select only)
alter table if exists public.influencers enable row level security;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='influencers' AND policyname='influencers_view_public') THEN
    DROP POLICY "influencers_view_public" ON public.influencers;
  END IF;
END$$;
create policy "influencers_view_public"
  on public.influencers
  for select
  using (true);

-- 6) Campaign influencers table policies (owner-based)
alter table if exists public.campaign_influencers enable row level security;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='campaign_influencers' AND policyname='ci_select_own_campaign') THEN
    DROP POLICY "ci_select_own_campaign" ON public.campaign_influencers;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='campaign_influencers' AND policyname='ci_insert_own_campaign') THEN
    DROP POLICY "ci_insert_own_campaign" ON public.campaign_influencers;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='campaign_influencers' AND policyname='ci_update_own_campaign') THEN
    DROP POLICY "ci_update_own_campaign" ON public.campaign_influencers;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='campaign_influencers' AND policyname='ci_delete_own_campaign') THEN
    DROP POLICY "ci_delete_own_campaign" ON public.campaign_influencers;
  END IF;
END$$;

create policy "ci_select_own_campaign"
  on public.campaign_influencers
  for select
  using (public.is_campaign_owner(campaign_id));

create policy "ci_insert_own_campaign"
  on public.campaign_influencers
  for insert
  with check (public.is_campaign_owner(campaign_id));

create policy "ci_update_own_campaign"
  on public.campaign_influencers
  for update
  using (public.is_campaign_owner(campaign_id));

create policy "ci_delete_own_campaign"
  on public.campaign_influencers
  for delete
  using (public.is_campaign_owner(campaign_id));

-- 7) Performance metrics policies (owner-based)
alter table if exists public.performance_metrics enable row level security;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='performance_metrics' AND policyname='pm_select_own_campaign') THEN
    DROP POLICY "pm_select_own_campaign" ON public.performance_metrics;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='performance_metrics' AND policyname='pm_insert_own_campaign') THEN
    DROP POLICY "pm_insert_own_campaign" ON public.performance_metrics;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='performance_metrics' AND policyname='pm_update_own_campaign') THEN
    DROP POLICY "pm_update_own_campaign" ON public.performance_metrics;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='performance_metrics' AND policyname='pm_delete_own_campaign') THEN
    DROP POLICY "pm_delete_own_campaign" ON public.performance_metrics;
  END IF;
END$$;

create policy "pm_select_own_campaign"
  on public.performance_metrics
  for select
  using (public.is_campaign_owner(campaign_id));

create policy "pm_insert_own_campaign"
  on public.performance_metrics
  for insert
  with check (public.is_campaign_owner(campaign_id));

create policy "pm_update_own_campaign"
  on public.performance_metrics
  for update
  using (public.is_campaign_owner(campaign_id));

create policy "pm_delete_own_campaign"
  on public.performance_metrics
  for delete
  using (public.is_campaign_owner(campaign_id));

-- 8) Users table RLS (own row only)
alter table if exists public.users enable row level security;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_select_own') THEN
    DROP POLICY "users_select_own" ON public.users;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_insert_own') THEN
    DROP POLICY "users_insert_own" ON public.users;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_update_own') THEN
    DROP POLICY "users_update_own" ON public.users;
  END IF;
END$$;

create policy "users_select_own"
  on public.users
  for select
  using (id = auth.uid());

create policy "users_insert_own"
  on public.users
  for insert
  with check (id = auth.uid());

create policy "users_update_own"
  on public.users
  for update
  using (id = auth.uid());

-- 9) Shortlists and items with ownership
create table if not exists public.shortlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.shortlists enable row level security;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shortlists' AND policyname='shortlists_select_own') THEN
    DROP POLICY "shortlists_select_own" ON public.shortlists;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shortlists' AND policyname='shortlists_insert_own') THEN
    DROP POLICY "shortlists_insert_own" ON public.shortlists;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shortlists' AND policyname='shortlists_update_own') THEN
    DROP POLICY "shortlists_update_own" ON public.shortlists;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shortlists' AND policyname='shortlists_delete_own') THEN
    DROP POLICY "shortlists_delete_own" ON public.shortlists;
  END IF;
END$$;

create policy "shortlists_select_own"
  on public.shortlists
  for select
  using (user_id = auth.uid());

create policy "shortlists_insert_own"
  on public.shortlists
  for insert
  with check (user_id = auth.uid());

create policy "shortlists_update_own"
  on public.shortlists
  for update
  using (user_id = auth.uid());

create policy "shortlists_delete_own"
  on public.shortlists
  for delete
  using (user_id = auth.uid());

-- Trigger for updated_at on shortlists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_shortlists_updated_at'
  ) THEN
    CREATE TRIGGER update_shortlists_updated_at
    BEFORE UPDATE ON public.shortlists
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END$$;

-- shortlist_items
create table if not exists public.shortlist_items (
  id uuid primary key default gen_random_uuid(),
  shortlist_id uuid not null references public.shortlists(id) on delete cascade,
  influencer_id uuid not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.shortlist_items enable row level security;

-- helper for shortlist ownership
create or replace function public.is_shortlist_owner(_shortlist_id uuid)
returns boolean
language sql
stable
set search_path = 'public'
as $$
  select exists (
    select 1 from public.shortlists s where s.id = _shortlist_id and s.user_id = auth.uid()
  );
$$;

-- policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shortlist_items' AND policyname='shortlist_items_select_own') THEN
    DROP POLICY "shortlist_items_select_own" ON public.shortlist_items;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shortlist_items' AND policyname='shortlist_items_insert_own') THEN
    DROP POLICY "shortlist_items_insert_own" ON public.shortlist_items;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shortlist_items' AND policyname='shortlist_items_delete_own') THEN
    DROP POLICY "shortlist_items_delete_own" ON public.shortlist_items;
  END IF;
END$$;

create policy "shortlist_items_select_own"
  on public.shortlist_items
  for select
  using (public.is_shortlist_owner(shortlist_id));

create policy "shortlist_items_insert_own"
  on public.shortlist_items
  for insert
  with check (public.is_shortlist_owner(shortlist_id));

create policy "shortlist_items_delete_own"
  on public.shortlist_items
  for delete
  using (public.is_shortlist_owner(shortlist_id));

-- 10) Storage buckets and policies (non-payment)
-- Buckets
insert into storage.buckets (id, name, public)
values ('influencer-media', 'influencer-media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('campaign-assets', 'campaign-assets', false)
on conflict (id) do nothing;

-- Policies on storage.objects
-- influencer-media: public read, owners can insert/update/delete to their own folder
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Influencer media public read') THEN
    DROP POLICY "Influencer media public read" ON storage.objects;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Influencer media owner write') THEN
    DROP POLICY "Influencer media owner write" ON storage.objects;
  END IF;
END$$;

create policy "Influencer media public read"
  on storage.objects
  for select
  using (bucket_id = 'influencer-media');

create policy "Influencer media owner write"
  on storage.objects
  for all
  using (
    bucket_id = 'influencer-media' and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'influencer-media' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- campaign-assets: only owner can read/write their folder
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Campaign assets owner read') THEN
    DROP POLICY "Campaign assets owner read" ON storage.objects;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Campaign assets owner write') THEN
    DROP POLICY "Campaign assets owner write" ON storage.objects;
  END IF;
END$$;

create policy "Campaign assets owner read"
  on storage.objects
  for select
  using (
    bucket_id = 'campaign-assets' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Campaign assets owner write"
  on storage.objects
  for all
  using (
    bucket_id = 'campaign-assets' and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'campaign-assets' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Note: Payments (subscribers/orders/Stripe) intentionally excluded per request
