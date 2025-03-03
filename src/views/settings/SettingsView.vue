<template>  <!-- Create Family Modal -->
  <div v-if="showCreateFamilyModal" class="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showCreateFamilyModal = false"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div>
          <div class="mt-3 text-center sm:mt-0 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Create Family
            </h3>
            <div class="mt-4">
              <form @submit.prevent="createFamily">
                <div class="mb-4">
                  <label for="family-name" class="block text-sm font-medium text-gray-700">Family Name</label>
                  <input 
                    type="text" 
                    id="family-name" 
                    v-model="newFamily.name"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="e.g. Smith Family"
                  />
                </div>
                
                <div class="mb-4">
                  <label for="family-description" class="block text-sm font-medium text-gray-700">Description (Optional)</label>
                  <textarea 
                    id="family-description" 
                    v-model="newFamily.description" 
                    rows="3" 
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="A brief description of your family"
                  ></textarea>
                </div>
                
                <!-- Action Buttons -->
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    :disabled="saving"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                  >
                    <span v-if="saving">Creating...</span>
                    <span v-else>Create Family</span>
                  </button>
                  <button
                    type="button"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    @click="showCreateFamilyModal = false"
                    :disabled="saving"
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

  <!-- Invite Member Modal -->
  <div v-if="showInviteMemberModal" class="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showInviteMemberModal = false"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div>
          <div class="mt-3 text-center sm:mt-0 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Invite Family Member
            </h3>
            <div class="mt-4">
              <form @submit.prevent="inviteMember">
                <div class="mb-4">
                  <label for="member-email" class="block text-sm font-medium text-gray-700">Email Address</label>
                  <input 
                    type="email" 
                    id="member-email" 
                    v-model="newMember.email"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div class="mb-4">
                  <label for="member-role" class="block text-sm font-medium text-gray-700">Role</label>
                  <select 
                    id="member-role" 
                    v-model="newMember.role"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <!-- Action Buttons -->
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    :disabled="saving"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                  >
                    <span v-if="saving">Sending...</span>
                    <span v-else>Send Invitation</span>
                  </button>
                  <button
                    type="button"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    @click="showInviteMemberModal = false"
                    :disabled="saving"
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
  </div><template>
  <AppLayout>
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h2 class="text-xl font-semibold text-gray-900">Settings</h2>
        <p class="mt-1 text-sm text-gray-500">
          Manage your account and preferences
        </p>
      </div>
      
      <!-- Settings Tabs -->
      <div class="border-t border-gray-200">
        <div class="px-4 py-4 sm:px-6">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
              <button
                @click="activeTab = 'profile'"
                class="py-4 px-1 border-b-2 font-medium text-sm"
                :class="activeTab === 'profile' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                Profile
              </button>
              <button
                @click="activeTab = 'family'"
                class="py-4 px-1 border-b-2 font-medium text-sm"
                :class="activeTab === 'family' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                Family
              </button>
              <button
                @click="activeTab = 'integrations'"
                class="py-4 px-1 border-b-2 font-medium text-sm"
                :class="activeTab === 'integrations' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                Integrations
              </button>
              <button
              @click="activeTab = 'features'"
              class="py-4 px-1 border-b-2 font-medium text-sm"
              :class="activeTab === 'features' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
              Features
              </button>
                <button
                  @click="activeTab = 'notifications'"
                  class="py-4 px-1 border-b-2 font-medium text-sm"
                  :class="activeTab === 'notifications' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                >
                  Notifications
                </button>
            </nav>
          </div>
        </div>
        
        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="px-4 py-5 sm:px-6">
          <div v-if="loading" class="py-12 flex justify-center">
            <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <form v-else @submit.prevent="saveProfile" class="space-y-6">
            <!-- Profile Picture -->
            <div class="flex items-center">
              <div class="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <button type="button" class="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Change
              </button>
            </div>
            
            <!-- Name -->
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="first-name" class="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div class="mt-1">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    v-model="profile.firstName"
                    autocomplete="given-name"
                    class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="last-name" class="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <div class="mt-1">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    v-model="profile.lastName"
                    autocomplete="family-name"
                    class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  v-model="profile.email"
                  autocomplete="email"
                  disabled
                  class="bg-gray-100 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p class="mt-1 text-sm text-gray-500">To change your email, please contact support.</p>
            </div>
            
            <!-- Save Button -->
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="saving"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span v-if="saving">Saving...</span>
                <span v-else>Save</span>
              </button>
            </div>
          </form>
        </div>
        
        <!-- Family Tab -->
        <div v-if="activeTab === 'family'" class="px-4 py-5 sm:px-6">
          <div v-if="loading" class="py-12 flex justify-center">
            <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else class="space-y-6">
            <!-- Personal or Family Mode -->
            <div>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Usage Mode</h3>
              </div>
              
              <div v-if="isPersonalOnly" class="mt-5 bg-white shadow overflow-hidden rounded-md">
                <div class="px-4 py-5 sm:p-6">
                  <h4 class="text-base font-medium text-gray-900">You're using LifeHubOrganizer in Personal Mode</h4>
                  <p class="mt-1 text-sm text-gray-500">
                    In Personal Mode, all your data is private to you. You can create a family to share events, documents, and more.
                  </p>
                  
                  <div class="mt-5">
                    <button
                      type="button"
                      @click="showCreateFamilyModal = true"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Create a Family
                    </button>
                  </div>
                </div>
              </div>
              
              <div v-else class="mt-5 bg-white shadow overflow-hidden rounded-md">
                <div class="px-4 py-5 sm:p-6">
                  <h4 class="text-base font-medium text-gray-900">You're using LifeHubOrganizer in Family Mode</h4>
                  <p class="mt-1 text-sm text-gray-500">
                    You can share events, documents, and more with your family members.
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Family Members Section -->
            <div>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Family Members</h3>
                <button
                  v-if="!isPersonalOnly"
                  type="button"
                  @click="showInviteMemberModal = true"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Family Member
                </button>
              </div>
              <p v-if="isPersonalOnly" class="mt-1 text-sm text-gray-500">
                Create a family to start adding members.
              </p>
              <p v-else-if="familyMembers.length === 0" class="mt-1 text-sm text-gray-500">
                You haven't added any family members yet.
              </p>
              
              <!-- Family member list -->
              <ul v-if="!isPersonalOnly && familyMembers.length > 0" class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <li v-for="member in familyMembers" :key="member.id" class="col-span-1 flex shadow-sm rounded-md">
                  <div class="flex-shrink-0 flex items-center justify-center w-16 bg-primary-600 text-white text-sm font-medium rounded-l-md">
                    {{ member.initials }}
                  </div>
                  <div class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                    <div class="flex-1 px-4 py-2 text-sm truncate">
                      <p class="text-gray-900 font-medium">{{ member.name }}</p>
                      <p class="text-gray-500">{{ member.email }}</p>
                    </div>
                    <div class="flex-shrink-0 pr-2">
                      <span v-if="member.role === 'admin'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Admin
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Integrations Tab -->
        <div v-if="activeTab === 'integrations'" class="px-4 py-5 sm:px-6">
          <div v-if="loading" class="py-12 flex justify-center">
            <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else class="space-y-6">
            <!-- Calendar Integrations -->
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900">Calendar Integrations</h3>
              <div class="mt-4 space-y-4">
                <div class="flex justify-between items-center p-4 border border-gray-200 rounded-md">
                  <div class="flex items-center">
                    <div class="w-10 h-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12.25c0 5.66-4.59 10.25-10.25 10.25S1.5 17.91 1.5 12.25 6.09 2 11.75 2 22 6.59 22 12.25z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M11.75 8v4.25l2.75 2.75" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-sm font-medium text-gray-900">Google Calendar</h4>
                      <p class="text-sm text-gray-500">Sync your Google Calendar events</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Connect
                  </button>
                </div>
                
                <div class="flex justify-between items-center p-4 border border-gray-200 rounded-md">
                  <div class="flex items-center">
                    <div class="w-10 h-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 8v8a5 5 0 01-5 5H8a5 5 0 01-5-5V8a5 5 0 015-5h8a5 5 0 015 5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 10h5.586c.89 0 1.337 0 1.677.269.34.268.396.74.509 1.683l.857 7.136c.014.117.021.175.001.224a.21.21 0 01-.119.117C16.458 19.458 16.4 19.45 16.284 19.437l-7.136-.857c-.944-.113-1.415-.17-1.683-.509C7.196 17.73 7.196 17.284 7.196 16.394V10.8c0-.466 0-.699.076-.891a1 1 0 01.633-.633c.192-.076.425-.076.891-.076V10z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-sm font-medium text-gray-900">Outlook Calendar</h4>
                      <p class="text-sm text-gray-500">Sync your Outlook calendar events</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Email Integrations -->
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900">Email Integrations</h3>
              <div class="mt-4 space-y-4">
                <div class="flex justify-between items-center p-4 border border-gray-200 rounded-md">
                  <div class="flex items-center">
                    <div class="w-10 h-10 flex-shrink-0 bg-red-100 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-sm font-medium text-gray-900">Gmail</h4>
                      <p class="text-sm text-gray-500">Process emails from your Gmail account</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Features Tab -->
        <div v-if="activeTab === 'features'" class="px-4 py-5 sm:px-6">
          <div v-if="loading" class="py-12 flex justify-center">
            <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else class="space-y-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Feature Settings</h3>
            <p class="mt-1 text-sm text-gray-500">
              Enable or disable features based on your preferences.
            </p>
            
            <div class="mt-6">
              <div class="space-y-4">
                <!-- Personal Health Features -->
                <div class="border-t border-gray-200 pt-6">
                  <h4 class="text-sm font-medium text-gray-900">Personal Health Features</h4>
                  
                  <div class="mt-4 flex items-start">
                    <div class="flex items-center h-5">
                      <input
                        id="feature-health-tracking"
                        name="feature-health-tracking"
                        type="checkbox"
                        class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        v-model="features.healthTracking"
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="feature-health-tracking" class="font-medium text-gray-700">Enable Health Tracking</label>
                      <p class="text-gray-500">Track your health data with cycle tracking and analysis.</p>
                    </div>
                  </div>
                  
                  <div class="mt-4 flex items-start pl-8" v-if="features.healthTracking">
                    <div class="flex items-center h-5">
                      <input
                        id="feature-health-privacy"
                        name="feature-health-privacy"
                        type="checkbox"
                        class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        v-model="features.healthPrivacy"
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="feature-health-privacy" class="font-medium text-gray-700">Enhanced Privacy Mode</label>
                      <p class="text-gray-500">Hide all health indicators from shared views and calendars.</p>
                    </div>
                  </div>
                </div>
                
                <!-- Personal Events Features -->
                <div class="border-t border-gray-200 pt-6">
                  <h4 class="text-sm font-medium text-gray-900">Personal Events Features</h4>
                  
                  <div class="mt-4 flex items-start">
                    <div class="flex items-center h-5">
                      <input
                        id="feature-personal-events"
                        name="feature-personal-events"
                        type="checkbox"
                        class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        v-model="features.personalEvents"
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="feature-personal-events" class="font-medium text-gray-700">Enable Personal Events</label>
                      <p class="text-gray-500">Manage personal and work events with privacy controls. Disabling this feature simplifies the calendar to focus only on family events and removes work/private event separation.</p>
                    </div>
                  </div>
                  
                  <div class="mt-4 flex items-start pl-8" v-if="features.personalEvents">
                    <div class="flex items-center h-5">
                      <input
                        id="feature-work-schedule"
                        name="feature-work-schedule"
                        type="checkbox"
                        class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        v-model="features.workSchedule"
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="feature-work-schedule" class="font-medium text-gray-700">Work Schedule Template</label>
                      <p class="text-gray-500">Enable work schedule templates and recurring patterns.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Save Button -->
              <div class="mt-8 flex justify-end">
                <button
                  type="button"
                  :disabled="saving"
                  @click="saveFeatures"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <span v-if="saving">Saving...</span>
                  <span v-else>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Notifications Tab -->
        <div v-if="activeTab === 'notifications'" class="px-4 py-5 sm:px-6">
          <div v-if="loading" class="py-12 flex justify-center">
            <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else class="space-y-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Notification Preferences</h3>
            <p class="mt-1 text-sm text-gray-500">
              Configure how and when you receive notifications from LifeHubOrganizer.
            </p>
            
            <div class="mt-6">
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="email-notifications"
                      name="email-notifications"
                      type="checkbox"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      v-model="notifications.email"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="email-notifications" class="font-medium text-gray-700">Email notifications</label>
                    <p class="text-gray-500">Receive email notifications for important events and updates.</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="browser-notifications"
                      name="browser-notifications"
                      type="checkbox"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      v-model="notifications.browser"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="browser-notifications" class="font-medium text-gray-700">Browser notifications</label>
                    <p class="text-gray-500">Receive browser push notifications when using the web app.</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="document-notifications"
                      name="document-notifications"
                      type="checkbox"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      v-model="notifications.documents"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="document-notifications" class="font-medium text-gray-700">Document updates</label>
                    <p class="text-gray-500">Receive notifications when documents are added, updated, or shared.</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="calendar-notifications"
                      name="calendar-notifications"
                      type="checkbox"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      v-model="notifications.calendar"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="calendar-notifications" class="font-medium text-gray-700">Calendar reminders</label>
                    <p class="text-gray-500">Receive notifications for upcoming events and appointments.</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="task-notifications"
                      name="task-notifications"
                      type="checkbox"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      v-model="notifications.tasks"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="task-notifications" class="font-medium text-gray-700">Task assignments</label>
                    <p class="text-gray-500">Receive notifications when tasks are assigned to you or completed.</p>
                  </div>
                </div>
              </div>
              
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-700">Quiet Hours</h4>
                <p class="mt-1 text-sm text-gray-500">Set times when you don't want to receive non-urgent notifications.</p>
                
                <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div class="sm:col-span-3">
                    <label for="quiet-hours-start" class="block text-sm font-medium text-gray-700">
                      Start time
                    </label>
                    <div class="mt-1">
                      <input
                        type="time"
                        name="quiet-hours-start"
                        id="quiet-hours-start"
                        v-model="notifications.quietHoursStart"
                        class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div class="sm:col-span-3">
                    <label for="quiet-hours-end" class="block text-sm font-medium text-gray-700">
                      End time
                    </label>
                    <div class="mt-1">
                      <input
                        type="time"
                        name="quiet-hours-end"
                        id="quiet-hours-end"
                        v-model="notifications.quietHoursEnd"
                        class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-6 flex justify-end">
                <button
                  type="button"
                  :disabled="saving"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <span v-if="saving">Saving...</span>
                  <span v-else>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppLayout from '@/components/layout/AppLayout.vue';
