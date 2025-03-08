<template>
  <div 
    class="px-2 py-1 text-xs rounded-md truncate cursor-pointer"
    :class="[baseClass, customClass]"
    :style="eventStyle"
    @click.stop="handleClick"
  >
    <div v-if="showTime && event.start_time && !event.is_all_day" class="inline-block mr-1 font-medium">
      {{ formatTime(event.start_time) }}
    </div>
    <span :class="{'font-medium': showTime && event.start_time}">{{ event.title }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatTime } from '@/utils/dateUtils';
import type { CalendarEvent, EventType } from '@/types/calendar';

interface Props {
  event: CalendarEvent;
  eventType?: EventType | 'default'; // Type of event for styling
  customClass?: string; // Additional custom CSS classes
  showTime?: boolean; // Whether to show the start time
}

const props = withDefaults(defineProps<Props>(), {
  eventType: 'default',
  customClass: '',
  showTime: true
});

const emit = defineEmits(['event-click']);

// Computed styles based on event type
const baseClass = computed(() => {
  // Use event.color if available, otherwise use event type
  if (props.event.color) {
    // Return a basic class structure for custom colors
    return `border`;
  }

  // Get event type, prioritizing the prop if available
  const type = props.eventType !== 'default' ? props.eventType as EventType : props.event.event_type;

  // Default styles based on event type
  switch (type) {
    case 'personal':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'family':
      return 'bg-purple-100 text-purple-800 border border-purple-200';
    case 'health':
      return 'bg-pink-100 text-pink-800 border border-pink-200';
    case 'work':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
});

// Add inline style for custom colors
const eventStyle = computed(() => {
  if (props.event.color) {
    return {
      backgroundColor: `${props.event.color}20`, // Add transparency
      color: props.event.color,
      borderColor: props.event.color
    };
  }
  return {};
});

// Handle click on the event
function handleClick() {
  emit('event-click', props.event);
}
</script>