// src/test-utils/vue-component-helper.ts
import { mount, VueWrapper, ComponentMountingOptions } from '@vue/test-utils';
import { Component, ComponentPublicInstance } from 'vue';
// We'll add this import after installation
// import { createTestingPinia } from '@pinia/testing';
// import { vi } from 'vitest';

/**
 * Helper type that extracts component instance type from a Vue component
 */
export type ComponentInstance<T> = T extends new (...args: any[]) => infer R
  ? R
  : T extends (...args: any[]) => infer R
  ? R extends { __isVue: true; $props: infer P }
    ? ComponentPublicInstance<P>
    : never
  : ComponentPublicInstance;

/**
 * Use this to type cast component instances in tests
 */
export function defineComponentType<T extends Record<string, any>>(obj: T): T {
  return obj;
}

/**
 * More permissive mount function for use in testing
 */
export function mountComponent<T extends Component>(
  component: T,
  options: ComponentMountingOptions<any> = {}
) {
  const wrapper = mount(component, options);
  
  // Return wrapper with explicit type for vm to make it easier to work with
  return {
    ...wrapper,
    vm: wrapper.vm as unknown as ComponentPublicInstance & Record<string, any>
  };
}

/**
 * Create exposed component props for testing
 */
export function exposedProps<T extends Record<string, any>>(props: T): T {
  return props;
}
