<template>
  <v-container>
    <v-row>
      <v-col>
        <v-img
          lazy-src="@/assets/images/logo.png"
          max-height="150"
          max-width="250"
          src="@/assets/images/logo.png"
        ></v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-autocomplete
          v-model="selectedCountry"
          :items="countriesList"
          label="Select a country to display data"
          item-text="name"
          item-value="iso"
        ></v-autocomplete>
        <v-divider></v-divider>
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
    <v-row>
      <v-col>
        <v-banner>Moving Average</v-banner>
        <v-chip label outlined class="mt-2">{{ movingAverageValue }}</v-chip>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'SideBar',
  props: {
    chartData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {},
  data: () => ({
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

      const totalCases = this.chartData.reduce((prev, curr) => {
        if (
          moment(curr.label).isSameOrAfter(from) ||
          moment(curr.label).isSameOrBefore(to)
        ) {
          return curr.value + prev.value;
        }
      });
      this.movingAverageValue = Math.floor(totalCases / interval);
    },
  },
  created() {
    this.init();
  },
};
</script>
