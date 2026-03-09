-- Create table to track individual goal contributions
CREATE TABLE public.couple_goal_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL,
  contributor_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  contribution_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.couple_goal_contributions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Couple members can view goal contributions"
ON public.couple_goal_contributions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.couple_shared_goals csg
    WHERE csg.id = goal_id
      AND is_couple_member(auth.uid(), csg.couple_link_id)
  )
);

CREATE POLICY "Couple members can add contributions"
ON public.couple_goal_contributions
FOR INSERT
WITH CHECK (
  auth.uid() = contributor_id
  AND EXISTS (
    SELECT 1 FROM public.couple_shared_goals csg
    WHERE csg.id = goal_id
      AND is_couple_member(auth.uid(), csg.couple_link_id)
  )
);

CREATE POLICY "Contributors can update their own contributions"
ON public.couple_goal_contributions
FOR UPDATE
USING (auth.uid() = contributor_id);

CREATE POLICY "Contributors can delete their own contributions"
ON public.couple_goal_contributions
FOR DELETE
USING (auth.uid() = contributor_id);

-- Add foreign key constraint
ALTER TABLE public.couple_goal_contributions
ADD CONSTRAINT couple_goal_contributions_goal_id_fkey
FOREIGN KEY (goal_id) REFERENCES public.couple_shared_goals(id) ON DELETE CASCADE;