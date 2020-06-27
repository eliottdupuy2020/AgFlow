/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useFetch } from 'react-async';
import get from 'lodash/get';

const CommodityCellWrapper = styled.div.withConfig({
  displayName: 'CommodityCellWrapper',
})`
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  justify-content: start;
  align-items: center;
  margin-left: 5px;
  cursor: ${props => (props.clickable === true ? 'pointer' : 'default')}
`;

const CommodityName = styled.span.withConfig({
  displayName: 'CommodityName',
})`
font-size: 14px;
font-weight: 600;
opacity: ${props => (props.levelTwo ? 0.5 : 1)};
margin-left: ${props => (props.levelTwo ? '20px' : 0)};
`;

const CommodityCell = (props) => {
  const { node, value } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  // Using an extra state since node.expanded is always false somehow
  useEffect(() => {
    setIsExpanded(node.expanded);
  }, [node.expanded]);


  const importName = get(props, 'node.data.import_name', '');
  const parentIsGroup = get(props, 'node.parent.group', false);
  const commodityName = get(props, 'node.data.commodity');
  const level = get(props, 'node.data.level');
  const contributor = get(props, 'node.data.contributor');
  const specs = get(props, 'node.data.specs');

  return (
    <CommodityCellWrapper
      clickable={level === 0}
      onClick={() => {
        if (level === 2) {
          return;
        }
        node.setExpanded(!node.expanded);
        setIsExpanded(!isExpanded);
      }}
    >
      {
      parentIsGroup && (
      <>
        <span
          className={`lnr ${isExpanded ? 'lnr-circle-minus' : 'lnr-plus-circle'}`}
          style={{ marginRight: '7px' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <CommodityName>
            {value}
          </CommodityName>
          <span style={{ fontSize: '10px', fontStyle: 'italic' }}> { specs } </span>
        </div>
      </>
      )
    }
      {
        !parentIsGroup && (
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <CommodityName levelTwo>
              {commodityName}
            </CommodityName>
            <span style={{ fontSize: '9px', fontStyle: 'italic', marginLeft: '20px' }}>{ specs } </span>
            <span style={{ fontSize: '9px', fontStyle: 'italic', marginLeft: '20px' }}> { contributor } </span>
          </div>
        )
      }
      {
level === 3
&& (
  <>
    {/* <ul style={{ listStyleType: 'none' }}>
      <li>
        <span style={{ fontWeight: 600 }}>{contributor}</span>
      </li>
      <li>
        <span style={{ fontStyle: 'italic', color: 'beige', fontSize: '12px' }}>{specs}</span>
      </li>
    </ul> */}
  </>
)
      }
    </CommodityCellWrapper>
  );
};

export default CommodityCell;
