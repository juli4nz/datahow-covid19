<template>
  <v-container>
    <v-autocomplete
      v-model="selectedCountry"
      :items="countriesList"
      item-text="name"
      item-value="iso"
    ></v-autocomplete>
    <line-chart
      v-if="chart.loaded"
      :chart-options="chart.options"
      :chart-data="chart.data"
      :chart-labels="chart.labels"
      :chart-title="chart.title"
    >
    </line-chart>
    <v-progress-circular
      v-else
      :size="50"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </v-container>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import LineChart from './LineChart.vue';

export default {
  name: 'GraphBar',
  components: {
    LineChart,
  },
  data: () => ({
    daysInterval: [],
    countriesList: [],
    selectedCountry: 'PRT', //Portugal
    chart: {
      data: [],
      labels: [],
      title: 'Daily new cases',
      loaded: true,
    },
  }),
  watch: {
    selectedCountry(newCountry) {
      this.fetchData(newCountry);
    },
  },
  methods: {
    async init() {
      try {
        const { data } = await axios.get('http://localhost:8080/regions', {
          params: {
            order: 'name',
            sort: 'asc',
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        });
        this.countriesList = data.data;
      } catch (e) {
        console.error(e);
      }
    },
    async fetchData(country) {
      this.chart.loaded = false;
      let promises = [];
      for (let i = 0; i < this.daysInterval.length; i++) {
        promises.push(
          axios.get('http://localhost:8080/reports/total', {
            params: {
              date: this.daysInterval[i],
              iso: country,
            },
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          })
        );
      }
      try {
        await Promise.all(promises).then((resp) => {
          this.chart.data = resp.map(({ data }) => data.data.confirmed_diff);
          this.chart.labels = this.daysInterval;
          this.chart.loaded = true;
        });
      } catch (e) {
        console.error(e);
      }
    },
    getDaysIntervalArray(days) {
      const end = moment().toDate();
      let start = moment().subtract(days, 'days').toDate();
      while (start < end) {
        this.daysInterval.push(moment(start).format('YYYY-MM-DD'));
        start = moment(start).add(1, 'days').toDate();
      }
    },
  },
  created() {
    this.init();
    this.getDaysIntervalArray(90);
  },
};
</script>
