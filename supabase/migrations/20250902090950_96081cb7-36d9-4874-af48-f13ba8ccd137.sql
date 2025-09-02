-- 1) Remove overly permissive profiles SELECT policy and add safer ones
DO $$
BEGIN
  -- Drop existing permissive policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view all profiles'
  ) THEN
    DROP POLICY "Users can view all profiles" ON public.profiles;
  END IF;
END$$;

-- Ensure RLS is enabled on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create or replace SELECT policies
DO $$
BEGIN
  -- Own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);
  END IF;
  
  -- Teammates' profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view teammates profiles'
  ) THEN
    CREATE POLICY "Users can view teammates profiles"
    ON public.profiles
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.teams t
        WHERE auth.uid() = ANY(t.members)
          AND profiles.id = ANY(t.members)
      )
    );
  END IF;
END$$;

-- 2) Create a public_profiles table exposing only non-sensitive fields for discovery
CREATE TABLE IF NOT EXISTS public.public_profiles (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name text,
  username text,
  interests text[],
  commitment_level text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS for public_profiles
ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;

-- Allow everyone authenticated to read minimal discovery data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'public_profiles' AND policyname = 'Allow authenticated to select public profiles'
  ) THEN
    CREATE POLICY "Allow authenticated to select public profiles"
    ON public.public_profiles
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END$$;

-- Do not allow inserts/updates/deletes from clients (no policies for those)

-- 3) Sync mechanics: function + triggers to keep public_profiles in sync with profiles
CREATE OR REPLACE FUNCTION public.sync_public_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Triggers on profiles
DROP TRIGGER IF EXISTS trg_profiles_sync_public ON public.profiles;
CREATE TRIGGER trg_profiles_sync_public
AFTER INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_public_profile();

DROP TRIGGER IF EXISTS trg_profiles_sync_public_del ON public.profiles;
CREATE TRIGGER trg_profiles_sync_public_del
AFTER DELETE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_public_profile();

-- 4) Backfill existing data into public_profiles
INSERT INTO public.public_profiles (id, full_name, username, interests, commitment_level, avatar_url)
SELECT p.id, p.full_name, p.username, p.interests, p.commitment_level, p.avatar_url
FROM public.profiles p
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  username = EXCLUDED.username,
  interests = EXCLUDED.interests,
  commitment_level = EXCLUDED.commitment_level,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = now();