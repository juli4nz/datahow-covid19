<template>
  <v-card elevation="4" :loading="false" tile>
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
  </v-card>
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
    movingAverageValue: 0,
    chart: {
      data: [],
      labels: [],
      title: 'Daily new cases',
      loaded: true,
    },
    maDates: {
      menuFrom: false,
      menuTo: false,
      from: '',
      to: '',
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
