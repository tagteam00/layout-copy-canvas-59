-- First, let's identify the user ID for 00tagteam@gmail.com
-- We'll use this in a transaction to safely delete all other user data

DO $$
DECLARE
    keep_user_id UUID;
BEGIN
    -- Get the user ID for 00tagteam@gmail.com from profiles table
    SELECT id INTO keep_user_id 
    FROM auth.users 
    WHERE email = '00tagteam@gmail.com';
    
    -- If the user exists, proceed with cleanup
    IF keep_user_id IS NOT NULL THEN
        -- Delete notifications for all other users
        DELETE FROM notifications WHERE user_id != keep_user_id;
        
        -- Delete team requests where sender or receiver is not the kept user
        DELETE FROM team_requests 
        WHERE sender_id != keep_user_id AND receiver_id != keep_user_id;
        
        -- Delete team goals for all other users
        DELETE FROM team_goals WHERE user_id != keep_user_id;
        
        -- Delete team activities where logged_by_user_id or verified_user_id is not the kept user
        DELETE FROM team_activities 
        WHERE logged_by_user_id != keep_user_id AND verified_user_id != keep_user_id;
        
        -- Delete teams where the kept user is not a member
        DELETE FROM teams 
        WHERE NOT (keep_user_id = ANY(members));
        
        -- Update teams to remove other users from members array, keeping only the kept user
        UPDATE teams 
        SET members = ARRAY[keep_user_id]
        WHERE keep_user_id = ANY(members);
        
        -- Delete profiles for all other users
        DELETE FROM profiles WHERE id != keep_user_id;
        
        RAISE NOTICE 'Cleanup completed. Kept user: %', keep_user_id;
    ELSE
        RAISE EXCEPTION 'User with email 00tagteam@gmail.com not found';
    END IF;
END $$;