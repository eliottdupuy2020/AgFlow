import React from 'react';

import styled from 'styled-components';
import { useFetch } from 'react-async';
import get from 'lodash/get';

const DestinationCellWrapper = styled.div.withConfig({
  displayName: 'DestinationCellWrapper',
})`
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    justify-content: start;
    align-items: center;
    margin-left: 5px;
  `;

const LocationWrapper = styled.div.withConfig({
  displayName: 'LocationWrapper',
})`
    display: flex;
    flex-direction: column;
  `;

const CountryName = styled.span.withConfig({
  displayName: 'CountryName',
})`
  font-size: 14px;
  font-weight: 600;
  `;

const ImportName = styled.span.withConfig({
  displayName: 'ImportName',
})`
  font-size: 12px;
  color: beige;
  font-style: italic;
  `;

const LoadingCell = (props) => {
  const { node, value } = props;
  const exportName = get(props, 'node.data.export_name', '');
  const parentIsGroup = get(props, 'node.parent.group', false);
  return (
    <>
      <DestinationCellWrapper>
        <LocationWrapper>
          <CountryName>
            {value}
          </CountryName>
          <ImportName>
            {exportName}
          </ImportName>
        </LocationWrapper>
      </DestinationCellWrapper>
    </>
  );
};


export default LoadingCell;
