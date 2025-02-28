import { supabase } from '../supabase';
import type { PostgrestError } from '@supabase/supabase-js';

export interface PersonalEvent {
  id?: string;
  user_id?: string;
  family_id?: string;
  title: string;
  description?: string;
  start_time: string; // ISO datetime format
  end_time: string; // ISO datetime format
  location?: string;
  is_all_day: boolean;
  recurrence_rule?: string; // iCal format for repeating events
  event_type: string; // 'work', 'personal', 'health', etc.
  color?: string;
  visibility: 'private' | 'family' | 'public';
}

export interface EventSharing {
  id?: string;
  event_id: string;
  shared_with: string; // user_id
  permission: 'view' | 'edit' | 'admin';
  status: 'pending' | 'accepted' | 'declined';
}

export interface EventResponse {
  data: PersonalEvent[] | null;
  error: PostgrestError | null;
}

export const personalEventService = {
  /**
   * Create a new personal event
   */
  async createEvent(event: PersonalEvent): Promise<{ data: PersonalEvent | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('personal_events')
      .insert(event)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Update an existing event
   */
  async updateEvent(id: string, updates: Partial<PersonalEvent>): Promise<{ data: PersonalEvent | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('personal_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Get events for a specific date range
   */
  async getEventsForDateRange(startDate: string, endDate: string): Promise<EventResponse> {
    try {
      // First approach: Get events that start within the date range
      const query = supabase
        .from('personal_events')
        .select('*')
        .gte('start_time', startDate)
        .lt('start_time', endDate)
        .order('start_time', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Supabase query error:', error);
        return { data: [], error };
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error in getEventsForDateRange:', err);
      return { data: [], error: err as any };
    }
  },
  /**
   * Get all events for the current user
   */
  async getAllEvents(): Promise<EventResponse> {
    const { data, error } = await supabase
      .from('personal_events')
      .select('*')
      .order('start_time', { ascending: true });
    
    return { data, error };
  },

  /**
   * Get work schedule events
   */
  async getWorkSchedule(startDate: string, endDate: string): Promise<EventResponse> {
    const { data, error } = await supabase
      .from('personal_events')
      .select('*')
      .eq('event_type', 'work')
      .or(`start_time.gte.${startDate},end_time.gte.${startDate}`)
      .lt('start_time', endDate)
      .order('start_time', { ascending: true });
    
    return { data, error };
  },

  /**
   * Delete an event
   */
  async deleteEvent(id: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await supabase
      .from('personal_events')
      .delete()
      .eq('id', id);
    
    return { error };
  },

  /**
   * Share an event with another user
   */
  async shareEvent(eventSharing: EventSharing): Promise<{ data: EventSharing | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('event_sharing')
      .insert(eventSharing)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Update event sharing permissions or status
   */
  async updateEventSharing(id: string, updates: Partial<EventSharing>): Promise<{ data: EventSharing | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('event_sharing')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Get events shared with the current user
   */
  async getSharedEvents(): Promise<EventResponse> {
    const { data, error } = await supabase
      .from('personal_events')
      .select(`
        *,
        event_sharing!inner(
          id,
          permission,
          status
        )
      `)
      .eq('event_sharing.status', 'accepted')
      .order('start_time', { ascending: true });
    
    return { data, error };
  },

  /**
   * Get pending event sharing requests
   */
  async getPendingShares(): Promise<{ data: any[] | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('event_sharing')
      .select(`
        *,
        personal_events(
          id,
          title,
          start_time,
          end_time,
          event_type
        )
      `)
      .eq('status', 'pending');
    
    return { data, error };
  },

  /**
   * Respond to a sharing request
   */
  async respondToShare(id: string, status: 'accepted' | 'declined'): Promise<{ error: PostgrestError | null }> {
    const { error } = await supabase
      .from('event_sharing')
      .update({ status })
      .eq('id', id);
    
    return { error };
  }
};
