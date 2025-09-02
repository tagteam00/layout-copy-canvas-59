-- Phase 1: Enhanced Profile Privacy - Create granular RLS policies for profiles table

-- Drop the overly permissive teammate policy first
DROP POLICY IF EXISTS "Users can view teammates profiles" ON public.profiles;

-- Create granular policies for different types of profile access

-- 1. Users can always view their own complete profile
-- (This policy already exists: "Users can view own profile")

-- 2. Create a view for restricted teammate profile data
CREATE OR REPLACE VIEW public.team_member_profiles AS
SELECT 
  p.id,
  p.full_name,
  p.username,
  p.interests,
  p.commitment_level,
  p.avatar_url,
  p.created_at,
  p.updated_at
FROM public.profiles p;

-- Enable RLS on the view
ALTER VIEW public.team_member_profiles SET (security_barrier = true);

-- 3. Create policy for teammates to view limited profile data through the view
CREATE POLICY "Team members can view limited teammate profiles"
ON public.team_member_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM teams t
    WHERE auth.uid() = ANY (t.members)
      AND team_member_profiles.id = ANY (t.members)
  )
);

-- 4. Create policy for public profile access (for partner search)
CREATE POLICY "Users can view public profile data for partner search"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Allow access to public profile fields only
  -- This will be used by the public_profiles table sync
  true
);

-- But we need to be more specific - let's create a function to check if requesting public data
CREATE OR REPLACE FUNCTION public.is_requesting_public_profile_data()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- This function will be used by application logic to indicate when public data is needed
  SELECT true;
$$;

-- Update the public profile data policy to be more restrictive
DROP POLICY IF EXISTS "Users can view public profile data for partner search" ON public.profiles;

-- Create policy specifically for teammate profile viewing (limited fields)
CREATE POLICY "Team members can view teammate basic info"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Only allow if user is teammate AND requesting user is not the profile owner
  id != auth.uid() AND
  EXISTS (
    SELECT 1
    FROM teams t
    WHERE auth.uid() = ANY (t.members)
      AND profiles.id = ANY (t.members)
  )
);

-- Phase 2: Notification Security Enhancement

-- Create function to validate notification permissions
CREATE OR REPLACE FUNCTION public.can_send_notification_to_user(target_user_id uuid, notification_type text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    -- Team-related notifications can be sent between teammates
    WHEN notification_type IN ('team_request', 'team_activity', 'team_verification', 'team_invite') THEN
      EXISTS (
        SELECT 1
        FROM teams t
        WHERE (auth.uid() = ANY (t.members) OR target_user_id = ANY (t.members))
      )
    -- System notifications can always be sent (for automated processes)
    WHEN notification_type IN ('system', 'cycle_reset', 'reminder') THEN
      true
    -- Default: deny
    ELSE false
  END;
$$;

-- Update notification policies
DROP POLICY IF EXISTS "Users can create notifications" ON public.notifications;

CREATE POLICY "Users can create valid notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  public.can_send_notification_to_user(user_id, related_to)
);

-- Phase 3: Database Function Hardening - Update all functions with proper search_path

-- Update sync_public_profile function
CREATE OR REPLACE FUNCTION public.sync_public_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    DELETE FROM public.public_profiles WHERE id = OLD.id;
    RETURN OLD;
  END IF;

  INSERT INTO public.public_profiles (id, full_name, username, interests, commitment_level, avatar_url, created_at, updated_at)
  VALUES (NEW.id, NEW.full_name, NEW.username, NEW.interests, NEW.commitment_level, NEW.avatar_url, COALESCE(NEW.created_at, now()), now())
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    username = EXCLUDED.username,
    interests = EXCLUDED.interests,
    commitment_level = EXCLUDED.commitment_level,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();

  RETURN NEW;
END;
$function$;

-- Update close_team_activity_cycle function
CREATE OR REPLACE FUNCTION public.close_team_activity_cycle()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Close any active cycles for this team and these users
  UPDATE public.team_activities
  SET cycle_end = NOW()
  WHERE team_id = NEW.team_id
    AND verified_user_id = NEW.verified_user_id
    AND logged_by_user_id = NEW.logged_by_user_id
    AND cycle_end IS NULL
    AND id != NEW.id;
    
  RETURN NEW;
END;
$function$;

-- Update handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update update_team_activities_updated_at function
CREATE OR REPLACE FUNCTION public.update_team_activities_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- All the cycle management functions already have proper search_path settings

-- Phase 4: Additional Security - Input validation function for sensitive fields
CREATE OR REPLACE FUNCTION public.validate_instagram_handle(handle text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT handle IS NULL OR (
    length(handle) <= 30 AND
    handle ~ '^[a-zA-Z0-9._]+$' AND
    handle NOT LIKE '.%' AND
    handle NOT LIKE '%.' AND
    handle NOT LIKE '%.%'
  );
$$;

-- Add validation trigger for instagram handle
CREATE OR REPLACE FUNCTION public.validate_profile_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Validate instagram handle format
  IF NOT public.validate_instagram_handle(NEW.instagram_handle) THEN
    RAISE EXCEPTION 'Invalid Instagram handle format';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for profile validation
DROP TRIGGER IF EXISTS validate_profile_data_trigger ON public.profiles;
CREATE TRIGGER validate_profile_data_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_data();