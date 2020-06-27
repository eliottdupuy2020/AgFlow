/* eslint-disable max-len */
import React from 'react';
import styled from 'styled-components';
import Loading from '../../../shared/components/Loading';


const TranslucidOverlay = styled.div.withConfig({
  displayName: 'TranslucidOverlay',
})`
background-color: #14192f;
position: absolute;
top: 0;
right: 0;
bottom: 0;
left: 0;
opacity: 0.5;
font-size: 100;
color: #fff !important;
display: flex;
justify-content: center;
align-items: center;
`;

const StyledLoadingWrapper = styled.div.withConfig({
  displayName: 'StyledLoadingWrapper',
})`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  `;

const CustomLoadingOverlay = (props) => {
  const { loadingMessage } = props;
  return (
    <>
      <StyledLoadingWrapper>
        <Loading loading />
      </StyledLoadingWrapper>
      <TranslucidOverlay />
    </>
  );
};

export default CustomLoadingOverlay;
