// src/test-setup-pinia.ts
import { vi } from 'vitest';
import type { StoreDefinition } from 'pinia';

/**
 * Helper to create a mock store that can be used with testing
 * @param storeDefinition The store definition from Pinia
 * @returns A mock store that can be used in tests
 */
export function createMockStore<T extends StoreDefinition<any, any, any, any>>(
  storeDefinition: T
): ReturnType<T> & { mock: ReturnType<typeof vi.fn> } {
  const store = {} as ReturnType<T> & { mock: ReturnType<typeof vi.fn> };
  
  // Add mock methods to the store
  store.mock = vi.fn();
  
  return store;
}

/**
 * Helper to create mock components for testing
 * @param componentName The name of the component
 * @param template The component template
 * @param setup The component setup function
 * @returns A mock component that can be used in tests
 */
export function createMockComponent(
  componentName: string, 
  template: string = '<div></div>',
  setup: () => any = () => ({})
) {
  return {
    name: componentName,
    template,
    setup
  };
}
