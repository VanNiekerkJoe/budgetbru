
-- 1. couple_links
CREATE TABLE public.couple_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id_1 uuid NOT NULL,
  user_id_2 uuid,
  invite_code text NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(invite_code)
);

ALTER TABLE public.couple_links ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_couple_links_user1 ON public.couple_links(user_id_1);
CREATE INDEX idx_couple_links_user2 ON public.couple_links(user_id_2);
CREATE INDEX idx_couple_links_invite ON public.couple_links(invite_code);

-- 2. couple_shared_expenses
CREATE TABLE public.couple_shared_expenses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_link_id uuid NOT NULL REFERENCES public.couple_links(id) ON DELETE CASCADE,
  added_by uuid NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL,
  category text NOT NULL DEFAULT 'other',
  split_type text NOT NULL DEFAULT '50/50',
  split_percentage numeric NOT NULL DEFAULT 50,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.couple_shared_expenses ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_couple_expenses_link ON public.couple_shared_expenses(couple_link_id);

-- 3. couple_shared_goals
CREATE TABLE public.couple_shared_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_link_id uuid NOT NULL REFERENCES public.couple_links(id) ON DELETE CASCADE,
  title text NOT NULL,
  target_amount numeric NOT NULL DEFAULT 0,
  current_amount numeric NOT NULL DEFAULT 0,
  deadline date,
  icon text NOT NULL DEFAULT '🎯',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.couple_shared_goals ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_couple_goals_link ON public.couple_shared_goals(couple_link_id);

-- 4. couple_wishlists
CREATE TABLE public.couple_wishlists (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_link_id uuid NOT NULL REFERENCES public.couple_links(id) ON DELETE CASCADE,
  added_by uuid NOT NULL,
  title text NOT NULL,
  estimated_cost numeric NOT NULL DEFAULT 0,
  priority text NOT NULL DEFAULT 'medium',
  is_purchased boolean NOT NULL DEFAULT false,
  url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.couple_wishlists ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_couple_wishlists_link ON public.couple_wishlists(couple_link_id);

-- 5. couple_messages
CREATE TABLE public.couple_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_link_id uuid NOT NULL REFERENCES public.couple_links(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.couple_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_couple_messages_link ON public.couple_messages(couple_link_id);

-- Security definer function
CREATE OR REPLACE FUNCTION public.is_couple_member(_user_id uuid, _couple_link_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.couple_links
    WHERE id = _couple_link_id
      AND status = 'active'
      AND (_user_id = user_id_1 OR _user_id = user_id_2)
  )
$$;

-- RLS policies for couple_links
CREATE POLICY "Users can view own links" ON public.couple_links FOR SELECT TO authenticated
  USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);
CREATE POLICY "Users can view pending invites" ON public.couple_links FOR SELECT TO authenticated
  USING (status = 'pending');
CREATE POLICY "Users can insert own links" ON public.couple_links FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id_1);
CREATE POLICY "Users can update own links" ON public.couple_links FOR UPDATE TO authenticated
  USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);
CREATE POLICY "Users can delete own links" ON public.couple_links FOR DELETE TO authenticated
  USING (auth.uid() = user_id_1);

-- RLS for shared expenses
CREATE POLICY "Couple members can view expenses" ON public.couple_shared_expenses FOR SELECT TO authenticated
  USING (public.is_couple_member(auth.uid(), couple_link_id));
CREATE POLICY "Couple members can insert expenses" ON public.couple_shared_expenses FOR INSERT TO authenticated
  WITH CHECK (public.is_couple_member(auth.uid(), couple_link_id) AND auth.uid() = added_by);
CREATE POLICY "Couple members can update expenses" ON public.couple_shared_expenses FOR UPDATE TO authenticated
  USING (public.is_couple_member(auth.uid(), couple_link_id));
CREATE POLICY "Couple members can delete expenses" ON public.couple_shared_expenses FOR DELETE TO authenticated
  USING (public.is_couple_member(auth.uid(), couple_link_id));

-- RLS for shared goals
CREATE POLICY "Couple members can view goals" ON public.couple_shared_goals FOR SELECT TO authenticated
  USING (public.is_couple_member(auth.uid(), couple_link_id));
CREATE POLICY "Couple members can insert goals" ON public.couple_shared_goals FOR INSERT TO authenticated
  WITH CHECK (public.is_couple_member(auth.uid(), couple_link_id));
CREATE POLICY "Couple members can update goals" ON public.couple_shared_goals FOR UPDATE TO authenticated
  USING (public.is_couple_member(auth.uid(), couple_link_id));
CREATE POLICY "Couple members can delete goals" ON public.couple_shared_goals FOR DELETE TO authenticated
  USING (public.is_couple_member(auth.uid(), couple_link_id));

-- RLS for wishlists
CREATE POLICY "Couple members can view wishlists" ON public.couple_wishlists FOR SELECT TO authenticated
  USING (public.is_couple_member(auth.uid(), couple_link_id));
CREATE POLICY "Couple members can insert wishlists" ON public.couple_wishlists FOR INSERT TO authenticated
  WITH CHECK (public.is_couple_member(auth.uid(), couple_link_id) AND auth.uid() = added_by);
CREATE POLICY "Couple members can update wishlists" ON public.couple_wishlists FOR UPDATE TO authenticated
  USING (public.is_couple_member(auth.uid(), couple_link_id));
CREATE POLICY "Couple members can delete wishlists" ON public.couple_wishlists FOR DELETE TO authenticated
  USING (public.is_couple_member(auth.uid(), couple_link_id));

-- RLS for messages
CREATE POLICY "Couple members can view messages" ON public.couple_messages FOR SELECT TO authenticated
  USING (public.is_couple_member(auth.uid(), couple_link_id));
CREATE POLICY "Couple members can insert messages" ON public.couple_messages FOR INSERT TO authenticated
  WITH CHECK (public.is_couple_member(auth.uid(), couple_link_id) AND auth.uid() = sender_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.couple_messages;
