-- Fix Instagram handle validation trigger attachment
-- First, ensure the validation trigger is properly attached to profiles table
DROP TRIGGER IF EXISTS validate_profile_data_trigger ON public.profiles;

CREATE TRIGGER validate_profile_data_trigger
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_profile_data();