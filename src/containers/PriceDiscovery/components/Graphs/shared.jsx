/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const Title = styled.span.withConfig({
  displayName: 'Title',
})`
      font-size: 24px;
      color: #fff;
      margin-bottom: 5px;
`;

export const defaultGraphOptions = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  tooltips: {
    enabled: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  events: [],
  scales: {
    yAxes: [{
      display: true,
      type: 'linear',
      ticks: {
        maxTicksLimit: 5,
      },
    }],
    xAxes: [{
      display: true,
      type: 'time',
      ticks: {
        maxTicksLimit: 7,
      },
      time: {
        parser: 'MMM \'YY',
        unit: 'day',
        displayFormats: {
          day: 'DD/MM',
        },
      },
    }],
  },
  plugins: {
    zoom: {
      // Container for pan options
      pan: {
        // Boolean to enable panning
        enabled: true,

        // Panning directions. Remove the appropriate direction to disable
        // Eg. 'y' would only allow panning in the y direction
        mode: 'xy',
      },

      // Container for zoom options
      zoom: {
        // Boolean to enable zooming
        enabled: true,

        // Zooming directions. Remove the appropriate direction to disable
        // Eg. 'y' would only allow zooming in the y direction
        mode: 'xy',
      },
    },
  },
};
