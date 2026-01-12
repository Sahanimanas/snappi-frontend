-- 1) Helper function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2) Profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Profiles are viewable by everyone'
  ) THEN
    CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles
    FOR SELECT
    USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Triggers for profiles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 3) Roles setup
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'user');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id AND ur.role = _role
  );
$$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can view their roles'
  ) THEN
    CREATE POLICY "Users can view their roles"
    ON public.user_roles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());
  END IF;
END $$;

-- 4) Add ownership to campaigns and enable RLS
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS owner_id UUID;
-- Normalize accidental column name if present
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'campaigns' AND column_name = 'created at'
  ) THEN
    EXECUTE 'ALTER TABLE public.campaigns RENAME COLUMN "created at" TO created_at';
  END IF;
END $$;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Ownership policies for campaigns
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='campaigns' AND policyname='campaigns_select_own'
  ) THEN
    CREATE POLICY campaigns_select_own ON public.campaigns FOR SELECT USING (owner_id = auth.uid());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='campaigns' AND policyname='campaigns_insert_own'
  ) THEN
    CREATE POLICY campaigns_insert_own ON public.campaigns FOR INSERT WITH CHECK (owner_id = auth.uid());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='campaigns' AND policyname='campaigns_update_own'
  ) THEN
    CREATE POLICY campaigns_update_own ON public.campaigns FOR UPDATE USING (owner_id = auth.uid());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='campaigns' AND policyname='campaigns_delete_own'
  ) THEN
    CREATE POLICY campaigns_delete_own ON public.campaigns FOR DELETE USING (owner_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_campaigns_updated_at') THEN
    CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON public.campaigns
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 5) Influencers - generally viewable by everyone (catalogue), restrict writes for now
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='influencers' AND policyname='influencers_view_public'
  ) THEN
    CREATE POLICY influencers_view_public ON public.influencers FOR SELECT USING (true);
  END IF;
END $$;

-- 6) Helper to check campaign ownership
CREATE OR REPLACE FUNCTION public.is_campaign_owner(_campaign_id uuid)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.campaigns c WHERE c.id = _campaign_id AND c.owner_id = auth.uid()
  );
$$;

-- 7) Campaign Influencers junction
ALTER TABLE public.campaign_influencers ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='campaign_influencers' AND policyname='ci_select_own_campaign'
  ) THEN
    CREATE POLICY ci_select_own_campaign ON public.campaign_influencers FOR SELECT USING (public.is_campaign_owner(campaign_id));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='campaign_influencers' AND policyname='ci_insert_own_campaign'
  ) THEN
    CREATE POLICY ci_insert_own_campaign ON public.campaign_influencers FOR INSERT WITH CHECK (public.is_campaign_owner(campaign_id));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='campaign_influencers' AND policyname='ci_update_own_campaign'
  ) THEN
    CREATE POLICY ci_update_own_campaign ON public.campaign_influencers FOR UPDATE USING (public.is_campaign_owner(campaign_id));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='campaign_influencers' AND policyname='ci_delete_own_campaign'
  ) THEN
    CREATE POLICY ci_delete_own_campaign ON public.campaign_influencers FOR DELETE USING (public.is_campaign_owner(campaign_id));
  END IF;
END $$;

-- 8) Performance metrics with campaign scoping
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='performance_metrics' AND policyname='pm_select_own_campaign'
  ) THEN
    CREATE POLICY pm_select_own_campaign ON public.performance_metrics FOR SELECT USING (public.is_campaign_owner(campaign_id));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='performance_metrics' AND policyname='pm_insert_own_campaign'
  ) THEN
    CREATE POLICY pm_insert_own_campaign ON public.performance_metrics FOR INSERT WITH CHECK (public.is_campaign_owner(campaign_id));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='performance_metrics' AND policyname='pm_update_own_campaign'
  ) THEN
    CREATE POLICY pm_update_own_campaign ON public.performance_metrics FOR UPDATE USING (public.is_campaign_owner(campaign_id));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='performance_metrics' AND policyname='pm_delete_own_campaign'
  ) THEN
    CREATE POLICY pm_delete_own_campaign ON public.performance_metrics FOR DELETE USING (public.is_campaign_owner(campaign_id));
  END IF;
END $$;

-- 9) Users table (custom) - restrict to own row
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_select_own'
  ) THEN
    CREATE POLICY users_select_own ON public.users FOR SELECT USING (id = auth.uid());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_insert_own'
  ) THEN
    CREATE POLICY users_insert_own ON public.users FOR INSERT WITH CHECK (id = auth.uid());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_update_own'
  ) THEN
    CREATE POLICY users_update_own ON public.users FOR UPDATE USING (id = auth.uid());
  END IF;
