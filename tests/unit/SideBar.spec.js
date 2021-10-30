import { createLocalVue, mount } from '@vue/test-utils';

import SideBar from '@/components/SideBar.vue';
import Vuetify from 'vuetify';

describe('SideBar.vue', () => {
  const localVue = createLocalVue();
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('should have a logo image', () => {
    const wrapper = mount(SideBar, {
      localVue,
      vuetify,
    });
    const logo = wrapper.find('[data-test="logo"]');
    expect(logo.props('src')).toEqual('@/assets/images/logo.png');
  });

  it('should have autocomplete', () => {
    const wrapper = mount(SideBar, {
      localVue,
      vuetify,
    });

    const autocomplete = wrapper.find('[data-test="autocomplete"]');
  });
});
