
-- First, let's see what the current constraint allows
-- Drop the existing constraint that's causing issues
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_status_check;

-- Create a new constraint that allows the correct status values
ALTER TABLE public.applications 
ADD CONSTRAINT applications_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));
