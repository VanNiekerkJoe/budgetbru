import { supabase } from '@/integrations/supabase/client';

export type NotificationIconType = 'expense' | 'income' | 'alert' | 'goal' | 'achievement' | 'bill' | 'social' | 'info';
export type NotificationCategory = 'finance' | 'goals' | 'social' | 'alerts';

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationCategory;
  title: string;
  description: string;
  icon_type: NotificationIconType;
  read: boolean;
  created_at: string;
}

export async function fetchNotifications(): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
  return (data || []) as AppNotification[];
}

export async function createNotification(
  notification: Pick<AppNotification, 'type' | 'title' | 'description' | 'icon_type'>
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from('notifications').insert({
    user_id: user.id,
    type: notification.type,
    title: notification.title,
    description: notification.description,
    icon_type: notification.icon_type,
  });

  if (error) console.error('Failed to create notification:', error);
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);
  if (error) console.error('Failed to mark notification read:', error);
}

export async function markAllNotificationsRead(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false);
  if (error) console.error('Failed to mark all read:', error);
}

export async function deleteNotification(id: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id);
  if (error) console.error('Failed to delete notification:', error);
}

export async function clearAllNotifications(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', user.id);
  if (error) console.error('Failed to clear notifications:', error);
}
