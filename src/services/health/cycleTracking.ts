import { supabase } from '../supabase';
import type { PostgrestError } from '@supabase/supabase-js';

export interface CycleTrackingEntry {
  id?: string;
  user_id?: string;
  family_id?: string; // Make this optional
  start_date: string; // ISO date format
  end_date?: string; // ISO date format
  flow_intensity?: number; // 1-5 scale
  symptoms?: {
    cramps?: boolean;
    headache?: boolean;
    bloating?: boolean;
    fatigue?: boolean;
    mood_swings?: boolean;
    [key: string]: boolean | undefined;
  };
  notes?: string;
  is_private: boolean;
}

export interface CycleTrackingResponse {
  data: CycleTrackingEntry[] | null;
  error: PostgrestError | null;
}

export const cycleTrackingService = {
  /**
   * Add a new cycle tracking entry
   */
  async addEntry(entry: CycleTrackingEntry): Promise<{ data: CycleTrackingEntry | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('cycle_tracking')
      .insert(entry)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Update an existing cycle tracking entry
   */
  async updateEntry(id: string, updates: Partial<CycleTrackingEntry>): Promise<{ data: CycleTrackingEntry | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('cycle_tracking')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

    /**
   * Get a single cycle tracking entry by ID
   */
  async getEntry(id: string): Promise<{ data: CycleTrackingEntry | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('cycle_tracking')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },
  /**
   * Get cycle tracking entries for a specific date range
   */
  async getEntriesForDateRange(startDate: string, endDate: string): Promise<CycleTrackingResponse> {
    const { data, error } = await supabase
      .from('cycle_tracking')
      .select('*')
      .gte('start_date', startDate)
      .lte('start_date', endDate)
      .order('start_date', { ascending: true });
    
    return { data, error };
  },

  /**
   * Get all cycle tracking entries for the current user
   */
  async getAllEntries(): Promise<CycleTrackingResponse> {
    const { data, error } = await supabase
      .from('cycle_tracking')
      .select('*')
      .order('start_date', { ascending: false });
    
    return { data, error };
  },

  /**
   * Delete a cycle tracking entry
   */
  async deleteEntry(id: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await supabase
      .from('cycle_tracking')
      .delete()
      .eq('id', id);
    
    return { error };
  },

  /**
   * Predict next cycle based on historical data
   * Simple prediction based on average cycle length
   */
  async predictNextCycle(): Promise<{ 
    predictedStartDate: string | null; 
    averageCycleLength: number | null;
    error: PostgrestError | null 
  }> {
    const { data, error } = await supabase
      .from('cycle_tracking')
      .select('start_date')
      .order('start_date', { ascending: false })
      .limit(6); // Use last 6 cycles for prediction
    
    if (error || !data || data.length < 2) {
      return { 
        predictedStartDate: null, 
        averageCycleLength: null, 
        error: error || new Error('Not enough data for prediction') as any
      };
    }

    // Calculate average cycle length
    let totalDays = 0;
    let count = 0;

    for (let i = 0; i < data.length - 1; i++) {
      const currentDate = new Date(data[i].start_date);
      const previousDate = new Date(data[i + 1].start_date);
      const diffTime = Math.abs(currentDate.getTime() - previousDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      totalDays += diffDays;
      count++;
    }

    const averageCycleLength = Math.round(totalDays / count);
    
    // Predict next cycle
    const lastCycleDate = new Date(data[0].start_date);
    lastCycleDate.setDate(lastCycleDate.getDate() + averageCycleLength);
    
    const predictedStartDate = lastCycleDate.toISOString().split('T')[0];
    
    return { predictedStartDate, averageCycleLength, error: null };
  }
};
