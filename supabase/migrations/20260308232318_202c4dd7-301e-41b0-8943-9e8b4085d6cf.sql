
CREATE TABLE public.bill_reminders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  amount numeric NOT NULL,
  due_date date NOT NULL,
  is_paid boolean NOT NULL DEFAULT false,
  is_recurring boolean NOT NULL DEFAULT false,
  frequency text,
  notification_days text DEFAULT '3',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.bill_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminders" ON public.bill_reminders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reminders" ON public.bill_reminders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reminders" ON public.bill_reminders FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reminders" ON public.bill_reminders FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_bill_reminders_user_id ON public.bill_reminders(user_id);
CREATE INDEX idx_bill_reminders_due_date ON public.bill_reminders(due_date);
