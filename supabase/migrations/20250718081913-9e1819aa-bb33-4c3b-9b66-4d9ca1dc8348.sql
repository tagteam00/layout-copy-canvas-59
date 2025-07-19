-- First migration: Add new enum values for interest categories
ALTER TYPE interest_category ADD VALUE 'tech_gaming';
ALTER TYPE interest_category ADD VALUE 'lifestyle_wellness';
ALTER TYPE interest_category ADD VALUE 'science_learning';
ALTER TYPE interest_category ADD VALUE 'culinary_foods';
ALTER TYPE interest_category ADD VALUE 'collecting';
ALTER TYPE interest_category ADD VALUE 'social_entertainment';