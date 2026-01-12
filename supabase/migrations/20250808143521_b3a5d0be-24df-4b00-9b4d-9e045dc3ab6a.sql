-- Fix linter: set immutable search_path for created functions
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.has_role(uuid, public.app_role) SET search_path = public;
ALTER FUNCTION public.is_campaign_owner(uuid) SET search_path = public;
ALTER FUNCTION public.is_shortlist_owner(uuid) SET search_path = public;