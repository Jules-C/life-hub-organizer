import { supabase } from '../supabase';
import type { PostgrestError } from '@supabase/supabase-js';

// In src/services/calendar/personalEvents.ts
import type { CalendarEvent } from '@/types/calendar';
export interface EventSharing {
  id?: string;
  event_id: string;
  shared_with: string; // user_id
  permission: 'view' | 'edit' | 'admin';
  status: 'pending' | 'accepted' | 'declined';
}

export interface EventResponse {
  data: CalendarEvent[] | null;
  error: PostgrestError | null;
}

export const personalEventService = {
  /**
   * Create a new personal event
   */
  async createEvent(event: CalendarEvent): Promise<{ data: CalendarEvent | null; error: PostgrestError | null }> {
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
  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<{ data: CalendarEvent | null; error: PostgrestError | null }> {
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
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Authentication error:', authError);
        return { 
          data: [], 
          error: {
            code: 'AUTH_ERROR',
            message: 'Not authenticated',
            details: null,
            hint: null
          } as unknown as PostgrestError 
        };
      }
  
      // Modified query to handle date ranges more accurately
      const { data, error } = await supabase
        .from('personal_events')
        .select('*')
        .eq('user_id', user.id)
        .or(`start_time.gte.${startDate},end_time.gte.${startDate}`)
        .lt('start_time', endDate)
        .order('start_time', { ascending: true });
      
      if (error) {
        console.error('Supabase query error in getEventsForDateRange:', error);
        return { data: [], error };
      }
      
      // Ensure we're always returning an array even if there's no data
      return { data: data || [], error: null };
    } catch (err) {
      console.error('Unexpected error in getEventsForDateRange:', err);
      return { 
        data: [], 
        error: {
          code: 'UNEXPECTED_ERROR',
          message: String(err),
          details: null,
          hint: null
        } as unknown as PostgrestError 
      };
    }
  },

  /**
   * Get all events for the current user
   */
  async getAllEvents(): Promise<EventResponse> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { 
          data: [], 
          error: {
            code: 'AUTH_ERROR',
            message: 'Not authenticated',
            details: null,
            hint: null
          } as unknown as PostgrestError 
        };
      }

      const { data, error } = await supabase
        .from('personal_events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });
      
      return { data: data || [], error };
    } catch (err) {
      console.error('Unexpected error in getAllEvents:', err);
      return { data: [], error: err as PostgrestError };
    }
  },

  /**
   * Get work schedule events
   */
  async getWorkSchedule(startDate: string, endDate: string): Promise<EventResponse> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { 
          data: [], 
          error: {
            code: 'AUTH_ERROR',
            message: 'Not authenticated',
            details: null,
            hint: null
          } as unknown as PostgrestError 
        };
      }

      // Fixed query syntax for proper filtering
      const { data, error } = await supabase
        .from('personal_events')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_type', 'work')
        .or(`start_time.gte.${startDate},end_time.gte.${startDate}`)
        .lt('start_time', endDate)
        .order('start_time', { ascending: true });
      
      return { data: data || [], error };
    } catch (err) {
      console.error('Unexpected error in getWorkSchedule:', err);
      return { data: [], error: err as PostgrestError };
    }
  },

  /**
   * Delete an event
   * @param id The ID of the event to delete
   * @param deleteEntireSeries Optional parameter to delete all occurrences of a recurring event
   */
  async deleteEvent(id: string, deleteEntireSeries?: boolean): Promise<{ error: PostgrestError | null }> {
    try {
      let query = supabase
        .from('personal_events')
        .delete()
        .eq('id', id);
      
      // If deleting entire series and event has a recurrence rule
      if (deleteEntireSeries) {
        // Get the event first to check if it has a recurrence_rule
        const { data: event } = await supabase
          .from('personal_events')
          .select('recurrence_rule')
          .eq('id', id)
          .single();
        
        if (event?.recurrence_rule) {
          // Find all events with the same recurrence rule and delete them
          // This is a simplified version - in a real app, you'd need to identify the series more accurately
          const { error } = await supabase
            .from('personal_events')
            .delete()
            .eq('recurrence_rule', event.recurrence_rule);
          
          return { error };
        }
      }
      
      // Otherwise just delete the single event
      const { error } = await query;
      return { error };
    } catch (err) {
      console.error('Error deleting event:', err);
      return { error: err as PostgrestError };
    }
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
    try {
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
      
      return { data: data || [], error };
    } catch (err) {
      console.error('Error getting shared events:', err);
      return { data: [], error: err as PostgrestError };
    }
  },

  /**
   * Get pending event sharing requests
   */
  async getPendingShares(): Promise<{ data: any[] | null; error: PostgrestError | null }> {
    try {
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
    } catch (err) {
      console.error('Error getting pending shares:', err);
      return { data: null, error: err as PostgrestError };
    }
  },

  /**
   * Respond to a sharing request
   */
  async respondToShare(id: string, status: 'accepted' | 'declined'): Promise<{ error: PostgrestError | null }> {
    try {
      const { error } = await supabase
        .from('event_sharing')
        .update({ status })
        .eq('id', id);
      
      return { error };
    } catch (err) {
      console.error('Error responding to share request:', err);
      return { error: err as PostgrestError };
    }
  }
};
