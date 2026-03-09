-- Allow users to join pending couple links
CREATE POLICY "Users can join pending links" 
ON public.couple_links 
FOR UPDATE 
USING (status = 'pending' AND user_id_2 IS NULL)
WITH CHECK (status = 'active' AND user_id_2 = auth.uid());