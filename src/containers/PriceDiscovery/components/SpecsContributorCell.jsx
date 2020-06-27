import React from 'react';
import get from 'lodash/get';
import styled from 'styled-components';

const Wrapper = styled.div.withConfig({
  displayName: 'Wrapper',
})`
    display: flex;
    flex-direction: column;
    font-size: 10px;
`;

const Specs = styled.span.withConfig({
  displayName: 'Specs',
})`
    
`;

const Contributor = styled.span.withConfig({
  displayName: 'Contributor',
})`
      
`;

const SpecsContributorCell = (props) => {
  const { data } = props;
  const specs = get(data, 'specs');
  const contributor = get(data, 'contributor', '-');
  return (
    <Wrapper>
      <Specs>{specs}</Specs>
      {
        data.level === 1 && (
        <Contributor>{contributor}</Contributor>
        )
    }
    </Wrapper>
  );
};

export default SpecsContributorCell;
