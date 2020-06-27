import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js';
import reduce from 'lodash/reduce';
import moment from 'moment';
import styled from 'styled-components';
import { useFetch } from 'react-async';
import get from 'lodash/get';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import { SelectableService } from 'ag-grid-community';
import zoom from 'chartjs-plugin-zoom';
import { rpcQuotesPriceDiscoveryHistorical } from '../../../../lib/api';
import Loading from '../../../../shared/components/Loading';
import { Title, defaultGraphOptions } from './shared';

const ChartWrapper = styled.div.withConfig({
  displayName: 'ChartWrapper',
})`
    position: relative;
    height: 100%;
    width: 100%;
  `;

const LoadingWrapper = styled.div.withConfig({
  displayName: 'LoadingWrapper',
})`
> .load {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
}
`;


const HistoricalFlatPrices = (props) => {
  const { data } = props;
  const chartRef = useRef(null);

  const [xData, setXData] = useState(null);
  const [yData, setYData] = useState(null);
  const { url, meta } = rpcQuotesPriceDiscoveryHistorical;
  const { data: fetchData, run, isPending } = useFetch(url, meta, {
    defer: true,
  });

  useEffect(() => {
    if (fetchData) {
      const localXData = [];
      const localYData = [];
      fetchData.forEach((d) => {
        localXData.push(moment(d.valid_on, 'YYYY-MM-DD'));
        localYData.push(d.normalized_usd_value);
      });
      setXData(localXData);
      setYData(localYData);
    }
  }, [fetchData]);

  useEffect(() => {
    run({
      body: JSON.stringify({
        req_commodity_id: get(data, 'commodity_id'),
        req_export_country_code: get(data, 'export_country_code'),
        req_incoterm_code: get(data, 'incoterm_code'),
        req_import_country_code: get(data, 'import_country_code'),
        opt_specs: get(data, 'specs'),
      }),
    });
  }, []);

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
    if (chartRef.current && xData && yData) {
      const myLineChart = new Chart(chartRef.current, {
        el: chartRef.current,
        type: 'line',
        data: chartData,
        options: defaultGraphOptions,
        plugins: [zoom],
      });
    }
  }, [chartRef, xData, yData]);

  return (
    <>
      <Title> Historical Flat Price</Title>
      <ChartWrapper className="chart-container" style={{ marginBottom: '30px' }}>
        {isPending && <LoadingWrapper><Loading loading /></LoadingWrapper>}
        <canvas ref={chartRef} />
      </ChartWrapper>
    </>
  );
};

export default HistoricalFlatPrices;
