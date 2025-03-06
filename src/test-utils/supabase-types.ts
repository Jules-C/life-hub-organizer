// src/test-utils/supabase-types.ts
import type { User, Session, AuthError } from '@supabase/supabase-js';

/**
 * TypeScript interfaces for mocking Supabase authentication responses in tests
 * These match the exact types expected by the Supabase Auth API
 */

export interface SupabaseAuthResponse {
  data: {
    user: User | null;
    session: Session | null;
  };
  error: AuthError | null;
}

export interface SupabaseUserResponse {
  data: {
    user: User | null;
  };
  error: AuthError | null;
}

export interface SupabaseSessionResponse {
  data: {
    session: Session | null;
  };
  error: AuthError | null;
}

/**
 * Helper functions to create type-safe mock responses
 */
export function createAuthResponse(
  user: User | null = null,
  session: Session | null = null,
  error: AuthError | null = null
): SupabaseAuthResponse {
  return {
    data: { user, session },
    error
  };
}

export function createUserResponse(
  user: User | null = null,
  error: AuthError | null = null
): SupabaseUserResponse {
  return {
    data: { user },
    error
  };
}

export function createSessionResponse(
  session: Session | null = null,
  error: AuthError | null = null
): SupabaseSessionResponse {
  return {
    data: { session },
    error
  };
}
