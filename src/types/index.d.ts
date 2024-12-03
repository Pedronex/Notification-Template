export type NotificationMessage = {
  to: string | string[];
  _contentAvailable?: boolean; // iOS Only
  data: object;
  title: string;
  body: string;
  ttl?: number;
  expiration?: number;
  priority?: 'default' | 'normal' | 'high';
  subtitle?: string; // iOS Only
  sound?: 'default' | null; // iOS Only
  badge?: number; // iOS Only
  channelId?: string; // Android Only
  categoryId?: string;
  mutableContent?: boolean; // iOS Only
};