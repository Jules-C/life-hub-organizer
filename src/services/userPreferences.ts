import { supabase } from './supabase';

export interface FeatureToggles {
  healthTracking: boolean;
  healthPrivacy: boolean;
  personalEvents: boolean;
  workSchedule: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  browser: boolean;
  documents: boolean;
  calendar: boolean;
  tasks: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface UserPreferences {
  id?: string;
  user_id?: string;
  features: FeatureToggles;
  notifications: NotificationPreferences;
  created_at?: string;
  updated_at?: string;
}

export const userPreferencesService = {
  async getUserPreferences() {
    try {
      // First try to get existing preferences
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .single();
      
      // If there's an error other than "not found", throw it
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      // If preferences were found, return them
      if (data) {
        return data;
      }
      
      // Get the current authenticated user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('Authentication required to initialize preferences');
      }
      
      // If no preferences exist, create default ones WITH user_id
      const defaultPreferences = {
        user_id: userData.user.id, // This is the missing piece!
        features: {
          healthTracking: true,
          healthPrivacy: false,
          personalEvents: true,
          workSchedule: true
        },
        notifications: {
          email: true,
          browser: true,
          documents: true,
          calendar: true,
          tasks: true,
          quietHoursStart: '22:00',
          quietHoursEnd: '08:00'
        }
      };
      
      // Insert and return the default preferences
      const { data: newData, error: insertError } = await supabase
        .from('user_preferences')
        .insert([defaultPreferences])
        .select();
      
      if (insertError) throw insertError;
      return newData[0];
    } catch (error) {
      console.error('Failed to initialize user preferences:', error);
      throw error;
    }
  },
  
  async updateFeatureToggles(features: Partial<FeatureToggles>) {
    // Get current preferences
    const preferences = await this.getUserPreferences();
    
    // Update the features
    const updatedFeatures = {
      ...preferences.features,
      ...features
    };
    
    // Save to database
    const { data, error } = await supabase
      .from('user_preferences')
      .update({ features: updatedFeatures })
      .eq('id', preferences.id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async updateNotificationPreferences(notifications: Partial<NotificationPreferences>) {
    // Get current preferences
    const preferences = await this.getUserPreferences();
    
    // Update the notification settings
    const updatedNotifications = {
      ...preferences.notifications,
      ...notifications
    };
    
    // Save to database
    const { data, error } = await supabase
      .from('user_preferences')
      .update({ notifications: updatedNotifications })
      .eq('id', preferences.id)
      .select();
    
    if (error) throw error;
    return data[0];
  }
};