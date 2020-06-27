/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useFetch } from 'react-async';
import get from 'lodash/get';

const OriginCellWrapper = styled.div.withConfig({
  displayName: 'OriginCellWrapper',
})`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: start;
  align-items: center;
  margin-left: 5px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  cursor: ${props => (props.clickable === true ? 'pointer' : 'default')}
`;

const OriginName = styled.span.withConfig({
  displayName: 'OriginName',
})`
font-size: 14px;
font-weight: 600;
opacity: ${props => (props.levelThree ? 0.5 : 1)};
margin-left: ${props => (props.levelThree ? '20px' : 0)};
`;

const Specs = styled.span.withConfig({
  displayName: 'Specs',
})`
    font-style: italic;
    font-weight: 400;
`;

const OriginCell = (props) => {
  const { node, value } = props;
  const [isExpanded, setIsExpanded] = useState(node.expanded);

  useEffect(() => {
    setIsExpanded(node.expanded);
  }, [node.expanded]);

  const importName = get(props, 'node.data.import_name', '');
  const parentIsGroup = get(props, 'node.parent.group', false);
  const commodityName = get(props, 'node.data.commodity');
  const exportCountryName = get(props, 'node.data.export_country_name');
  const exportPortName = get(props, 'node.data.export_name');
  const level = get(props, 'node.data.level');
  const specs = get(props, 'node.data.specs');

  //   FIXME: Can I use node.level instead of my own level?
  return (
    <OriginCellWrapper
      clickable={level === 0}
      onClick={() => {
        if (level !== 0) {
          return;
        }
        setIsExpanded(!isExpanded);
        node.setExpanded(!node.expanded);
      }}
    >
      {
      level === 0 && (
      <>
        <span
          className={`lnr ${node.expanded ? 'lnr-circle-minus' : 'lnr-plus-circle'}`}
          style={{ marginRight: '7px' }}
        />
        <OriginName>
          <div style={{ fontSize: '12px' }}>{exportCountryName}</div>
          <div style={{ fontSize: '10px', fontStyle: 'italic', fontWeight: 'normal' }}>{exportPortName}</div>
        </OriginName>
      </>
      )
    }
      {
        level === 1 && (
        <OriginName levelThree>
          <div style={{ fontSize: '12px' }}>{exportCountryName}</div>
          <div style={{ fontSize: '10px', fontStyle: 'italic', fontWeight: 'normal' }}>{exportPortName}</div>
        </OriginName>
        )
      }
    </OriginCellWrapper>
  );
};

export default OriginCell;
