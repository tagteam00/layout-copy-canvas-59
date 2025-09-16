-- Add reset_day to team_requests and teams to explicitly store weekly reset day
ALTER TABLE public.team_requests
ADD COLUMN IF NOT EXISTS reset_day TEXT;

ALTER TABLE public.teams
ADD COLUMN IF NOT EXISTS reset_day TEXT;

-- Update functions to use reset_day when available, fallback to parsing from frequency
CREATE OR REPLACE FUNCTION public.close_expired_activity_cycles()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  activity_cycles_closed INTEGER := 0;
  goal_cycles_closed INTEGER := 0;
  team_record RECORD;
  activity_record RECORD;
  cycle_should_end TIMESTAMP WITH TIME ZONE;
  reset_day_name TEXT;
  reset_day_num INTEGER;
  days_until_reset INTEGER;
BEGIN
  -- Loop through all teams to check for expired cycles
  FOR team_record IN 
    SELECT DISTINCT t.id, t.frequency, t.created_at, t.reset_day
    FROM teams t
    INNER JOIN team_activities ta ON t.id = ta.team_id
    WHERE ta.cycle_end IS NULL
      AND t.ended_at IS NULL
  LOOP
    -- Determine reset day name from column if present, else parse from frequency
    IF team_record.frequency ILIKE '%weekly%' THEN
      reset_day_name := COALESCE(team_record.reset_day, SUBSTRING(team_record.frequency FROM '\\((.+)\\)'));
      reset_day_num := CASE LOWER(reset_day_name)
        WHEN 'sunday' THEN 0
        WHEN 'monday' THEN 1
        WHEN 'tuesday' THEN 2
        WHEN 'wednesday' THEN 3
        WHEN 'thursday' THEN 4
        WHEN 'friday' THEN 5
        WHEN 'saturday' THEN 6
        ELSE 1
      END;
      days_until_reset := (reset_day_num - EXTRACT(DOW FROM NOW())::INTEGER + 7) % 7;
      IF days_until_reset = 0 THEN
        days_until_reset := 7;
      END IF;
      cycle_should_end := DATE_TRUNC('day', NOW()) + INTERVAL '1 day' * days_until_reset;
    ELSE
      -- Default daily behavior
      cycle_should_end := DATE_TRUNC('day', NOW()) + INTERVAL '1 day';
    END IF;
    
    -- Close activity cycles that should have ended
    FOR activity_record IN
      SELECT ta.id, ta.cycle_start
      FROM team_activities ta
      WHERE ta.team_id = team_record.id
        AND ta.cycle_end IS NULL
        AND ta.cycle_start < (NOW() - INTERVAL '1 day')
    LOOP
      DECLARE
        actual_cycle_end TIMESTAMP WITH TIME ZONE;
      BEGIN
        IF team_record.frequency ILIKE '%daily%' THEN
          actual_cycle_end := DATE_TRUNC('day', activity_record.cycle_start) + INTERVAL '1 day';
        ELSE
          -- Weekly: previous reset boundary
          actual_cycle_end := cycle_should_end - INTERVAL '7 days';
        END IF;
        
        IF actual_cycle_end <= NOW() THEN
          UPDATE team_activities
          SET cycle_end = actual_cycle_end
          WHERE id = activity_record.id;
          activity_cycles_closed := activity_cycles_closed + 1;
        END IF;
      END;
    END LOOP;
  END LOOP;
  
  -- Also close expired goal cycles
  goal_cycles_closed := close_expired_goal_cycles();
  
  RETURN activity_cycles_closed + goal_cycles_closed;
END;
$$;

CREATE OR REPLACE FUNCTION public.close_expired_goal_cycles()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cycles_closed INTEGER := 0;
  team_record RECORD;
  goal_record RECORD;
  cycle_should_end TIMESTAMP WITH TIME ZONE;
  reset_day_name TEXT;
  reset_day_num INTEGER;
  days_until_reset INTEGER;
