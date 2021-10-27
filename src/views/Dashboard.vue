<template>
  <v-row>
    <v-col cols="12" sm="4" md="4">
      <v-card elevation="4" :loading="false" tile class="rounded-lg pa-4">
        <side-bar
          @update-country="updateCountry"
          :chart-data="chartData"
        ></side-bar>
      </v-card>
    </v-col>
    <v-col cols="12" sm="8" md="8">
      <v-card elevation="4" :loading="false" tile class="rounded-lg pa-4">
        <main-graph
          @update-chart-data="updateChartData"
          :country="country"
        ></main-graph>
      </v-card>
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
      chartData: null,
    };
  },
  methods: {
    updateCountry(country) {
      this.country = country;
    },
    updateChartData(data) {
      this.chartData = data;
    },
  },
};
</script>
