import { supabase } from './supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import type { CalendarEvent, EventVisibility, EventType } from '@/types/calendar';

export interface EventResponse {
  data: CalendarEvent[] | null;
  error: PostgrestError | null;
}

export interface EventSingleResponse {
  data: CalendarEvent | null;
  error: PostgrestError | null;
}

export interface EventFilters {
  eventTypes?: EventType[];
  startDate?: string;
  endDate?: string;
  visibility?: EventVisibility[];
  familyOnly?: boolean;
  userId?: string;
}

export const eventService = {
  /**
   * Create a new event
   */
  async createEvent(event: CalendarEvent): Promise<EventSingleResponse> {
    try {
      // Ensure we have a user_id
      if (!event.user_id) {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          return { 
            data: null, 
            error: {
              code: 'AUTH_ERROR',
              message: 'Not authenticated',
              details: null,
              hint: null
            } as unknown as PostgrestError 
          };
        }
        
        event.user_id = userData.user.id;
      }
      
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single();
      
      return { data, error };
    } catch (err) {
      console.error('Error creating event:', err);
      return { 
        data: null, 
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
   * Update an existing event
   */
  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<EventSingleResponse> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      return { data, error };
    } catch (err) {
      console.error('Error updating event:', err);
      return { 
        data: null, 
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
   * Get events for a specific date range with optional filters
   */
  async getEventsForDateRange(startDate: string, endDate: string, filters?: EventFilters): Promise<EventResponse> {
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
  
      // Start with base query
      let query = supabase
        .from('events')
        .select('*')
        .eq('user_id', filters?.userId || user.id);
      
      // Date range filtering
      query = query.or(`start_time.gte.${startDate},end_time.gte.${startDate}`)
                   .lt('start_time', endDate);
      
      // Apply filters if provided
      if (filters) {
        if (filters.eventTypes && filters.eventTypes.length > 0) {
          query = query.in('event_type', filters.eventTypes);
        }
        
        if (filters.familyOnly) {
          query = query.not('family_id', 'is', null);
        }
        
        if (filters.visibility && filters.visibility.length > 0) {
          query = query.in('visibility', filters.visibility);
        }
      }
      
      // Execute the query
      const { data, error } = await query.order('start_time', { ascending: true });
      
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
   * Get shared events (events shared with the current user)
   */
  async getSharedEvents(startDate: string, endDate: string): Promise<EventResponse> {
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

      // Get the family_id for the current user
      const { data: familyMember, error: familyError } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id)
        .single();
      
      if (familyError || !familyMember) {
        return { data: [], error: null }; // No family, so no shared events
      }
      
      // Get all events for this family that are shared
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('family_id', familyMember.family_id)
        .in('visibility', ['family', 'public'])
        .neq('user_id', user.id) // Exclude the user's own events
        .or(`start_time.gte.${startDate},end_time.gte.${startDate}`)
        .lt('start_time', endDate)
        .order('start_time', { ascending: true });
      
      return { data: data || [], error };
    } catch (err) {
      console.error('Error getting shared events:', err);
      return { data: [], error: err as PostgrestError };
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
        .from('events')
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
   * Get events by type
   */
  async getEventsByType(eventType: EventType, startDate?: string, endDate?: string): Promise<EventResponse> {
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
  
      let query = supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_type', eventType);
      
      // Add date range filtering if provided
      if (startDate && endDate) {
        query = query.or(`start_time.gte.${startDate},end_time.gte.${startDate}`)
                     .lt('start_time', endDate);
      }
      
      const { data, error } = await query.order('start_time', { ascending: true });
      
      return { data: data || [], error };
    } catch (err) {
      console.error(`Unexpected error in getEventsByType(${eventType}):`, err);
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
      // If deleting entire series and event has a recurrence rule
      if (deleteEntireSeries) {
        // Get the event first to check if it has a recurrence_rule
        const { data: event } = await supabase
          .from('events')
          .select('recurrence_rule, user_id')
          .eq('id', id)
          .single();
        
        if (event?.recurrence_rule) {
          // Find all events with the same recurrence rule and user_id and delete them
          const { error } = await supabase
            .from('events')
            .delete()
            .eq('recurrence_rule', event.recurrence_rule)
            .eq('user_id', event.user_id);
          
          return { error };
        }
      }
      
      // Otherwise just delete the single event
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      return { error };
    } catch (err) {
      console.error('Error deleting event:', err);
      return { error: err as PostgrestError };
    }
  },

  /**
   * Get health events and calculate predictions
   */
  async predictNextHealthEvent(): Promise<{ 
    predictedStartDate: string | null; 
    averageCycleLength: number | null;
    error: PostgrestError | null 
  }> {
    try {
      // Get health events that have flow intensity metadata (cycle tracking)
      const { data, error } = await supabase
        .from('events')
        .select('start_time, metadata')
        .eq('event_type', 'health')
        .order('start_time', { ascending: false })
        .limit(6); // Use last 6 cycles for prediction
      
      // Filter to only include those with flow_intensity in metadata
      const cycleEvents = data?.filter(event => 
        event.metadata && 
        typeof event.metadata === 'object' && 
        'flow_intensity' in event.metadata
      ) || [];
      
      if (error || cycleEvents.length < 2) {
        return { 
          predictedStartDate: null, 
          averageCycleLength: null, 
          error: error || {
            message: 'Not enough data for prediction',
            code: 'INSUFFICIENT_DATA'
          } as any
        };
      }

      // Calculate average cycle length
      let totalDays = 0;
      let count = 0;

      for (let i = 0; i < cycleEvents.length - 1; i++) {
        const currentDate = new Date(cycleEvents[i].start_time);
        const previousDate = new Date(cycleEvents[i + 1].start_time);
        const diffTime = Math.abs(currentDate.getTime() - previousDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        totalDays += diffDays;
        count++;
      }

      const averageCycleLength = Math.round(totalDays / count);
      
      // Predict next cycle
      const lastCycleDate = new Date(cycleEvents[0].start_time);
      lastCycleDate.setDate(lastCycleDate.getDate() + averageCycleLength);
      
      const predictedStartDate = lastCycleDate.toISOString().split('T')[0];
      
      return { predictedStartDate, averageCycleLength, error: null };
    } catch (err) {
      return { 
        predictedStartDate: null, 
        averageCycleLength: null, 
        error: err as PostgrestError 
      };
    }
  },
  
  /**
   * Helper function to create a health cycle tracking event
   */
  async createHealthCycleEvent(
    startDate: string,
    endDate: string | null,
    flowIntensity: number,
    symptoms: Record<string, boolean>,
    notes?: string
  ): Promise<EventSingleResponse> {
    // Create the health event
    const event: CalendarEvent = {
      title: 'Cycle Tracking',
      event_type: 'health',
      start_time: new Date(`${startDate}T00:00:00`).toISOString(),
      end_time: endDate 
        ? new Date(`${endDate}T23:59:59`).toISOString()
        : new Date(`${startDate}T23:59:59`).toISOString(),
      is_all_day: true,
      visibility: 'private',
      metadata: {
        flow_intensity: flowIntensity,
        symptoms,
        notes
      }
    };
    
    return this.createEvent(event);
  }
};