// src/test-utils/test-helpers.ts
import { mount, VueWrapper, MountingOptions } from '@vue/test-utils';
import { createPinia } from 'pinia';

/**
 * Create a wrapper with standard configuration
 */
/**
 * Create a wrapper with standard configuration
 */
export function createTestWrapper<T>(
    component: T,
    options: Partial<Record<string, any>> = {}
  ): VueWrapper<any> {
    // Merge the global options correctly
    const globalOptions = {
      plugins: [createPinia()],
      ...(options.global || {})
    };
  
    return mount(component as any, {
      ...options,
      global: globalOptions
    } as any);
  }

/**
 * Find element by data-test attribute
 */
export function findByTestId(wrapper: VueWrapper<any>, testId: string) {
  return wrapper.find(`[data-test="${testId}"]`);
}

/**
 * Find all elements by data-test attribute
 */
export function findAllByTestId(wrapper: VueWrapper<any>, testId: string) {
  return wrapper.findAll(`[data-test="${testId}"]`);
}

/**
 * Create typed test data
 */
export function createTestData<T>(data: Partial<T>): T {
  return data as T;
}

/**
 * Wait for component to update
 */
export async function waitForUpdate(wrapper: VueWrapper<any>) {
  await wrapper.vm.$nextTick();
}