// src/utils/errorHandler.ts
import type { PostgrestError } from '@supabase/supabase-js';

interface ErrorDetails {
  message: string;
  code?: string;
  source?: string;
  suggestions?: string[];
}

/**
 * Handles API errors with consistent logging and formatting
 * @param error - The error object from an API call
 * @param source - The function or component where the error occurred
 * @returns {ErrorDetails} - Formatted error details
 */
export function handleApiError(error: unknown, source: string): ErrorDetails {
  // Prepare default error structure
  const errorDetails: ErrorDetails = {
    message: 'An unexpected error occurred.',
    source,
    suggestions: ['Try again later.', 'Check your network connection.']
  };
  
  // Handle specific error types
  if (error instanceof Error) {
    errorDetails.message = error.message;
    
    // Specific handling for Supabase errors
    if (isPostgrestError(error)) {
      errorDetails.code = error.code;
      
      // Add more helpful suggestions based on error code
      switch (error.code) {
        case '23505': // Unique violation
          errorDetails.message = 'A duplicate entry was found.';
          errorDetails.suggestions = ['Try with a different name or identifier.'];
          break;
          
        case '42P01': // Undefined table
          errorDetails.message = 'Database configuration issue.';
          errorDetails.suggestions = ['Please contact support.'];
          break;
          
        case 'PGRST116': // Row level security violation
          errorDetails.message = 'You don\'t have permission to perform this action.';
          errorDetails.suggestions = ['Check if you\'re logged in.', 'You may need additional permissions.'];
          break;
          
        case '23503': // Foreign key violation
          errorDetails.message = 'This action references data that doesn\'t exist.';
          errorDetails.suggestions = ['Check related items and try again.'];
          break;
      }
    }
  } else if (typeof error === 'string') {
    errorDetails.message = error;
  } else if (error && typeof error === 'object') {
    // Try to extract message from object
    const anyError = error as any;
    if (anyError.message) {
      errorDetails.message = anyError.message;
    }
    if (anyError.code) {
      errorDetails.code = anyError.code;
    }
  }
  
  // Log the error for debugging
  console.error(`Error in ${source}:`, error);
  
  return errorDetails;
}

/**
 * Type guard for PostgrestError
 */
function isPostgrestError(error: any): error is PostgrestError {
  return error && typeof error === 'object' && 'code' in error && 'message' in error;
}

/**
 * Format error message for display to users
 * @param error - The error details
 * @returns {string} - Formatted error message
 */
export function formatErrorMessage(error: ErrorDetails | string): string {
  if (typeof error === 'string') {
    return error;
  }
  
  return error.message;
}

/**
 * Handle authentication errors specifically
 * @param error - The error object
 * @returns {ErrorDetails}
 */
export function handleAuthError(error: unknown): ErrorDetails {
  const errorDetails = handleApiError(error, 'authentication');
  
  // Customize suggestions based on authentication context
  errorDetails.suggestions = [
    'Check your credentials and try again.',
    'Make sure you have the correct permissions.',
    'Your session may have expired. Try logging in again.'
  ];
  
  return errorDetails;
}
