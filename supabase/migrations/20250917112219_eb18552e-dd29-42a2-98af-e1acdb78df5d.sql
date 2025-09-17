-- Update interest categories and interests with new comprehensive list

-- First, clear existing interests
DELETE FROM interests;

-- Drop existing enum if it exists and recreate with new categories
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

-- Update the interests table to use the new enum
ALTER TABLE interests ALTER COLUMN category TYPE interest_category USING category::text::interest_category;

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