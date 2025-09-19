-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS validate_instagram_url_trigger ON public.profiles;
DROP TRIGGER IF EXISTS validate_profile_data_trigger ON public.profiles;
DROP FUNCTION IF EXISTS public.validate_profile_instagram_url();
DROP FUNCTION IF EXISTS public.validate_profile_data();
DROP FUNCTION IF EXISTS public.validate_instagram_handle(text);

-- Create simple URL validation function for Instagram URLs
CREATE OR REPLACE FUNCTION public.validate_instagram_url(url text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT url IS NULL OR url = '' OR (
    url ~ '^https?://(www\.)?(instagram\.com|instagr\.am)/' AND
    length(url) <= 500
  );
$function$;

-- Create validation trigger for instagram_url
CREATE OR REPLACE FUNCTION public.validate_profile_instagram_url()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Validate instagram URL format
  IF NOT public.validate_instagram_url(NEW.instagram_url) THEN
    RAISE EXCEPTION 'Invalid Instagram URL format. Must be a valid Instagram URL (https://instagram.com/username or https://www.instagram.com/username)';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Add trigger to validate instagram_url on insert/update
CREATE TRIGGER validate_instagram_url_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_instagram_url();