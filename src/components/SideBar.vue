<template>
  <v-card elevation="4" :loading="false" tile>
    <v-container>
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="selectedCountry"
            :items="countriesList"
            label="Select a country to display data"
            item-text="name"
            item-value="iso"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <form @submit.prevent="movingAverage">
            <v-menu
              v-model="maDates.menuFrom"
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
              <v-date-picker
                v-model="maDates.from"
                @input="maDates.menuFrom = false"
              ></v-date-picker>
            </v-menu>
            <v-menu
              v-model="maDates.menuTo"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="maDates.to"
                  label="To date:"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="maDates.to"
                @input="maDates.menuTo = false"
              ></v-date-picker>
            </v-menu>
            <v-btn color="primary" type="submit" elevation="1">Submit</v-btn>
          </form>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'SideBar',
  props: {},
  components: {},
  data: () => ({
    daysInterval: [],
    countriesList: [],
    selectedCountry: '',
    movingAverageValue: 0,
    maDates: {
      menuFrom: false,
      menuTo: false,
      from: '',
      to: '',
    },
  }),
  watch: {
    selectedCountry(newCountry) {
      this.$emit('update-country', newCountry);
      //this.fetchData(newCountry);
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
