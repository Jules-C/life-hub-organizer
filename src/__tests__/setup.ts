import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import type { MockInstance } from 'vitest'

interface SupabaseMock {
  auth: {
    getUser: MockInstance;
    signInWithPassword: MockInstance;
    signUp: MockInstance;
    signOut: MockInstance;
  };
  from: MockInstance;
}

// Mock supabase
vi.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }))
  } as SupabaseMock
}))

// Global component mocks
config.global.mocks = {
  $router: {
    push: vi.fn(),
    replace: vi.fn()
  }
}

// Global stubs
config.global.stubs = {
  'router-link': true,
  'router-view': true
}