// src/types/user.ts

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;
}

export interface UserSettings {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}
