// src/utils/calendarUtils.ts
import { isSameDay, formatDateString } from './dateUtils';

/**
 * Generate calendar days for a given month and year
 * @param year - The year
 * @param month - The month (0-based index)
 * @returns Array of calendar day objects
 */
export function getCalendarDays(year: number, month: number): Array<{
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dateString: string;
}> {
  const today = new Date();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Get first day of week (0-6, 0 = Sunday)
  const firstDayOfWeek = firstDay.getDay();
  
  // Get last date of month
  const lastDate = lastDay.getDate();
  
  // Get last date of previous month
  const prevLastDate = new Date(year, month, 0).getDate();
  
  const days = [];
  
  // Add days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = prevLastDate - i;
    const dateObj = new Date(year, month - 1, date);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isSameDay(dateObj, today),
      dateString: formatDateString(dateObj)
    });
  }
  
  // Add days from current month
  for (let i = 1; i <= lastDate; i++) {
    const dateObj = new Date(year, month, i);
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: isSameDay(dateObj, today),
      dateString: formatDateString(dateObj)
    });
  }
  
  // Add days from next month to complete the grid (6 rows x 7 days = 42 cells)
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const dateObj = new Date(year, month + 1, i);
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: isSameDay(dateObj, today),
      dateString: formatDateString(dateObj)
    });
  }
  
  return days;
}

/**
 * Determines the event type based on event properties
 * @param event - Calendar event object
 * @returns Event type string for styling and filtering
 */
export function getEventType(event: any): 'personal' | 'family' | 'work' | 'health' | 'default' {
  if (!event) return 'default';
  
  // Check for _source property which is added by the calendar wrapper
  if (event._source) {
    if (event._source === 'family') return 'family';
    if (event._source === 'health') return 'health';
    if (event._source === 'work') return 'work';
    if (event._source === 'personal') return 'personal';
  }
  
  // Check event_type property directly
  if (event.event_type === 'work') return 'work';
  if (event.event_type === 'health') return 'health';
  if (event.event_type === 'personal') return 'personal';
  
  // Check for family_id presence
  if (event.family_id && event.visibility && event.visibility !== 'private') {
    return 'family';
  }
  
  // Default case
  return 'personal';
}

/**
 * Gets the CSS class for an event based on its type
 * @param event - Calendar event object
 * @returns CSS class string
 */
export function getEventClass(event: any): string {
  const type = getEventType(event);
  
  switch (type) {
    case 'work':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    case 'family':
      return 'bg-purple-100 text-purple-800 border border-purple-200';
    case 'health':
      return 'bg-pink-100 text-pink-800 border border-pink-200';
    case 'personal':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
}

/**
 * Generates date range for a given month and year
 * @param year - The year
 * @param month - The month (0-based index)
 * @returns Object with start and end dates in ISO format
 */
export function getMonthDateRange(year: number, month: number): { startDate: string, endDate: string } {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0); // Last day of the month
  
  // Set hours to get full day coverage
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
}

/**
 * Calculates the number of days between two dates
 * @param startDate - Start date string in ISO format
 * @param endDate - End date string in ISO format
 * @returns Number of days
 */
export function getDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Reset hours to compare just dates
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Checks if a date is today
 * @param dateString - Date string in any format
 * @returns Boolean indicating if the date is today
 */
export function isToday(dateString: string): boolean {
  const today = new Date();
  const date = new Date(dateString);
  
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}