BEGIN
  -- Loop through all teams to check for expired goal cycles
  FOR team_record IN 
    SELECT DISTINCT t.id, t.frequency, t.created_at, t.reset_day
    FROM teams t
    INNER JOIN team_goals tg ON t.id = tg.team_id
    WHERE tg.cycle_end IS NULL
      AND t.ended_at IS NULL
  LOOP
    IF team_record.frequency ILIKE '%weekly%' THEN
      reset_day_name := COALESCE(team_record.reset_day, SUBSTRING(team_record.frequency FROM '\\((.+)\\)'));
      reset_day_num := CASE LOWER(reset_day_name)
        WHEN 'sunday' THEN 0
        WHEN 'monday' THEN 1
        WHEN 'tuesday' THEN 2
        WHEN 'wednesday' THEN 3
        WHEN 'thursday' THEN 4
        WHEN 'friday' THEN 5
        WHEN 'saturday' THEN 6
        ELSE 1
      END;
      days_until_reset := (reset_day_num - EXTRACT(DOW FROM NOW())::INTEGER + 7) % 7;
      IF days_until_reset = 0 THEN
        days_until_reset := 7;
      END IF;
      cycle_should_end := DATE_TRUNC('day', NOW()) + INTERVAL '1 day' * days_until_reset;
    ELSE
      cycle_should_end := DATE_TRUNC('day', NOW()) + INTERVAL '1 day';
    END IF;
    
    -- Close goal cycles that should have ended
    FOR goal_record IN
      SELECT tg.id, tg.cycle_start
      FROM team_goals tg
      WHERE tg.team_id = team_record.id
        AND tg.cycle_end IS NULL
        AND tg.cycle_start < (NOW() - INTERVAL '1 day')
    LOOP
      DECLARE
        actual_cycle_end TIMESTAMP WITH TIME ZONE;
      BEGIN
        IF team_record.frequency ILIKE '%daily%' THEN
          actual_cycle_end := DATE_TRUNC('day', goal_record.cycle_start) + INTERVAL '1 day';
        ELSE
          actual_cycle_end := cycle_should_end - INTERVAL '7 days';
        END IF;
        
        IF actual_cycle_end <= NOW() THEN
          UPDATE team_goals
          SET cycle_end = actual_cycle_end
          WHERE id = goal_record.id;
          cycles_closed := cycles_closed + 1;
        END IF;
      END;
    END LOOP;
  END LOOP;
  
  RETURN cycles_closed;
END;
$$;

CREATE OR REPLACE FUNCTION public.close_team_activity_cycle(team_id_param uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  activity_cycles_closed INTEGER := 0;
  goal_cycles_closed INTEGER := 0;
  team_record RECORD;
  activity_record RECORD;
  reset_day_name TEXT;
  reset_day_num INTEGER;
  days_to_add INTEGER;
BEGIN
  -- Get team information
  SELECT id, frequency, created_at, reset_day INTO team_record
  FROM teams
  WHERE id = team_id_param AND ended_at IS NULL;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Close expired activity cycles for this specific team
  FOR activity_record IN
    SELECT ta.id, ta.cycle_start
    FROM team_activities ta
    WHERE ta.team_id = team_record.id
      AND ta.cycle_end IS NULL
  LOOP
    DECLARE
      actual_cycle_end TIMESTAMP WITH TIME ZONE;
    BEGIN
      IF team_record.frequency ILIKE '%daily%' THEN
        actual_cycle_end := DATE_TRUNC('day', activity_record.cycle_start) + INTERVAL '1 day';
      ELSIF team_record.frequency ILIKE '%weekly%' THEN
        reset_day_name := COALESCE(team_record.reset_day, SUBSTRING(team_record.frequency FROM '\\((.+)\\)'));
        reset_day_num := CASE LOWER(reset_day_name)
          WHEN 'sunday' THEN 0
          WHEN 'monday' THEN 1
          WHEN 'tuesday' THEN 2
          WHEN 'wednesday' THEN 3
          WHEN 'thursday' THEN 4
          WHEN 'friday' THEN 5
          WHEN 'saturday' THEN 6
          ELSE 1
        END;
        
        -- Calculate how many days to add to cycle_start to reach next reset day
        days_to_add := (reset_day_num - EXTRACT(DOW FROM activity_record.cycle_start)::INTEGER + 7) % 7;
        IF days_to_add = 0 THEN
          days_to_add := 7;
        END IF;
        
        actual_cycle_end := DATE_TRUNC('day', activity_record.cycle_start) + INTERVAL '1 day' * days_to_add;
      ELSE
        actual_cycle_end := DATE_TRUNC('day', activity_record.cycle_start) + INTERVAL '1 day';
      END IF;
      
      IF actual_cycle_end <= NOW() THEN
        UPDATE team_activities
        SET cycle_end = actual_cycle_end
        WHERE id = activity_record.id;
        activity_cycles_closed := activity_cycles_closed + 1;
      END IF;
    END;
  END LOOP;
  
  -- Also close expired goal cycles for this team
  goal_cycles_closed := close_team_goal_cycle(team_id_param);
  
  RETURN activity_cycles_closed + goal_cycles_closed;
END;
$$;

CREATE OR REPLACE FUNCTION public.close_team_goal_cycle(team_id_param uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cycles_closed INTEGER := 0;
  team_record RECORD;
  goal_record RECORD;
  reset_day_name TEXT;
  reset_day_num INTEGER;
  days_to_add INTEGER;
BEGIN
  -- Get team information
  SELECT id, frequency, created_at, reset_day INTO team_record
  FROM teams
  WHERE id = team_id_param AND ended_at IS NULL;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Close expired goal cycles for this specific team
  FOR goal_record IN
    SELECT tg.id, tg.cycle_start
    FROM team_goals tg
    WHERE tg.team_id = team_record.id
      AND tg.cycle_end IS NULL
  LOOP
    DECLARE
      actual_cycle_end TIMESTAMP WITH TIME ZONE;
    BEGIN
      IF team_record.frequency ILIKE '%daily%' THEN
        actual_cycle_end := DATE_TRUNC('day', goal_record.cycle_start) + INTERVAL '1 day';
      ELSIF team_record.frequency ILIKE '%weekly%' THEN
        reset_day_name := COALESCE(team_record.reset_day, SUBSTRING(team_record.frequency FROM '\\((.+)\\)'));
        reset_day_num := CASE LOWER(reset_day_name)
          WHEN 'sunday' THEN 0
          WHEN 'monday' THEN 1
          WHEN 'tuesday' THEN 2
          WHEN 'wednesday' THEN 3
          WHEN 'thursday' THEN 4
          WHEN 'friday' THEN 5
          WHEN 'saturday' THEN 6
          ELSE 1
        END;
        
        -- Calculate how many days to add to cycle_start to reach next reset day
        days_to_add := (reset_day_num - EXTRACT(DOW FROM goal_record.cycle_start)::INTEGER + 7) % 7;
        IF days_to_add = 0 THEN
          days_to_add := 7;
        END IF;
        
        actual_cycle_end := DATE_TRUNC('day', goal_record.cycle_start) + INTERVAL '1 day' * days_to_add;
      ELSE
        actual_cycle_end := DATE_TRUNC('day', goal_record.cycle_start) + INTERVAL '1 day';
      END IF;
      
      IF actual_cycle_end <= NOW() THEN
        UPDATE team_goals
        SET cycle_end = actual_cycle_end
        WHERE id = goal_record.id;
        cycles_closed := cycles_closed + 1;
      END IF;
    END;
  END LOOP;
  
  RETURN cycles_closed;
END;
$$;