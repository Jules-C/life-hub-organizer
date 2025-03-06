import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/services/auth';
import type { User } from '@supabase/supabase-js';
import type { SignUpRequest, ProfileUpdateRequest } from '@/services/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(true);
  const redirectPath = ref<string | null>(null);
  const isAuthenticated = computed(() => !!user.value);
  
  function setRedirectPath(path: string) {
    redirectPath.value = path;
  }

  function getRedirectPath() {
    const path = redirectPath.value;
    redirectPath.value = null;
    return path || '/';
  }
  
  async function initialize() {
    loading.value = true;
    try {
      user.value = await authService.getCurrentUser();
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      loading.value = false;
    }
  }
  
  async function login(email: string, password: string) {
    loading.value = true;
    try {
      const { user: authUser, error } = await authService.signIn(email, password);
      if (error) throw error;
      user.value = authUser;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  }
  
  async function register(email: string, password: string, firstName: string, lastName: string) {
    loading.value = true;
    try {
      const signupRequest: SignUpRequest = {
        email,
        password,
        firstName,
        lastName
      };
      
      const { user: authUser, error } = await authService.signUp(signupRequest);
      if (error) throw error;
      user.value = authUser;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  }
  
  async function logout() {
    try {
      await authService.signOut();
      user.value = null;
      return { success: true };
    } catch (error: any) {
      console.error('Failed to logout:', error);
      return { success: false, error: error.message };
    }
  }
  
  async function updateProfile(updates: ProfileUpdateRequest) {
    if (!user.value) return { success: false, error: 'Not authenticated' };
    
    try {
      const { user: updatedUser, error } = await authService.updateProfile(updates);
      
      if (error) throw error;
      user.value = updatedUser;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  return {
    user,
    loading,
    redirectPath,
    isAuthenticated,
    initialize,
    login,
    register,
    logout,
    updateProfile,
    setRedirectPath,
    getRedirectPath
  };
});