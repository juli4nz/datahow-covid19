<script>
import { Line } from 'vue-chartjs';
export default {
  extends: Line,
  props: {
    chartLabels: {
      type: Array,
      default() {
        return [];
      },
      required: true,
    },
    chartData: {
      type: Array,
      default() {
        return [];
      },
    },
    chartOptions: {
      type: Object,
      default() {
        return {};
      },
    },
    chartTitle: {
      type: String,
      default: '',
    },
  },
  data: () => {
    return {
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
              gridLines: {
                display: true,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  mounted() {
    this.renderChart(
      {
        labels: this.chartLabels,
        datasets: [
          {
            label: this.chartTitle,

            pointBackgroundColor: 'white',
            borderWidth: 0,
            borderColor: 'transparent',
            backgroundColor: '#74A57F',

            data: this.chartData,
          },
        ],
      },
      { ...this.options, ...this.chartOptions }
    );
  },
};
</script>
