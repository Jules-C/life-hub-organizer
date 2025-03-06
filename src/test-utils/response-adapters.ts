// src/test-utils/response-adapters.ts
import type { PostgrestError } from '@supabase/supabase-js';
import type { FamilyMember, FamilyMemberWithUser } from '@/types/family';

/**
 * Generic service response interface
 */
export interface ServiceResponse<T> {
  data: T | null;
  error: any | null;
}

/**
 * Adapts a standard service response to a specific Supabase response type
 */
export function adaptResponse<T, R>(
  response: ServiceResponse<T>,
  transformer?: (data: T | null) => R | null
): { data: R | null; error: PostgrestError | null } {
  return {
    data: transformer ? transformer(response.data) : (response.data as unknown as R),
    error: response.error as PostgrestError | null
  };
}

/**
 * Transforms FamilyMember[] to FamilyMemberWithUser[]
 * This adapter fills in missing 'users' field required by FamilyMemberWithUser
 */
export function adaptFamilyMembers(
  members: FamilyMember[] | null
): FamilyMemberWithUser[] | null {
  if (!members) return null;
  
  return members.map(member => ({
    ...member,
    users: {
      id: member.user_id,
      email: member.user_details?.email || '',
      user_metadata: {
        first_name: member.user_details?.first_name || '',
        last_name: member.user_details?.last_name || '',
        avatar_url: member.user_details?.avatar_url
      }
    }
  }));
}

/**
 * Creates a PostgrestError for testing
 */
export function createPostgrestError(
  message = 'Database error',
  details = '',
  hint = '',
  code = 'ERROR'
): PostgrestError {
  return {
    message,
    details,
    hint,
    code,
    name: 'PostgrestError'
  };
}
