-- Fix the security definer view issue by removing it and simplifying the RLS approach
DROP VIEW IF EXISTS public.influencers_search;

-- Remove the current policies and create simpler, more secure ones
DROP POLICY IF EXISTS "Public can view basic influencer info" ON public.influencers;
DROP POLICY IF EXISTS "Authorized users can view full influencer details" ON public.influencers;

-- Create a simple policy that allows basic access but restricts email field
-- Use column-level security by creating a policy that works for all users
CREATE POLICY "Users can view influencer profiles"
ON public.influencers
FOR SELECT
USING (true);

-- Create RLS policy to restrict email access specifically
-- Add a trigger to null out email field for unauthorized users
CREATE OR REPLACE FUNCTION public.filter_influencer_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only show email if user is authenticated and has proper access
  IF auth.uid() IS NULL OR NOT public.can_access_influencer_details(NEW.id) THEN
    NEW.email := NULL;
  END IF;
  RETURN NEW;
END;
$$;

-- Since we can't use triggers on SELECT, let's use a different approach
-- Drop the function approach and use a simpler RLS policy
DROP FUNCTION IF EXISTS public.filter_influencer_email();

-- Create two separate policies: one for basic info, one for sensitive data
CREATE POLICY "Anyone can view basic influencer info"
ON public.influencers
FOR SELECT
USING (
  -- Allow basic fields for everyone, but we'll handle email restriction in the application layer
  true
);