import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js';
import reduce from 'lodash/reduce';
import moment from 'moment';
import styled from 'styled-components';
import { Title, defaultGraphOptions } from './shared';

const ChartWrapper = styled.div.withConfig({
  displayName: 'ChartWrapper',
})`
    position: relative;
    height: 100%;
    width: 100%;
    margin-bottom: 30px;
  `;

const ForwardCurve = (props) => {
  const { data } = props;
  const chartRef = useRef(null);

  const xData = [];
  const yData = [];
  Object.entries(data.prices).forEach((d) => {
    xData.push(moment(d[0], 'YYYY-MM-DD').format('MMM \'YY'));
    yData.push(d[1]);
  });

  const chartData = {
    labels: xData,
    datasets: [{
      data: yData,
      backgroundColor: '#fff',
      borderColor: '#59c72d',
      borderWidth: 1,
      lineTension: 0,
      fill: false,
    }],
  };

  useEffect(() => {
    if (chartRef.current) {
      const myLineChart = new Chart(chartRef.current, {
        el: chartRef.current,
        type: 'line',
        data: chartData,
        options: defaultGraphOptions,
      });
    }
  }, [chartRef]);
  return (
    <>
      <Title>Forward Curve</Title>
      <ChartWrapper className="chart-container">
        <canvas ref={chartRef} />
      </ChartWrapper>
    </>
  );
};

export default ForwardCurve;
