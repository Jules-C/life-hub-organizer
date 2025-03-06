// src/test-utils/vue-types.ts
import { ComponentPublicInstance } from 'vue';
import type { Mock } from 'vitest';

/**
 * Type utility to access component instance properties for Vue test-utils
 */
export type ComponentProps<T> = T extends ComponentPublicInstance<infer P> ? P : never;

/**
 * Type utility for component methods
 */
export type ComponentMethods<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never;
};

/**
 * Helper to type a component with named props, emits and methods
 * Use this when direct typing through ComponentWithProps doesn't work
 */
export interface ComponentTestProps {
  // Common calendar component props
  events?: any[];
  loading?: boolean;
  showEventModal?: boolean;
  eventModalMode?: 'create' | 'edit' | 'view';
  selectedEvent?: any;
  showDeleteConfirmation?: boolean;
  filters?: Record<string, boolean>;
  filteredEvents?: any[];
  upcomingEvents?: any[];
  
  // Common component methods
  saveEvent?: Mock;
  deleteEvent?: Mock;
  handleMonthChanged?: Mock;
  handleDateSelected?: Mock;
  
  // PersonalEventsView specific
  activeTab?: string;
  isPersonalOnly?: boolean;
  newEvent?: any;
  showWorkScheduleModal?: boolean;
  saveWorkSchedule?: Mock;
  errorMessage?: string;
  editingEvent?: any;
  formatDate?: Mock;
  ongoing?: any[];
  showNewEventModal?: boolean;
  editEvent?: Mock;
}

/**
 * Creates a typed mock for a Vue component with standard properties
 */
export function createComponentProps(
  props: Partial<ComponentTestProps> = {}
): ComponentTestProps {
  const defaultProps: ComponentTestProps = {
    events: [],
    loading: false,
    showEventModal: false,
    eventModalMode: 'view',
    showDeleteConfirmation: false,
    filters: {
      personal: true,
      work: true,
      family: true,
      health: true
    },
    filteredEvents: [],
    upcomingEvents: []
  };
  
  return { ...defaultProps, ...props };
}
