import { supabase } from './supabase';

export interface PersonalEvent {
  id?: string;
  user_id?: string;
  family_id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  is_all_day: boolean;
  recurrence_rule?: string;
  event_type: string;
  color?: string;
  visibility: 'private' | 'busy' | 'details' | 'full';
  created_at?: string;
  updated_at?: string;
}

export interface EventSharing {
  id?: string;
  event_id: string;
  shared_with: string;
  permission: 'view' | 'edit' | 'admin';
  status: 'pending' | 'accepted' | 'declined';
}

export const personalEventsService = {
  async getEvents(startDate?: string, endDate?: string, eventType?: string) {
    let query = supabase
      .from('personal_events')
      .select('*')
      .order('start_time', { ascending: true });
    
    if (startDate) {
      query = query.gte('start_time', startDate);
    }
    
    if (endDate) {
      query = query.lte('start_time', endDate);
    }
    
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },
  
  async getEvent(id: string) {
    const { data, error } = await supabase
      .from('personal_events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async createEvent(event: PersonalEvent) {
    const { data, error } = await supabase
      .from('personal_events')
      .insert([event])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async updateEvent(id: string, updates: Partial<PersonalEvent>) {
    const { data, error } = await supabase
      .from('personal_events')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('personal_events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Event sharing functionality
  async shareEvent(eventId: string, userId: string, permission: 'view' | 'edit' | 'admin' = 'view') {
    const { data, error } = await supabase
      .from('event_sharing')
      .insert([{
        event_id: eventId,
        shared_with: userId,
        permission
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async getEventSharing(eventId: string) {
    const { data, error } = await supabase
      .from('event_sharing')
      .select(`
        *,
        shared_with_user:shared_with(id, email, user_metadata)
      `)
      .eq('event_id', eventId);
    
    if (error) throw error;
    return data;
  },
  
  async respondToSharing(sharingId: string, status: 'accepted' | 'declined') {
    const { data, error } = await supabase
      .from('event_sharing')
      .update({ status })
      .eq('id', sharingId)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async removeSharing(sharingId: string) {
    const { error } = await supabase
      .from('event_sharing')
      .delete()
      .eq('id', sharingId);
    
    if (error) throw error;
    return true;
  }
};