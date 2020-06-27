/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useEffect, useState } from 'react';
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


const DestinationCell = (props) => {
  const { node, value } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  // Using an extra state since node.expanded is always false somehow
  useEffect(() => {
    setIsExpanded(node.expanded);
  }, [node.expanded]);


  const importName = get(props, 'node.data.import_name', '');
  const parentIsGroup = get(props, 'node.parent.group', false);
  return (
    <DestinationCellWrapper onClick={() => {
      node.setExpanded(!node.expanded);
      setIsExpanded(!isExpanded);
    }}
    >
      {
      parentIsGroup && (
      <>
        <span
          className={`lnr ${isExpanded ? 'lnr-circle-minus' : 'lnr-plus-circle'}`}
          style={{ marginRight: '7px', marginTop: '-19px' }}
        />

        <LocationWrapper>
          <CountryName>
            {value}
          </CountryName>
          <ImportName>
            {importName}
          </ImportName>
        </LocationWrapper>
      </>
      )
    }
      {
!parentIsGroup && <><ImportName style={{ marginLeft: '20px' }}>{importName}</ImportName></>
      }
    </DestinationCellWrapper>
  );
};

export default DestinationCell;
