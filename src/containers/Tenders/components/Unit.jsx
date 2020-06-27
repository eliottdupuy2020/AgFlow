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
    span {
      font-style: italic;
    }
`;

const Unit = props => (
  <CellWrapper>
    <span> USD/mt </span>
    <span> kmt </span>
  </CellWrapper>
);

export default Unit;
