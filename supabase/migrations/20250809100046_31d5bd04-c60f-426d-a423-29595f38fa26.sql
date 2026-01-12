-- Referral program schema (retry with DROP POLICY IF EXISTS)

-- Table: referral_codes
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  code text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  max_uses integer,
  uses_count integer NOT NULL DEFAULT 0,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

-- Replace policies safely
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='referral_codes' AND policyname='referral_codes_select_own'
  ) THEN
    DROP POLICY "referral_codes_select_own" ON public.referral_codes;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='referral_codes' AND policyname='referral_codes_insert_own'
  ) THEN
    DROP POLICY "referral_codes_insert_own" ON public.referral_codes;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='referral_codes' AND policyname='referral_codes_update_own'
  ) THEN
    DROP POLICY "referral_codes_update_own" ON public.referral_codes;
  END IF;
END $$;

CREATE POLICY "referral_codes_select_own"
ON public.referral_codes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "referral_codes_insert_own"
ON public.referral_codes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "referral_codes_update_own"
ON public.referral_codes
FOR UPDATE
USING (auth.uid() = user_id);

-- Update trigger for updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_referral_codes_updated_at'
  ) THEN
    CREATE TRIGGER update_referral_codes_updated_at
    BEFORE UPDATE ON public.referral_codes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Table: referrals
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id uuid NOT NULL,
  referred_user_id uuid,
  code text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Replace policy safely
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='referrals' AND policyname='referrals_select_own'
  ) THEN
    DROP POLICY "referrals_select_own" ON public.referrals;
  END IF;
END $$;

CREATE POLICY "referrals_select_own"
ON public.referrals
FOR SELECT
USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id);

-- Secure function to record a referral atomically
CREATE OR REPLACE FUNCTION public.record_referral(_code text)
RETURNS public.referrals
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code_row public.referral_codes%ROWTYPE;
  v_existing public.referrals%ROWTYPE;
  v_new public.referrals%ROWTYPE;
  v_user uuid := auth.uid();
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_code_row
  FROM public.referral_codes
  WHERE code = _code AND is_active = true
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or inactive referral code';
  END IF;

  IF v_code_row.user_id = v_user THEN
    RAISE EXCEPTION 'Self-referral is not allowed';
  END IF;

  -- If this user already has a referral recorded, just return it
  SELECT * INTO v_existing
  FROM public.referrals
  WHERE referred_user_id = v_user
  LIMIT 1;

  IF FOUND THEN
    RETURN v_existing;
  END IF;

  -- Enforce max uses if set
  IF v_code_row.max_uses IS NOT NULL AND v_code_row.uses_count >= v_code_row.max_uses THEN
    RAISE EXCEPTION 'This referral code has reached its maximum uses';
  END IF;

  INSERT INTO public.referrals (referrer_user_id, referred_user_id, code, status, completed_at)
  VALUES (v_code_row.user_id, v_user, v_code_row.code, 'completed', now())
  RETURNING * INTO v_new;

  UPDATE public.referral_codes
  SET uses_count = uses_count + 1,
      last_used_at = now()
  WHERE id = v_code_row.id;

  RETURN v_new;
END;
$$;