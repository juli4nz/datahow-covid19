<template>
  <v-container>
    <main-graph></main-graph>
  </v-container>
</template>

<script>
import MainGraph from '../components/MainGraph.vue';
export default {
  name: 'Dashboard',

  components: {
    MainGraph,
  },
};
</script>
