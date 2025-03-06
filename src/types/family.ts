// src/types/family.ts
import type { PostgrestError } from '@supabase/supabase-js';
import type { ServiceResponse } from '@/test-utils/response-adapters';

export interface Family {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  role: 'admin' | 'member';
  status: 'active' | 'invited' | 'declined';
  joined_at?: string;
  user_details?: {
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  };
}

// Match the structure in the service exactly
export interface FamilyMemberWithUser extends Omit<FamilyMember, 'user_details'> {
  users: {
    email: string;
    user_metadata: any;
    id?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export interface FamilyData {
  family: Family;
  members: FamilyMember[];
}

export interface FamilyInvitation {
  id?: string;
  familyId: string;
  email: string;
  role: 'admin' | 'member';
  message?: string;
  expiresAt?: string;
}

export interface FamilyResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

// Helper type for converting service responses to the expected FamilyResponse format
export function adaptFamilyResponse<T>(response: ServiceResponse<T>): FamilyResponse<T> {
  return {
    data: response.data,
    error: response.error as PostgrestError | null
  };
}
