import React from 'react';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';

const LegendList = styled.ul.withConfig({
  displayName: 'LegendList',
})`
    list-style-type: none;
    margin-top: 15px;
    margin-left: 0;
    padding-left: 0;
`;

const LegendItem = styled.li.withConfig({
  displayName: 'LegendItem',
})`
    margin-bottom: 8px;
`;

const StyledIcon = styled.span.withConfig({
  displayName: 'StyledIcon',
})`
    position: relative;
    margin-left: 2px;
    top: 1px;`;

const TooltipContent = (props) => {
  const { greenBars, redBars } = props;
  return (
    <div>
        The Year over year graphs compares two 12 months period.
      <LegendList>
        <LegendItem>
        The <span style={{ color: '#398a61' }}>green</span>
          {' '} bars represent the month by month period from {greenBars.from} to {greenBars.to}
        </LegendItem>
        <LegendItem>
        The <span style={{ color: '#9b4845' }}>red</span> bars
        stretch from {redBars.from} to {redBars.to}
        </LegendItem>

      </LegendList>
    </div>
  );
};


const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#1d2740',
    fontSize: '14px',
    paddingTop: '15px',
  },
}))(Tooltip);

const YoYHeaderComponent = (props) => {
  const { monthArray } = props;

  const greenBars = {
    from: monthArray[0],
    to: monthArray[11],
  };
  const redBars = {
    from: moment(monthArray[0], 'YYYY-MM').subtract(1, 'year').format('YYYY-MM'),
    to: moment(monthArray[11], 'YYYY-MM').subtract(1, 'year').format('YYYY-MM'),
  };
  return (
    <>
      <span> Year on year </span>
      <HtmlTooltip title={<TooltipContent greenBars={greenBars} redBars={redBars} />}>
        <StyledIcon className="sidebar__link-icon icon icon-info" />
      </HtmlTooltip>
    </>
  );
};

export default YoYHeaderComponent;