import { useAuthStore } from '@/stores/auth';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { getFamilyContext } from '@/utils/familyUtils';

const authStore = useAuthStore();
const activeTab = ref('profile');
const loading = ref(true);
const saving = ref(false);
const userPreferencesStore = useUserPreferencesStore();
const features = ref({...userPreferencesStore.features});
const isPersonalOnly = ref(true); // Default to personal mode until we check
const familyMembers = ref([]);
const showCreateFamilyModal = ref(false);
const showInviteMemberModal = ref(false);

const profile = ref({
  firstName: '',
  lastName: '',
  email: ''
});

const notifications = ref({
  email: true,
  browser: true,
  documents: true,
  calendar: true,
  tasks: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00'
});

async function saveFeatures() {
  saving.value = true;
  try {
    const result = await userPreferencesStore.updateFeatures(features.value);
    if (result.success) {
      // Show success message
      alert('Feature settings saved successfully!');
    } else {
      // Show error message
      alert('Failed to save feature settings. Please try again.');
    }
  } catch (error) {
    console.error('Error saving features:', error);
    alert('An error occurred while saving. Please try again.');
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  loading.value = true;
  
  // Check family context
  await checkFamilyContext();
  
  // Initialize user preferences
  await userPreferencesStore.initialize();
  
  // Copy the feature values from the store to our local state
  features.value = JSON.parse(JSON.stringify(userPreferencesStore.features));
  
  // Get user profile data if available
  if (authStore.user) {
    // Get user metadata from Supabase user
    const metadata = authStore.user.user_metadata;
    
    profile.value = {
      firstName: metadata?.first_name || '',
      lastName: metadata?.last_name || '',
      email: authStore.user.email || ''
    };
  }
  
  loading.value = false;
});

async function saveProfile() {
  saving.value = true;
  
  try {
    await authStore.updateProfile({
      firstName: profile.value.firstName,
      lastName: profile.value.lastName
    });
    
    // Show success message or toast notification here
  } catch (error) {
    console.error('Failed to update profile:', error);
    // Show error message or toast notification here
  } finally {
    saving.value = false;
  }
}
</script>
