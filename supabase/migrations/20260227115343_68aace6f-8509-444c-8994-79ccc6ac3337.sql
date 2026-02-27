
-- Step 1: Add team_leader to app_role enum (must be committed separately)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'team_leader';
