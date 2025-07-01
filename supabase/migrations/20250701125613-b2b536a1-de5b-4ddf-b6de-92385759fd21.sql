
-- Allow project owners to view and update applications for their projects
CREATE POLICY "Project owners can view applications for their projects"
ON public.applications
FOR SELECT
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE author_id = auth.uid()
  )
);

-- Allow project owners to update application status
CREATE POLICY "Project owners can update application status"
ON public.applications
FOR UPDATE
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE author_id = auth.uid()
  )
)
WITH CHECK (
  project_id IN (
    SELECT id FROM public.projects WHERE author_id = auth.uid()
  )
);
