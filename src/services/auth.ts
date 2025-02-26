import { supabase } from './supabase.js';
import type { User } from '@supabase/supabase-js';

export type AuthResponse = {
  user: User | null;
  error: Error | null;
};

export const authService = {
  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });
    
    return {
      user: data.user,
      error: error
    };
  },
  
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return {
      user: data.user,
      error: error
    };
  },
  
  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  },
  
  async getSession() {
    return await supabase.auth.getSession();
  },
  
  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },
  
  async updateProfile(userId: string, updates: { firstName?: string; lastName?: string; avatarUrl?: string }) {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        first_name: updates.firstName,
        last_name: updates.lastName,
        avatar_url: updates.avatarUrl
      }
    });
    
    return { 
      user: data.user,
      error 
    };
  }
};
