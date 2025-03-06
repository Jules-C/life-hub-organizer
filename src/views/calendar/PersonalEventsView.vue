<template>
    <AppLayout>
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Personal Events</h2>
            <p class="mt-1 text-sm text-gray-500">
              Manage your personal schedule and work commitments
            </p>
          </div>
          <div class="space-x-2">
            <button
              @click="showWorkScheduleModal = true"
              class="inline-flex items-center px-4 py-2 border border-primary-600 rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg class="-ml-1 mr-2 h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Add Work Schedule
            </button>
            <button
              @click="showNewEventModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Event
            </button>
          </div>
        </div>
  
        <!-- Tabs -->
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex px-6">
            <button
              @click="activeTab = 'all'"
              class="py-4 px-1 border-b-2 font-medium text-sm mr-8"
              :class="activeTab === 'all' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              All Events
            </button>
            <button
              @click="activeTab = 'personal'"
              class="py-4 px-1 border-b-2 font-medium text-sm mr-8"
              :class="activeTab === 'personal' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Personal
            </button>
            <button
              @click="activeTab = 'work'"
              class="py-4 px-1 border-b-2 font-medium text-sm mr-8"
              :class="activeTab === 'work' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Work Schedule
            </button>
            <button
              @click="activeTab = 'shared'"
              class="py-4 px-1 border-b-2 font-medium text-sm"
              :class="activeTab === 'shared' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Shared Events
            </button>
          </nav>
        </div>
  
        <!-- Calendar View -->
        <div class="p-4">
          <div class="flex justify-end mb-4">
            <div class="flex">
              <div class="flex items-center space-x-2 mr-4">
                <span class="h-3 w-3 bg-blue-500 rounded-full"></span>
                <span class="text-sm text-gray-600">Personal</span>
              </div>
              <div class="flex items-center space-x-2 mr-4">
                <span class="h-3 w-3 bg-emerald-500 rounded-full"></span>
                <span class="text-sm text-gray-600">Work</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="h-3 w-3 bg-purple-500 rounded-full"></span>
                <span class="text-sm text-gray-600">Shared</span>
              </div>
            </div>
          </div>
          
          <!-- Calendar Grid Component -->
          <CalendarGrid
            :initialDate="currentDate"
            @month-changed="handleMonthChanged"
            @date-selected="selectDate"
          >
            <!-- Day indicators (dots for events) -->
            <template #date-indicators="{ day }">
              <div v-if="getEventsForDay(day).length > 0" class="flex space-x-1">
                <div 
                  v-for="(eventType, index) in getEventTypes(getEventsForDay(day))" 
                  :key="index"
                  class="w-2 h-2 rounded-full"
                  :class="{
                    'bg-blue-500': eventType === 'personal',
                    'bg-emerald-500': eventType === 'work',
                    'bg-purple-500': eventType === 'shared'
                  }"
                ></div>
              </div>
            </template>
            
            <!-- Day content (events) -->
            <template #day-content="{ day }">
              <div 
                v-for="event in getEventsForDay(day)" 
                :key="event.id"
                class="px-2 py-1 text-xs rounded-md truncate cursor-pointer"
                :class="getEventClass(event)"
                @click.stop="viewEvent(event)"
              >
                {{ formatTime(event.start_time) }} {{ event.title }}
              </div>
            </template>
          </CalendarGrid>
        </div>
        
        <!-- Upcoming Events -->
        <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
          
          <div v-if="loading" class="py-4 flex justify-center">
            <svg class="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else-if="upcomingEvents.length === 0" class="text-center py-4">
            <p class="text-gray-500">No upcoming events for the selected view.</p>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="event in upcomingEvents" :key="event.id" 
              class="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 flex items-center">
                    <span 
                      class="w-3 h-3 rounded-full mr-2"
                      :class="getEventIndicatorClass(event)"
                    ></span>
                    {{ event.title }}
                  </h4>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ formatDateTime(event.start_time) }} - {{ formatDateTime(event.end_time) }}
                  </p>
                  <p v-if="event.location" class="mt-1 text-sm text-gray-500">
                    {{ event.location }}
                  </p>
                  <p v-if="event.description" class="mt-1 text-sm text-gray-500">
                    {{ event.description }}
                  </p>
                  
                  <div v-if="event.event_type === 'work'" class="mt-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Work Schedule
                    </span>
                  </div>
                  
                  <div v-if="event.visibility !== 'private'" class="mt-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="event.visibility === 'family' ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'">
                      {{ event.visibility === 'family' ? 'Shared with Family' : 'Public' }}
                    </span>
                  </div>
                </div>
                
                <div class="flex space-x-2">
                  <button @click="editEvent(event)" 
                    class="text-primary-600 hover:text-primary-800">
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="confirmDeleteEvent(event)" 
                    class="text-red-600 hover:text-red-800">
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- New Event Modal -->
      <div v-if="showNewEventModal" class="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showNewEventModal = false"></div>
  
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
  
          <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div class="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {{ editingEvent ? 'Edit Event' : 'New Event' }}
                </h3>
                <div class="mt-4">
                  <form @submit.prevent="saveEvent">
                    <!-- Title -->
                    <div class="mb-4">
                      <label for="title" class="block text-sm font-medium text-gray-700">Event Title</label>
                      <input 
                        type="text" 
                        id="title" 
                        v-model="newEvent.title"
                        required
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    
                    <!-- Event Type -->
                    <div class="mb-4">
                      <label for="event-type" class="block text-sm font-medium text-gray-700">Event Type</label>
                      <select 
                        id="event-type" 
                        v-model="newEvent.event_type"
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                        <option value="health">Health</option>
                        <option value="social">Social</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <!-- Date & Time -->
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label for="start-date" class="block text-sm font-medium text-gray-700">Start Date</label>
                        <input 
                          type="date" 
                          id="start-date" 
                          v-model="startDate"
                          required
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label for="start-time" class="block text-sm font-medium text-gray-700">Start Time</label>
                        <input 
                          type="time" 
                          id="start-time" 
                          v-model="startTime"
                          required
                          :disabled="newEvent.is_all_day"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label for="end-date" class="block text-sm font-medium text-gray-700">End Date</label>
                        <input 
                          type="date" 
                          id="end-date" 
                          v-model="endDate"
                          required
                          :min="startDate"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label for="end-time" class="block text-sm font-medium text-gray-700">End Time</label>
                        <input 
                          type="time" 
                          id="end-time" 
                          v-model="endTime"
                          required
                          :disabled="newEvent.is_all_day"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div class="mb-4">
                      <div class="flex items-center">
                        <input id="all-day" type="checkbox" v-model="newEvent.is_all_day" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
                        <label for="all-day" class="ml-2 block text-sm text-gray-900">All day event</label>
                      </div>
                    </div>
                    
                    <!-- Location -->
                    <div class="mb-4">
                      <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
                      <input 
                        type="text" 
                        id="location" 
                        v-model="newEvent.location"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    
                    <!-- Description -->
                    <div class="mb-4">
                      <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                      <textarea 
                        id="description" 
                        v-model="newEvent.description" 
                        rows="3" 
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      ></textarea>
                    </div>
                    
                    <!-- Recurrence (for work schedule) -->
                    <div v-if="newEvent.event_type === 'work'" class="mb-4">
                      <label for="recurrence" class="block text-sm font-medium text-gray-700">Recurrence</label>
                      <select 
                        id="recurrence" 
                        v-model="recurrenceRule"
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        <option value="">One time</option>
                        <option value="FREQ=DAILY">Daily</option>
                        <option value="FREQ=WEEKLY">Weekly</option>
                        <option value="FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR">Weekdays</option>
                        <option value="FREQ=MONTHLY">Monthly</option>
                      </select>
                    </div>
                    
                    <!-- Color -->
                    <div class="mb-4">
                      <label for="color" class="block text-sm font-medium text-gray-700">Color</label>
                      <div class="mt-1 grid grid-cols-5 gap-2">
                        <button 
                          v-for="color in availableColors" 
                          :key="color.value"
                          type="button"
                          @click="newEvent.color = color.value"
                          class="w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          :class="[color.class, newEvent.color === color.value ? 'ring-2 ring-offset-2 ring-gray-500' : '']"
                        ></button>
                      </div>
                    </div>
                    
                    <!-- Visibility/Sharing -->
                    <div class="mb-4">
                      <label for="visibility" class="block text-sm font-medium text-gray-700">Visibility</label>
                      <select 
                        id="visibility" 
                        v-model="newEvent.visibility"
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        <option value="private">Private</option>
                        <option v-if="!isPersonalOnly" value="family">Family</option>
                        <option v-if="!isPersonalOnly" value="public">Public</option>
                      </select>
                      <p class="mt-1 text-xs text-gray-500" v-if="!isPersonalOnly">
                        Choose who can see this event on the family calendar
                      </p>
                      <p class="mt-1 text-xs text-gray-500" v-else>
                        Events are private in personal mode
                      </p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="submit"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                      >
                        {{ editingEvent ? 'Update' : 'Save' }}
                      </button>
                      <button
                        type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        @click="showNewEventModal = false"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Work Schedule Modal -->
      <div v-if="showWorkScheduleModal" class="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showWorkScheduleModal = false"></div>
  
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
  
          <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div class="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Add Work Schedule
                </h3>
                <div class="mt-4">
                  <form @submit.prevent="saveWorkSchedule">
                    <!-- Title -->
                    <div class="mb-4">
                      <label for="work-title" class="block text-sm font-medium text-gray-700">Schedule Name</label>
                      <input 
                        type="text" 
                        id="work-title" 
                        v-model="workSchedule.title"
                        required
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="e.g. Regular Work Hours, Night Shift"
                      />
                    </div>
                    
                    <!-- Schedule Days -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Work Days</label>
                      <div class="flex flex-wrap gap-2">
                        <button 
                          v-for="day in weekdays" 
                          :key="day.value"
                          type="button"
                          @click="toggleWorkDay(day.value)"
                          class="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          :class="selectedWorkDays.includes(day.value) ? 
                            'bg-primary-600 text-white border-transparent' : 
                            'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                        >
                          {{ day.label }}
                        </button>
                      </div>
                    </div>
                    
                    <!-- Schedule Hours -->
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label for="work-start-time" class="block text-sm font-medium text-gray-700">Start Time</label>
                        <input 
                          type="time" 
                          id="work-start-time" 
                          v-model="workSchedule.startTime"
                          required
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label for="work-end-time" class="block text-sm font-medium text-gray-700">End Time</label>
                        <input 
                          type="time" 
                          id="work-end-time" 
                          v-model="workSchedule.endTime"
                          required
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <!-- Date Range -->
                    <div class="mb-4">
                      <div class="flex items-start">
                        <div class="flex items-center h-5">
                          <input 
                            id="use-date-range" 
                            type="checkbox" 
                            v-model="workSchedule.useDateRange"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="use-date-range" class="font-medium text-gray-700">Limit to date range</label>
                          <p class="text-gray-500">If unchecked, this schedule will repeat indefinitely</p>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="workSchedule.useDateRange" class="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label for="schedule-start-date" class="block text-sm font-medium text-gray-700">Start Date</label>
                        <input 
                          type="date" 
                          id="schedule-start-date" 
                          v-model="workSchedule.startDate"
                          required
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label for="schedule-end-date" class="block text-sm font-medium text-gray-700">End Date</label>
                        <input 
                          type="date" 
                          id="schedule-end-date" 
                          v-model="workSchedule.endDate"
                          required
                          :min="workSchedule.startDate"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <!-- Location -->
                    <div class="mb-4">
                      <label for="work-location" class="block text-sm font-medium text-gray-700">Location</label>
                      <input 
                        type="text" 
                        id="work-location" 
                        v-model="workSchedule.location"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="e.g. Office, Remote, Client Site"
                      />
                    </div>
                    
                    <!-- Visibility -->
                    <div class="mb-4">
                      <label for="work-visibility" class="block text-sm font-medium text-gray-700">Visibility</label>
                      <select 
                        id="work-visibility" 
                        v-model="workSchedule.visibility"
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        :disabled="isPersonalOnly"
                      >
                        <option value="private">Private</option>
                        <option v-if="!isPersonalOnly" value="family">Family</option>
                        <option v-if="!isPersonalOnly" value="public">Public</option>
                      </select>
                      <p class="mt-1 text-xs text-gray-500" v-if="!isPersonalOnly">
                        Choose who can see your work schedule
                      </p>
                      <p class="mt-1 text-xs text-gray-500" v-else>
                        Work schedule is private in personal mode
                      </p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="submit"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                      >
                        Create Schedule
                      </button>
                      <button
                        type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        @click="showWorkScheduleModal = false"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDeleteModal = false"></div>
  
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
  
          <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Delete Event
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete this event? This action cannot be undone.
                  </p>
                  <div v-if="eventToDelete?.recurrence_rule" class="mt-2">
                    <div class="flex items-start">
                      <div class="flex items-center h-5">
                        <input 
                          id="delete-series" 
                          type="checkbox" 
                          v-model="deleteEntireSeries"
                          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>
                      <div class="ml-3 text-sm">
                        <label for="delete-series" class="font-medium text-gray-700">Delete entire series</label>
                        <p class="text-gray-500">If checked, all occurrences of this recurring event will be deleted</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                @click="deleteEvent"
              >
                Delete
              </button>
              <button 
                type="button" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                @click="showDeleteModal = false"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import AppLayout from '@/components/layouts/AppLayout.vue';
  import CalendarGrid from '@/components/calendar/CalendarGrid.vue';
  import { personalEventService} from '@/services/calendar/personalEvents';
  import type { CalendarEvent, EventVisibility } from '@/types/calendar';
  import { useAuthStore } from '@/stores/auth';
  import { formatDateTime, formatTime } from '@/utils/dateUtils';
  import { getFamilyContext } from '@/utils/familyUtils';
  import { handleApiError } from '@/utils/errorHandler';

  const authStore = useAuthStore();
  const loading = ref(true);
  const activeTab = ref('all');
  const events = ref<CalendarEvent[]>([]);
  const currentDate = ref(new Date());
  const showNewEventModal = ref(false);
  const showWorkScheduleModal = ref(false);
  const showDeleteModal = ref(false);
  const editingEvent = ref(false);
  const eventToDelete = ref<CalendarEvent | null>(null);
  const deleteEntireSeries = ref(false);
  
  // Detect if this is a personal-only user (no family sharing)
  const isPersonalOnly = ref(true); // Default to true until we check
  
  async function checkFamilyContext() {
    const { isPersonalOnly: solo } = await getFamilyContext();
    isPersonalOnly.value = solo;
  }
  
  // Calendar navigation
  const currentMonthName = computed(() => {
    return currentDate.value.toLocaleString('default', { month: 'long' });
  });
  
  const currentYear = computed(() => {
    return currentDate.value.getFullYear();
  });
  
  // Form values
  const startDate = ref(new Date().toISOString().slice(0, 10));
  const startTime = ref('09:00');
  const endDate = ref(new Date().toISOString().slice(0, 10));
  const endTime = ref('10:00');
  const recurrenceRule = ref('');
  
  const newEvent = ref<CalendarEvent>({
    title: '',
    event_type: 'personal',
    start_time: '',
    end_time: '',
    is_all_day: false,
    visibility: 'private' as EventVisibility,
    color: '#3B82F6' // Default blue
  });
  
  // Work schedule form
  const workSchedule = ref({
    title: '',
    startTime: '09:00',
    endTime: '17:00',
    location: '',
    visibility: 'family' as EventVisibility,
    useDateRange: false,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  });
  
  const selectedWorkDays = ref<string[]>(['MO', 'TU', 'WE', 'TH', 'FR']);
  
  const weekdays = [
    { label: 'Mon', value: 'MO' },
    { label: 'Tue', value: 'TU' },
    { label: 'Wed', value: 'WE' },
    { label: 'Thu', value: 'TH' },
    { label: 'Fri', value: 'FR' },
    { label: 'Sat', value: 'SA' },
    { label: 'Sun', value: 'SU' },
  ];
  
  const availableColors = [
    { value: '#3B82F6', class: 'bg-blue-500' },   // Blue
    { value: '#10B981', class: 'bg-emerald-500' }, // Green
    { value: '#8B5CF6', class: 'bg-purple-500' }, // Purple
    { value: '#EF4444', class: 'bg-red-500' },    // Red
    { value: '#F59E0B', class: 'bg-amber-500' },  // Amber
  ];
  
  // Function to get unique event types for indicators
  function getEventTypes(events: any[]) {
    const types = new Set();
    events.forEach(event => {
      if (event.event_type === 'work') {
        types.add('work');
      } else if (event.visibility !== 'private') {
        types.add('shared');
      } else {
        types.add('personal');
      }
    });
    return Array.from(types);
  }
  
  // Get filtered events based on the active tab
  const filteredEvents = computed(() => {
    if (activeTab.value === 'all') {
      return events.value;
    } else if (activeTab.value === 'work') {
      return events.value.filter(event => event.event_type === 'work');
    } else if (activeTab.value === 'personal') {
      return events.value.filter(event => event.event_type !== 'work');
    } else if (activeTab.value === 'shared') {
      return events.value.filter(event => event.visibility !== 'private');
    }
    return events.value;
  });
  
  // Get upcoming events
  const upcomingEvents = computed(() => {
    const now = new Date();
    return filteredEvents.value
      .filter(event => new Date(event.start_time) >= now)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 5);
  });
  
  // Helper functions
  function getEventsForDay(day: any) {
    if (!day || !day.isCurrentMonth) return [];
    
    // For CalendarGrid component compatibility
    const dateStr = day.dateString || (() => {
      const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day.date);
      return date.toISOString().slice(0, 10);
    })();
    
    return filteredEvents.value.filter(event => {
      const eventDate = event.start_time.slice(0, 10);
      return eventDate === dateStr;
    });
  }
  
  
  function getEventClass(event: CalendarEvent) {
    if (event.event_type === 'work') {
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    } else if (event.visibility !== 'private') {
      return 'bg-purple-100 text-purple-800 border border-purple-200';
    } else {
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    }
  }
  
  function getEventIndicatorClass(event: CalendarEvent) {
    if (event.event_type === 'work') {
      return 'bg-emerald-500';
    } else if (event.visibility !== 'private') {
      return 'bg-purple-500';
    } else {
      return 'bg-blue-500';
    }
  }
  
  // Handle month change from CalendarGrid component
  function handleMonthChanged(data: any) {
    // Update the current date
    if (data.date) {
      currentDate.value = new Date(data.date);
    } else {
      currentDate.value = new Date(data.year, data.month);
    }
    
    // Load events for this month
    loadEvents();
  }
  
  // Event handling functions
  function selectDate(data: any) {
    // Pre-fill the event form with the selected date
    let selectedDate;
    
    if (data.dateString) {
      // Format from CalendarGrid component
      selectedDate = new Date(data.dateString);
    } else if (typeof data === 'number') {
      // Legacy format (just the day number)
      selectedDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), data);
    } else {
      // Fallback to current date
      selectedDate = new Date();
    }
    
    startDate.value = selectedDate.toISOString().slice(0, 10);
    endDate.value = selectedDate.toISOString().slice(0, 10);
    
    showNewEventModal.value = true;
  }
  
  function viewEvent(event: CalendarEvent) {
    // View the event details
    editEvent(event);
  }
  
  function editEvent(event: CalendarEvent) {
    editingEvent.value = true;
    newEvent.value = { ...event };
    
    // Parse start and end times
    const startDateTime = new Date(event.start_time);
    const endDateTime = new Date(event.end_time);
    
    startDate.value = startDateTime.toISOString().slice(0, 10);
    startTime.value = startDateTime.toISOString().slice(11, 16);
    endDate.value = endDateTime.toISOString().slice(0, 10);
    endTime.value = endDateTime.toISOString().slice(11, 16);
    
    recurrenceRule.value = event.recurrence_rule || '';
    
    showNewEventModal.value = true;
  }
  
  function confirmDeleteEvent(event: CalendarEvent) {
    eventToDelete.value = event;
    deleteEntireSeries.value = false;
    showDeleteModal.value = true;
  }
  
  async function deleteEvent() {
    if (!eventToDelete.value?.id) return;
    
    try {
      const { error } = await personalEventService.deleteEvent(
        eventToDelete.value.id, 
        deleteEntireSeries.value
      );
      
      if (error) throw error;
      
      // Remove from local list
      await loadEvents();
      showDeleteModal.value = false;
      eventToDelete.value = null;
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  }
  
  async function saveEvent() {
    // Combine date and time
    const start = new Date(startDate.value + 'T' + startTime.value);
    const end = new Date(endDate.value + 'T' + endTime.value);
    
    newEvent.value.start_time = start.toISOString();
    newEvent.value.end_time = end.toISOString();
    newEvent.value.recurrence_rule = recurrenceRule.value;
    
    // Get family context
    const { familyId, isPersonalOnly } = await getFamilyContext();
    
    // Set family ID only if user is part of a family
    if (!isPersonalOnly && familyId) {
      newEvent.value.family_id = familyId;
    }
    
    // For personal-only use, ensure visibility is private
    if (isPersonalOnly) {
      newEvent.value.visibility = 'private';
    }
    
    try {
      let result;
      
      if (editingEvent.value && newEvent.value.id) {
        // Update existing event
        result = await personalEventService.updateEvent(newEvent.value.id, newEvent.value);
      } else {
        // Create new event
        result = await personalEventService.createEvent(newEvent.value);
      }
      
      if (result.error) throw result.error;
      
      // Refresh the data
      await loadEvents();
      
      // Reset and close the modal
      resetForm();
      showNewEventModal.value = false;
    } catch (err) {
      console.error('Failed to save event:', err);
    }
  }
  
  async function saveWorkSchedule() {
  // Generate recurring events for each selected day over the date range
  try {
    const byday = selectedWorkDays.value.join(',');
    let recurrenceRule = `FREQ=WEEKLY;BYDAY=${byday}`;
    
    // Create start and end times for the work schedule
    const startDateObj = workSchedule.value.useDateRange
      ? new Date(workSchedule.value.startDate)
      : new Date(); // Today if no date range
    
    const endDateObj = workSchedule.value.useDateRange
      ? new Date(workSchedule.value.endDate)
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Default to one year from now
    
    // Set the time components
    const [startHours, startMinutes] = workSchedule.value.startTime.split(':').map(Number);
    const [endHours, endMinutes] = workSchedule.value.endTime.split(':').map(Number);
    
    startDateObj.setHours(startHours, startMinutes, 0);
    endDateObj.setHours(endHours, endMinutes, 0);
    
    // If using date range, add UNTIL parameter to recurrence rule
    if (workSchedule.value.useDateRange) {
      const untilDate = new Date(workSchedule.value.endDate);
      untilDate.setHours(23, 59, 59);
      recurrenceRule += `;UNTIL=${untilDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
    }
    
    // Get family context
    const { familyId, isPersonalOnly } = await getFamilyContext();
    
    // Create the work schedule event
    const workEvent: CalendarEvent = {
      title: workSchedule.value.title,
      description: 'Work Schedule',
      start_time: startDateObj.toISOString(),
      end_time: new Date(startDateObj.getTime() + (endHours - startHours) * 60 * 60 * 1000 + (endMinutes - startMinutes) * 60 * 1000).toISOString(),
      location: workSchedule.value.location,
      is_all_day: false,
      event_type: 'work',
      recurrence_rule: recurrenceRule,
      visibility: isPersonalOnly ? 'private' as EventVisibility : workSchedule.value.visibility,
      color: '#10B981' // Emerald
    };
    
    // Set family ID only if user is part of a family
    if (!isPersonalOnly && familyId) {
      workEvent.family_id = familyId;
    }
    
    const result = await personalEventService.createEvent(workEvent);
    
    if (result.error) throw result.error;
    
    // Refresh the data
    await loadEvents();
    
    // Reset and close the modal
    resetWorkScheduleForm();
    showWorkScheduleModal.value = false;
  } catch (error) {
    const errorDetails = handleApiError(error, 'saveWorkSchedule');
  }
}
  
  function toggleWorkDay(day: string) {
    const index = selectedWorkDays.value.indexOf(day);
    if (index === -1) {
      selectedWorkDays.value.push(day);
    } else {
      selectedWorkDays.value.splice(index, 1);
    }
  }
  
  function resetForm() {
    editingEvent.value = false;
    newEvent.value = {
      title: '',
      event_type: 'personal',
      start_time: '',
      end_time: '',
      is_all_day: false,
      visibility: 'private' as EventVisibility,
      color: '#3B82F6' // Default blue
    };
    
    startDate.value = new Date().toISOString().slice(0, 10);
    startTime.value = '09:00';
    endDate.value = new Date().toISOString().slice(0, 10);
    endTime.value = '10:00';
    recurrenceRule.value = '';
  }
  
  function resetWorkScheduleForm() {
    workSchedule.value = {
      title: '',
      startTime: '09:00',
      endTime: '17:00',
      location: '',
      visibility: 'family' as EventVisibility,
      useDateRange: false,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    };
    selectedWorkDays.value = ['MO', 'TU', 'WE', 'TH', 'FR'];
  }
  
  // Data loading
  async function loadEvents() {
  loading.value = true;
  try {
    // Get start and end of the current month
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const startDate = new Date(year, month, 1).toISOString();
    const endDate = new Date(year, month + 1, 0).toISOString();
    
    const { data, error } = await personalEventService.getEventsForDateRange(startDate, endDate);
    
    if (error) throw error;
    
    if (data) {
      events.value = data;
    }
  } catch (error) {
    const errorDetails = handleApiError(error, 'loadEvents');
  } finally {
    loading.value = false;
  }
}
  
  // Watch for changes to the current month and reload events
  watch([currentDate, activeTab], async () => {
    await loadEvents();
  });
  
  // Initialize data and check family context
  onMounted(async () => {
    await checkFamilyContext();
    await loadEvents();
  });
  </script>