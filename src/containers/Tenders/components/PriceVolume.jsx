import React from 'react';
import get from 'lodash/get';
import styled from 'styled-components';

const CellWrapper = styled.div.withConfig({
  displayName: 'CellWrapper',
})`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const PriceVolume = (props) => {
  const { data, colDef } = props;

  const innerData = data[colDef.field];
  return (
    <CellWrapper>
      <span> {innerData.total_volume || '-'} </span>
      <span> {innerData.average_price || '-'} </span>
    </CellWrapper>

  );
};

export default PriceVolume;
