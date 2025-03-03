// src/utils/dateUtils.ts
export function formatDateTime(isoString: string, options = {}) {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    return date.toLocaleString([], { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    });
  }
  
  export function formatDate(isoString: string) {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    return date.toLocaleDateString([], { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  export function formatTime(isoString: string) {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  export function isSameDay(d1: Date, d2: Date): boolean {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  }
  
  export function formatDateString(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }