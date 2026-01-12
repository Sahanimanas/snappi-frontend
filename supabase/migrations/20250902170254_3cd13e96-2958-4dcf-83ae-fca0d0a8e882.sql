-- Remove Yoshaan from influencers
DELETE FROM public.influencers WHERE name = 'Yoshaan';

-- Add average_views column to influencers table
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS average_views integer;

-- Update the three influencers with realistic average views data
UPDATE public.influencers 
SET average_views = 15000 
WHERE name = 'Sofia Martinez';

UPDATE public.influencers 
SET average_views = 8500 
WHERE name = 'James Thompson';

UPDATE public.influencers 
SET average_views = 22000 
WHERE name = 'Maya Chen';