import { createLocalVue, mount, shallowMount } from '@vue/test-utils';

import SideBar from '@/components/SideBar.vue';
import Vuetify from 'vuetify';

describe('SideBar.vue', () => {
  let wrapper, localVue, vuetify;

  beforeEach(() => {
    localVue = createLocalVue();
    vuetify = new Vuetify();
    wrapper = shallowMount(SideBar, {
      localVue,
      vuetify,
      propsData: {
        chartData: null,
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('should render a vue instance', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should have a logo image', () => {
    const logo = wrapper.find('[data-test="logo"]');
    expect(logo.props('src')).toMatch('@/assets/images/logo.png');
  });

  it('should have two date inputs', () => {
    const datesInputs = wrapper.findAll('[data-test="date"]');
    expect(datesInputs.length).toEqual(2);
  });
});
