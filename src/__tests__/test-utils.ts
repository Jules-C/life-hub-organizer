import { VueWrapper } from '@vue/test-utils';

export function findByTestId(wrapper: VueWrapper, testId: string) {
  return wrapper.find(`[data-test="${testId}"]`);
}

export function mockSupabaseResponse(data: any = null, error: any = null) {
  return { data, error };
}
