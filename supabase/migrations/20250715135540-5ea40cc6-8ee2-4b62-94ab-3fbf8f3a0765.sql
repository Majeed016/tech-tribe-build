
-- Create a table for project ratings
CREATE TABLE public.project_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL, -- User giving the rating
  rated_user_id UUID NOT NULL, -- User being rated
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Ensure a user can't rate the same teammate twice for the same project
  UNIQUE(project_id, rater_id, rated_user_id),
  
  -- Ensure a user can't rate themselves
  CHECK (rater_id != rated_user_id)
);

-- Enable RLS
ALTER TABLE public.project_ratings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all ratings (for profile display)
CREATE POLICY "Anyone can view ratings" 
  ON public.project_ratings 
  FOR SELECT 
  USING (true);

-- Policy: Users can create ratings for projects they were part of
CREATE POLICY "Users can create ratings for their projects" 
  ON public.project_ratings 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = rater_id AND
    (
      -- User is the project owner
      project_id IN (
        SELECT id FROM public.projects WHERE author_id = auth.uid()
      ) OR
      -- User has an approved application for this project
      project_id IN (
        SELECT project_id FROM public.applications 
        WHERE applicant_id = auth.uid() AND status = 'approved'
      )
    )
  );

-- Policy: Users can update their own ratings
CREATE POLICY "Users can update their own ratings" 
  ON public.project_ratings 
  FOR UPDATE 
  USING (auth.uid() = rater_id);

-- Create a view for user rating statistics
CREATE OR REPLACE VIEW public.user_rating_stats AS
SELECT 
  rated_user_id as user_id,
  COUNT(*) as total_ratings,
  ROUND(AVG(rating), 2) as average_rating,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_count,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star_count,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star_count,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star_count,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star_count
FROM public.project_ratings
GROUP BY rated_user_id;

-- Create an index for better performance
CREATE INDEX idx_project_ratings_rated_user ON public.project_ratings(rated_user_id);
CREATE INDEX idx_project_ratings_project ON public.project_ratings(project_id);
