<template>
  <v-row>
    <v-col>
      <side-bar @update-country="updateCountry"></side-bar>
    </v-col>
    <v-col>
      <main-graph :country="country"></main-graph>
    </v-col>
  </v-row>
</template>

<script>
import MainGraph from '../components/MainGraph.vue';
import SideBar from '../components/SideBar.vue';
export default {
  name: 'Dashboard',
  components: {
    MainGraph,
    SideBar,
  },
  data: () => {
    return {
      country: '',
    };
  },
  methods: {
    updateCountry(country) {
      this.country = country;
    },
  },
};
</script>
