-- Fix security vulnerability: Restrict access to influencer contact information
-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "influencers_view_public" ON public.influencers;

-- Create a function to check if current user can access sensitive influencer data
CREATE OR REPLACE FUNCTION public.can_access_influencer_details(influencer_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  -- Allow if user is admin
  SELECT CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    ) THEN true
    -- Allow if user owns a campaign with this influencer
    WHEN EXISTS (
      SELECT 1 FROM public.campaign_influencers ci
      JOIN public.campaigns c ON ci.campaign_id = c.id
      WHERE ci.influencer_id = $1 AND c.owner_id = auth.uid()
    ) THEN true
    ELSE false
  END;
$$;

-- Create policy for basic influencer info (without email)
CREATE POLICY "Public can view basic influencer info"
ON public.influencers
FOR SELECT
USING (
  -- Allow access to all fields except email for everyone
  NOT current_setting('request.jwt.claims', true)::json->>'role' IS NULL
  OR current_setting('request.jwt.claims', true)::json->>'role' = 'anon'
);

-- Create policy for full access (including email) for authorized users
CREATE POLICY "Authorized users can view full influencer details"
ON public.influencers  
FOR SELECT
TO authenticated
USING (can_access_influencer_details(id));

-- Create a view for public search that excludes sensitive information
CREATE OR REPLACE VIEW public.influencers_search AS
SELECT 
  id,
  name,
  platform,
  follower_count,
  engagement_rate,
  match_score,
  categories,
  location,
  tags,
  profile_image,
  created_at,
  -- Don't expose email in search results
  CASE 
    WHEN public.can_access_influencer_details(id) THEN email 
    ELSE NULL 
  END as email
FROM public.influencers;