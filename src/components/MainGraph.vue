<template>
  <v-container>
    <v-row>
      <v-col>
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
      </v-col>
    </v-row>
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
  props: {
    country: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    daysInterval: [],
    chart: {
      data: [],
      labels: [],
      title: 'Daily new cases',
      loaded: true,
    },
  }),
  watch: {
    country(newCountry) {
      this.fetchData(newCountry);
    },
  },
  methods: {
    init() {},
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
          const dataObj = this.chart.data.map((value, index) => {
            return { label: this.daysInterval[index], value: value };
          });
          this.$emit('update-chart-data', dataObj);
          this.chart.loaded = true;
        });
      } catch (e) {
        console.error(e);
      }
    },
    getDaysIntervalArray(days, spacer) {
      const end = moment().toDate();
      let start = moment().subtract(days, 'days').toDate();
      while (start < end) {
        this.daysInterval.push(moment(start).format('YYYY-MM-DD'));
        start = moment(start).add(spacer, 'days').toDate();
      }
    },
  },
  created() {
    //this.init();
    this.getDaysIntervalArray(90, 1);
  },
};
</script>
