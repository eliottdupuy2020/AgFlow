import React, { useRef, useEffect } from 'react';
import reduce from 'lodash/reduce';
import BarChart from '../../../lib/chartModules/barChart';


const YoYExportsChart = (props) => {
  const { data } = props;
  const reduced = reduce(data.dataset, (ac, currentValue) => {
    ac.push(currentValue);
    return ac;
  }, []);

  const parsed = [];
  const firstYear = [...reduced].splice(0, 12);
  const secondYear = [...reduced].splice(12, 24);

  let i = 0;
  while (i < 12) {
    parsed.push(firstYear[i]);
    parsed.push(secondYear[i]);
    i += 1;
  }

  const chartRef = useRef(null);
  useEffect(() => {
    const chart = new BarChart({
      el: chartRef.current,
      data: {
        data: parsed,
        bgColors: [
          '#563a44', '#2d554d', '#563a44', '#2d554d', '#563a44', '#2d554d',
          '#563a44', '#2d554d', '#563a44', '#2d554d', '#563a44', '#2d554d',
          '#563a44', '#2d554d', '#563a44', '#2d554d', '#563a44', '#2d554d',
          '#563a44', '#2d554d', '#563a44', '#2d554d', '#563a44', '#2d554d',
        ],
        bdColors: [
          '#9b4845', '#398a61', '#9b4845', '#398a61', '#9b4845', '#398a61',
          '#9b4845', '#398a61', '#9b4845', '#398a61', '#9b4845', '#398a61',
          '#9b4845', '#398a61', '#9b4845', '#398a61', '#9b4845', '#398a61',
          '#9b4845', '#398a61', '#9b4845', '#398a61', '#9b4845', '#398a61',
        ],
      },
    });
  }, []);

  return (
    <div className="chart-container" style={{ border: '1px solid rgba(255, 255,255,0.1)' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default YoYExportsChart;
