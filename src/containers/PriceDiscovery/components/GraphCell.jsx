import React, {
  useState, useRef, useEffect, createRef,
} from 'react';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import reduce from 'lodash/reduce';
import get from 'lodash/get';
import HistoricalFlatPrices from './Graphs/HistoricalFlatPrices';
import ForwardCurve from './Graphs/ForwardCurve';

const Title = styled.h1.withConfig({
  displayName: 'Title',
})`
  color: #fff;
  margin-bottom: 17px;
  font-size: 28px;
`;

const Legend = styled.span.withConfig({
  displayName: 'Legend',
})`
  display: inline-block;
  color: #fff;
  font-size: 14px;
  font-style: italic;
  justify-content: center;
  text-align: center;
`;

const Icon = styled.span.withConfig({
  displayName: 'Icon',
})`
    margin-left: 5px;
    cursor: pointer;
`;

const StyledBackdrop = styled(Backdrop).withConfig({
  displayName: 'StyledBackdrop',
})`
`;

const OuterModalWrapper = styled.div.withConfig({
  displayName: 'OuterModalWrapper',
})`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const InnerModalWrapper = styled.div.withConfig({
  displayName: 'InnerModalWrapper',
})`
  background-color: #1e2841;
  display: flex;
  flex-direction: column;
  width: 50%;
  position: relative;
  padding: 30px;
`;

const GraphCell = (props) => {
  const { node, data } = props;

  const [showModal, setShowModal] = useState(false);

  if (![0].includes(node.level)) {
    return <div />;
  }
  const commodity = get(data, 'commodity');
  const specs = get(data, 'specs');
  const exportCountryName = get(data, 'export_country_name');
  const incotermCode = get(data, 'incoterm_code');
  const importCountryName = get(data, 'import_country_name');
  return (
    <div>
      <Icon className="icon icon-stats-dots" onClick={() => setShowModal(true)} />
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        closeAfterTransition
        BackdropComponent={StyledBackdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showModal}>
          <OuterModalWrapper onClick={e => setShowModal(false)}>
            <InnerModalWrapper onClick={e => e.stopPropagation()}>
              <Title>
                {`${commodity} (${specs}) - ${exportCountryName} (${incotermCode}) ${importCountryName}`}
              </Title>
              <HistoricalFlatPrices data={data} />
              <ForwardCurve data={data} />
              <Legend>Prices are in USD/mt</Legend>
            </InnerModalWrapper>
          </OuterModalWrapper>
        </Fade>
      </Modal>
    </div>

  );
};

export default GraphCell;
