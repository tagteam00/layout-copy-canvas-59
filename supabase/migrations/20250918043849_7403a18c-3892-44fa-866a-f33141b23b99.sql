-- Step 1: Remove compound interests from the interests table
DELETE FROM interests WHERE name IN (
  'Music (Production, Singing, Instruments, Dancing)',
  'Yoga / Pilates', 
  'Basketball / Tennis'
);

-- Step 2: Add new individual interests
INSERT INTO interests (name, category) VALUES
  ('Music Production', 'creative_performing_arts'),
  ('Singing', 'creative_performing_arts'),
  ('Music Instruments', 'creative_performing_arts'),
  ('Dancing', 'creative_performing_arts'),
  ('Yoga', 'lifestyle_mind_wellness'),
  ('Pilates', 'lifestyle_mind_wellness'),
  ('Basketball', 'sports_fitness'),
  ('Tennis', 'sports_fitness');

-- Step 3: Clean up user profiles - remove only the specific compound interests
-- Remove "Music (Production, Singing, Instruments, Dancing)" from affected users
UPDATE profiles 
SET interests = array_remove(interests, 'Music (Production, Singing, Instruments, Dancing)')
WHERE 'Music (Production, Singing, Instruments, Dancing)' = ANY(interests);

-- Remove "Yoga / Pilates" from affected users
UPDATE profiles 
SET interests = array_remove(interests, 'Yoga / Pilates')
WHERE 'Yoga / Pilates' = ANY(interests);

-- Remove "Basketball / Tennis" from affected users  
UPDATE profiles 
SET interests = array_remove(interests, 'Basketball / Tennis')
WHERE 'Basketball / Tennis' = ANY(interests);