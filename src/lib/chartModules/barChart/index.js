import Chart from 'chart.js';

export default class DonutChart {
  constructor(props) {
    this.el = props.el;
    this.config = props.config;
    this.chart = new Chart(this.el, this.getConfig(props.data));
  }

  getConfig = ({ data, bgColors, bdColors }) => ({
    type: 'bar',
    data: {
      labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      datasets: [{
        label: '# of Votes',
        data,
        backgroundColor: bgColors,
        borderColor: bdColors,
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      scales: {
        yAxes: [{
          display: false,
        }],
        xAxes: [{
          display: false,
          barPercentage: 1.0,
          categoryPercentage: 1.0,
        }],
      },
    },
  });

  update = ({ data, labels, colors }) => {
    this.chart.config.data.datasets[0].data = data;
    this.chart.config.data.datasets[0].backgroundColor = colors;
    this.chart.config.labels = labels;
  };

  destroy = () => {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  };
}
