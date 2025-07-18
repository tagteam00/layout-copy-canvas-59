-- First, update the interest_category enum to include the new categories
ALTER TYPE interest_category ADD VALUE 'tech_gaming';
ALTER TYPE interest_category ADD VALUE 'lifestyle_wellness';
ALTER TYPE interest_category ADD VALUE 'science_learning';
ALTER TYPE interest_category ADD VALUE 'culinary_foods';
ALTER TYPE interest_category ADD VALUE 'collecting';
ALTER TYPE interest_category ADD VALUE 'social_entertainment';

-- Insert new interests for Tech and Gaming category
INSERT INTO interests (name, category) VALUES
('Video Games', 'tech_gaming'),
('Coding', 'tech_gaming'),
('UI/UX', 'tech_gaming'),
('Hacking', 'tech_gaming'),
('Cybersecurity', 'tech_gaming'),
('Robotics', 'tech_gaming'),
('AI & ML', 'tech_gaming'),
('3D Modelling', 'tech_gaming'),
('3D Printing', 'tech_gaming'),
('Game Development', 'tech_gaming'),
('App Development', 'tech_gaming'),
('RC Aircrafts', 'tech_gaming');

-- Insert new interests for Lifestyle and Wellness category
INSERT INTO interests (name, category) VALUES
('Meditation', 'lifestyle_wellness'),
('Journaling', 'lifestyle_wellness'),
('Personal Finance', 'lifestyle_wellness'),
('DIY Projects', 'lifestyle_wellness'),
('Home Gardening', 'lifestyle_wellness'),
('Self-Improvement', 'lifestyle_wellness'),
('Crochet', 'lifestyle_wellness'),
('Knitting', 'lifestyle_wellness'),
('Bonsai', 'lifestyle_wellness'),
('Origami', 'lifestyle_wellness');

-- Insert new interests for Science and Learning category
INSERT INTO interests (name, category) VALUES
('Astronomy', 'science_learning'),
('Astrology', 'science_learning'),
('Psychology', 'science_learning'),
('Philosophy', 'science_learning'),
('History', 'science_learning'),
('Mythology', 'science_learning'),
('Language Learning', 'science_learning');

-- Insert new interests for Culinary and Foods category
INSERT INTO interests (name, category) VALUES
('Cooking', 'culinary_foods'),
('Baking', 'culinary_foods'),
('Coffee Brewing', 'culinary_foods'),
('Wine Tasting', 'culinary_foods'),
('Meal Prepping', 'culinary_foods');

-- Insert new interests for Collecting category
INSERT INTO interests (name, category) VALUES
('Currency Collecting', 'collecting'),
('Comic Books', 'collecting'),
('Trading Cards', 'collecting'),
('Vinyl Records', 'collecting'),
('Antiques', 'collecting');

-- Insert new interests for Social and Entertainment category
INSERT INTO interests (name, category) VALUES
('Podcasting', 'social_entertainment'),
('Stand-up Comedy', 'social_entertainment'),
('Public Speaking', 'social_entertainment'),
('Book Clubs', 'social_entertainment'),
('Cinema', 'social_entertainment');