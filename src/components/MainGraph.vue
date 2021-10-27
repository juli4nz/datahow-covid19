<template>
  <v-container>
    <v-autocomplete
      v-model="selectedCountry"
      :items="countriesList"
      label="Select a country to display data"
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
    <form @submit.prevent="movingAverage">
      <v-text-field
        label="From date:"
        type="date"
        v-model="maDates.from"
      ></v-text-field>
      <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="maDates.from"
            label="From date:"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" @input="menu2 = false"></v-date-picker>
      </v-menu>
      <v-text-field
        label="To date:"
        type="date"
        v-model="maDates.to"
      ></v-text-field>
      <v-btn color="primary" type="submit" elevation="1">Submit</v-btn>
    </form>
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
    selectedCountry: '',
    movingAverageValue: 0,
    chart: {
      data: [],
      labels: [],
      title: 'Daily new cases',
      loaded: true,
    },
    maDates: {
      from: '',
      to: '',
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
      for (const date of this.daysInterval) {
        promises.push(
          axios.get('http://localhost:8080/reports/total', {
            params: {
              date: date,
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
    movingAverage() {
      const from = moment(this.maDates.from);
      const to = moment(this.maDates.to);
      const interval = to.diff(from, 'days');

      const totalCases = this.chart.data.reduce((prev, curr, index) => {
        if (
          moment(this.daysInterval[index]).isSameOrAfter(from) ||
          moment(this.daysInterval[index]).isSameOrBefore(to)
        ) {
          return curr + prev;
        }
      });
      this.movingAverageValue = (totalCases / interval).toFixed(2);
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
    this.getDaysIntervalArray(10);
  },
};
</script>
