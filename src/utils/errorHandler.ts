// src/utils/errorHandler.ts
export function handleApiError(error: any, context: string) {
    console.error(`Error in ${context}:`, error);
    
    // Return a standardized error object
    return {
      message: error?.message || 'An unexpected error occurred',
      code: error?.code || 'UNKNOWN_ERROR'
    };
  }