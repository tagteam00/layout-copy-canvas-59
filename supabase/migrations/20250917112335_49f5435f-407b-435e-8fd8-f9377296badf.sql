-- Update interest categories and interests with new comprehensive list

-- First, clear existing interests
DELETE FROM interests;

-- Drop and recreate the enum with new categories
DROP TYPE IF EXISTS interest_category CASCADE;

CREATE TYPE interest_category AS ENUM (
  'creative_performing_arts',
  'tech_gaming_innovation', 
  'lifestyle_mind_wellness',
  'culinary_food',
  'knowledge_exploration',
  'sports_fitness',
  'social_entertainment'
);

-- Recreate the interests table with proper structure
DROP TABLE IF EXISTS interests CASCADE;

CREATE TABLE interests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category interest_category NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read interests
CREATE POLICY "Allow all users to read interests" 
ON interests FOR SELECT 
USING (true);

-- Insert all new interests with their categories

-- Creative & Performing Arts
INSERT INTO interests (name, category) VALUES
  ('Painting / Drawing', 'creative_performing_arts'),
  ('Photography', 'creative_performing_arts'),
  ('Filmmaking / Editing', 'creative_performing_arts'),
  ('Music (Production, Singing, Instruments, Dancing)', 'creative_performing_arts'),
  ('Graphic Design / Animation', 'creative_performing_arts'),
  ('Writing / Creative Writing', 'creative_performing_arts'),
  ('Reading', 'creative_performing_arts'),
  ('Acting / Theater', 'creative_performing_arts');

-- Tech, Gaming & Innovation
INSERT INTO interests (name, category) VALUES
  ('Video Gaming', 'tech_gaming_innovation'),
  ('Chess', 'tech_gaming_innovation'),
  ('Game / App / Web Development', 'tech_gaming_innovation'),
  ('Coding / Programming', 'tech_gaming_innovation'),
  ('UI/UX Design', 'tech_gaming_innovation'),
  ('AI & Machine Learning', 'tech_gaming_innovation'),
  ('Robotics', 'tech_gaming_innovation');

-- Lifestyle, Mind & Wellness
INSERT INTO interests (name, category) VALUES
  ('Meditation', 'lifestyle_mind_wellness'),
  ('Yoga / Pilates', 'lifestyle_mind_wellness'),
  ('Journaling', 'lifestyle_mind_wellness'),
  ('Self-Improvement', 'lifestyle_mind_wellness'),
  ('Personal Finance', 'lifestyle_mind_wellness'),
  ('DIY Projects', 'lifestyle_mind_wellness'),
  ('Home Gardening', 'lifestyle_mind_wellness'),
  ('Camping', 'lifestyle_mind_wellness');

-- Culinary & Food
INSERT INTO interests (name, category) VALUES
  ('Cooking', 'culinary_food'),
  ('Baking', 'culinary_food'),
  ('Meal Prepping', 'culinary_food'),
  ('Coffee Brewing', 'culinary_food');

-- Knowledge & Exploration
INSERT INTO interests (name, category) VALUES
  ('Psychology', 'knowledge_exploration'),
  ('Philosophy', 'knowledge_exploration'),
  ('History', 'knowledge_exploration'),
  ('Mythology', 'knowledge_exploration'),
  ('Language Learning', 'knowledge_exploration'),
  ('Astronomy / Astrology', 'knowledge_exploration');

-- Sports & Fitness
INSERT INTO interests (name, category) VALUES
  ('Football', 'sports_fitness'),
  ('Cricket', 'sports_fitness'),
  ('MMA', 'sports_fitness'),
  ('Swimming', 'sports_fitness'),
  ('Cycling', 'sports_fitness'),
  ('Running / Jogging', 'sports_fitness'),
  ('Weightlifting', 'sports_fitness'),
  ('Basketball / Tennis', 'sports_fitness');

-- Social & Entertainment
INSERT INTO interests (name, category) VALUES
  ('Podcasting', 'social_entertainment'),
  ('Stand-up Comedy', 'social_entertainment'),
  ('Public Speaking', 'social_entertainment'),
  ('Book Clubs', 'social_entertainment'),
  ('Content Creation (YouTube, Reels, Vlogging)', 'social_entertainment');