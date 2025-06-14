-- Migration to add user type differentiation
-- Run this in your Supabase SQL editor

-- Add user_type column if it doesn't exist
ALTER TABLE prospects 
ADD COLUMN IF NOT EXISTS user_type VARCHAR(50) DEFAULT 'prospect';

-- Add qb_company_id column if it doesn't exist
ALTER TABLE prospects 
ADD COLUMN IF NOT EXISTS qb_company_id VARCHAR(255);

-- Add index for qb_company_id for better performance
CREATE INDEX IF NOT EXISTS idx_prospects_qb_company_id ON prospects(qb_company_id);

-- Update existing prospects to have correct user_type based on email domain
-- (You can customize this logic based on your internal team's email domains)
UPDATE prospects 
SET user_type = 'internal' 
WHERE email LIKE '%@yourcompany.com' 
   OR email LIKE '%@internalteam.com';

-- Add comment to explain user types
COMMENT ON COLUMN prospects.user_type IS 'User type: prospect (sales lead), internal (team member), paid_user (subscription customer)';