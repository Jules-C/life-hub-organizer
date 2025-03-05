<template>
    <div v-if="show" class="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>
  
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
  
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Invite Family Member
              </h3>
              <div class="mt-4">
                <form @submit.prevent="handleInvite">
                  <div class="mb-4">
                    <label for="member-email" class="block text-sm font-medium text-gray-700">Email Address</label>
                    <input 
                      type="email" 
                      id="member-email" 
                      v-model="localNewMember.email"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div class="mb-4">
                    <label for="member-role" class="block text-sm font-medium text-gray-700">Role</label>
                    <select 
                      id="member-role" 
                      v-model="localNewMember.role"
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
                      @click="$emit('close')"
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
  </template>
  
  <script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  
  interface NewMemberData {
    email: string;
    role: string;
  }
  
  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    },
    saving: {
      type: Boolean,
      default: false
    },
    newMember: {
      type: Object as () => NewMemberData,
      required: true
    }
  });
  
  const emit = defineEmits(['close', 'invite']);
  
  // Create a local copy of the newMember object
  const localNewMember = ref<NewMemberData>({
    email: '',
    role: 'member'
  });
  
  // Watch for changes in the newMember prop and update local data
  watchEffect(() => {
    if (props.show) {
      localNewMember.value = {
        email: props.newMember.email || '',
        role: props.newMember.role || 'member'
      };
    }
  });
  
  function handleInvite() {
    emit('invite', {
      email: localNewMember.value.email,
      role: localNewMember.value.role
    });
  }
  </script>