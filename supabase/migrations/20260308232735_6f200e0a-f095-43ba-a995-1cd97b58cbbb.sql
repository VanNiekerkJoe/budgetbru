
CREATE TABLE public.ious (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  person text NOT NULL,
  amount numeric NOT NULL,
  paid_amount numeric NOT NULL DEFAULT 0,
  description text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  is_owed_to_me boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'pending',
  category text NOT NULL DEFAULT 'other',
  notes text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.ious ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ious" ON public.ious FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ious" ON public.ious FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ious" ON public.ious FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ious" ON public.ious FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_ious_user_id ON public.ious(user_id);
CREATE INDEX idx_ious_status ON public.ious(status);

CREATE TABLE public.iou_splits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  total_amount numeric NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  participants jsonb NOT NULL DEFAULT '[]',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.iou_splits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own splits" ON public.iou_splits FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own splits" ON public.iou_splits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own splits" ON public.iou_splits FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own splits" ON public.iou_splits FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_iou_splits_user_id ON public.iou_splits(user_id);
