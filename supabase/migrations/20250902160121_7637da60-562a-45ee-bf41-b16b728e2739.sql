-- Fix security vulnerability: Restrict access to influencer contact information
-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "influencers_view_public" ON public.influencers;

-- Create a view for public influencer data (without sensitive info)
CREATE OR REPLACE VIEW public.influencers_public AS
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
  created_at
FROM public.influencers;

-- Allow public read access to the non-sensitive view
CREATE POLICY "Public can view basic influencer info"
ON public.influencers_public
FOR SELECT
USING (true);

-- Restrict full influencer access to authenticated users with campaign relationships
CREATE POLICY "Campaign owners can view full influencer details"
ON public.influencers
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.campaign_influencers ci
    JOIN public.campaigns c ON ci.campaign_id = c.id
    WHERE ci.influencer_id = influencers.id 
    AND c.owner_id = auth.uid()
  )
);

-- Allow admins to view all influencer data
CREATE POLICY "Admins can view all influencers"
ON public.influencers
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'
  )
);

-- Grant access to the public view
GRANT SELECT ON public.influencers_public TO authenticated, anon;