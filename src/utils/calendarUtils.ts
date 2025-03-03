// src/utils/calendarUtils.ts
import { isSameDay } from './dateUtils';

export function getCalendarDays(year: number, month: number) {
  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);
  
  // Day of the week for the first day (0-6)
  const firstDayOfWeek = firstDay.getDay();
  
  // Array to hold all calendar cells
  const days = [];
  
  // Add days from previous month to fill the first row
  const prevMonth = new Date(year, month, 0);
  const prevMonthDays = prevMonth.getDate();
  
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = prevMonthDays - i;
    const prevMonthDate = new Date(year, month - 1, date);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isSameDay(prevMonthDate, new Date()),
      dateString: prevMonthDate.toISOString().split('T')[0]
    });
  }
  
  // Add days from current month
  const today = new Date();
  const isCurrentMonthAndYear = 
    today.getMonth() === month && 
    today.getFullYear() === year;
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const currentDayDate = new Date(year, month, i);
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: isCurrentMonthAndYear && today.getDate() === i,
      dateString: currentDayDate.toISOString().split('T')[0]
    });
  }
  
  // Add days from next month to complete the grid
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonthDate = new Date(year, month + 1, i);
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: isSameDay(nextMonthDate, new Date()),
      dateString: nextMonthDate.toISOString().split('T')[0]
    });
  }
  
  return days;
}

export function getEventType(event: any) {
  if (!event) return 'default';
  
  if (event._source === 'family' || event.event_type === 'family') return 'family';
  if (event._source === 'health' || event.event_type === 'health') return 'health';
  if (event._source === 'work' || event.event_type === 'work') return 'work';
  if (event._source === 'personal' || event.event_type === 'personal') return 'personal';
  return 'default';
}