END $$;

-- 10) Shortlists
CREATE TABLE IF NOT EXISTS public.shortlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shortlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shortlist_id UUID NOT NULL REFERENCES public.shortlists(id) ON DELETE CASCADE,
  influencer_id UUID NOT NULL REFERENCES public.influencers(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shortlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shortlist_items ENABLE ROW LEVEL SECURITY;

-- Policies for shortlists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shortlists' AND policyname='shortlists_select_own'
  ) THEN
    CREATE POLICY shortlists_select_own ON public.shortlists FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shortlists' AND policyname='shortlists_insert_own'
  ) THEN
    CREATE POLICY shortlists_insert_own ON public.shortlists FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shortlists' AND policyname='shortlists_update_own'
  ) THEN
    CREATE POLICY shortlists_update_own ON public.shortlists FOR UPDATE USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shortlists' AND policyname='shortlists_delete_own'
  ) THEN
    CREATE POLICY shortlists_delete_own ON public.shortlists FOR DELETE USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_shortlists_updated_at') THEN
    CREATE TRIGGER update_shortlists_updated_at
    BEFORE UPDATE ON public.shortlists
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Shortlist items follow parent shortlist ownership
CREATE OR REPLACE FUNCTION public.is_shortlist_owner(_shortlist_id uuid)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.shortlists s WHERE s.id = _shortlist_id AND s.user_id = auth.uid()
  );
$$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shortlist_items' AND policyname='shortlist_items_select_own'
  ) THEN
    CREATE POLICY shortlist_items_select_own ON public.shortlist_items FOR SELECT USING (public.is_shortlist_owner(shortlist_id));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shortlist_items' AND policyname='shortlist_items_insert_own'
  ) THEN
    CREATE POLICY shortlist_items_insert_own ON public.shortlist_items FOR INSERT WITH CHECK (public.is_shortlist_owner(shortlist_id));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shortlist_items' AND policyname='shortlist_items_delete_own'
  ) THEN
    CREATE POLICY shortlist_items_delete_own ON public.shortlist_items FOR DELETE USING (public.is_shortlist_owner(shortlist_id));
  END IF;
END $$;

-- 11) Stripe support tables
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='subscribers' AND policyname='select_own_subscription'
  ) THEN
    CREATE POLICY select_own_subscription ON public.subscribers FOR SELECT USING (user_id = auth.uid() OR email = auth.email());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='subscribers' AND policyname='update_own_subscription'
  ) THEN
    CREATE POLICY update_own_subscription ON public.subscribers FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='subscribers' AND policyname='insert_subscription'
  ) THEN
    CREATE POLICY insert_subscription ON public.subscribers FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_subscribers_updated_at') THEN
    CREATE TRIGGER update_subscribers_updated_at
    BEFORE UPDATE ON public.subscribers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER,
  currency TEXT DEFAULT 'usd',
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='select_own_orders'
  ) THEN
    CREATE POLICY select_own_orders ON public.orders FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='insert_order'
  ) THEN
    CREATE POLICY insert_order ON public.orders FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='update_order'
  ) THEN
    CREATE POLICY update_order ON public.orders FOR UPDATE USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_orders_updated_at') THEN
    CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 12) Storage buckets and policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('influencer-media','influencer-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('campaign-assets','campaign-assets', false)
ON CONFLICT (id) DO NOTHING;

-- Public read for influencer-media
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public read influencer-media'
  ) THEN
    CREATE POLICY "Public read influencer-media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'influencer-media');
  END IF;
END $$;

-- Owner-scoped access for campaign-assets (folder by user id)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Campaign assets read own'
  ) THEN
    CREATE POLICY "Campaign assets read own"
    ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'campaign-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Campaign assets insert own'
  ) THEN
    CREATE POLICY "Campaign assets insert own"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'campaign-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Campaign assets update own'
  ) THEN
    CREATE POLICY "Campaign assets update own"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'campaign-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Campaign assets delete own'
  ) THEN
    CREATE POLICY "Campaign assets delete own"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'campaign-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

-- 13) Helpful indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_owner ON public.campaigns(owner_id);
CREATE INDEX IF NOT EXISTS idx_ci_campaign ON public.campaign_influencers(campaign_id);
CREATE INDEX IF NOT EXISTS idx_pm_campaign ON public.performance_metrics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_shortlists_user ON public.shortlists(user_id);
CREATE INDEX IF NOT EXISTS idx_shortlist_items_shortlist ON public.shortlist_items(shortlist_id);
