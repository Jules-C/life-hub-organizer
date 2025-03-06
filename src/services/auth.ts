// src/services/auth.ts
import { supabase } from './supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

// Interface for authentication response
export interface AuthResponse {
  user: User | null;
  session?: Session | null;
  error: AuthError | null;
}

// Interface for sign-up request
export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Interface for profile update request
export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export const authService = {
  async signUp(request: SignUpRequest): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email: request.email,
      password: request.password,
      options: {
        data: {
          first_name: request.firstName,
          last_name: request.lastName
        }
      }
    });
    
    return {
      user: data.user,
      session: data.session,
      error
    };
  },
  
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return {
      user: data.user,
      session: data.session,
      error
    };
  },
  
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  async getSession() {
    return await supabase.auth.getSession();
  },
  
  async getCurrentUser(): Promise<User> {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    if (!data.user) throw new Error('User not found');
    
    return data.user;
  },
  
  async updateProfile(updates: ProfileUpdateRequest): Promise<AuthResponse> {
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
