import React, { useEffect, useState } from 'react';
import ArrowUpIcon from 'mdi-react/ArrowUpIcon';
import ArrowDownIcon from 'mdi-react/ArrowDownIcon';
import {
  AreaChart, Area,
} from 'recharts';
import { useFetch } from 'react-async';
import styled from 'styled-components';
import { rpcFreightPriceDiscoveryHistorical } from '../../../lib/api';


const NotEnoughData = styled.span.withConfig({
  displayName: 'NotEnoughData',
})`
  font-style: italic;
`;

const HistoricalChart = (props) => {
  const { data: nodeData } = props;

  const [historicalData, setHistoricalData] = useState(null);

  const { url, meta } = rpcFreightPriceDiscoveryHistorical;
  const { data: fetchData, run } = useFetch(url, {
    ...meta,
  }, {
    onResolve: (d) => {
      setHistoricalData(d);
    },
  });
  useEffect(() => {
    run({
      body: JSON.stringify({
        import_id: nodeData.import_id,
        export_id: nodeData.export_id,
        volume: nodeData.volume,
      }),
    });
  }, [nodeData.import_id, nodeData.export_id, nodeData.volume]);

  let diff = 0;
  if (historicalData && historicalData.length > 0) {
    diff = historicalData && historicalData[0].value - historicalData[historicalData.length - 1].value; // FIXME
  }

  const getCorrectCfg = (difference) => {
    const negativeDiffCfg = {
      linearGradientId: 'colorRaisingDown',
      color: '#e75c4b',
      areaFill: 'url(#colorRaisingDown)',
      diffDivClassName: 'chart-rising-down',
      icon: <ArrowDownIcon />,
      value: `-${difference}`,
    };
    const positiveDiffCfg = {
      linearGradientId: 'colorRaisingUp',
      color: '#82ca9d',
      areaFill: 'url(#colorRaisingUp)',
      diffDivClassName: 'chart-rising-up',
      icon: <ArrowUpIcon />,
      value: `+${difference * -1}`,
    };
    return (difference > 0 ? negativeDiffCfg : positiveDiffCfg);
  };
  const c = getCorrectCfg(diff);

  if (!historicalData) {
    return <div />;
  }
  if (historicalData && historicalData.length <= 1) {
    return <NotEnoughData>No enough data</NotEnoughData>;
  }
  return (
    <>
      <div className="chart-container">
        <AreaChart
          width={180}
          height={80}
          data={historicalData}
          margin={{
            top: 3, right: 0, left: 0, bottom: 5,
          }}
        >
          <defs>
            <linearGradient id={c.linearGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={c.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={c.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke={c.color} fillOpacity={1} fill={c.areaFill} />
        </AreaChart>
        <div className={c.diffDivClassName}>$ {c.value} {c.icon}</div>
      </div>

    </>
  );
};

export default HistoricalChart;
