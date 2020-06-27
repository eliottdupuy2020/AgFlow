import React, {
  useState, useEffect, useRef, useLayoutEffect,
} from 'react';
import {
  Col, Container, Row, Card, CardBody,
} from 'reactstrap';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import Select from 'react-select';
import moment from 'moment';
import { useFetch } from 'react-async';
import get from 'lodash/get';
import remove from 'lodash/remove';
import numeral from 'numeral';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import CommodityCell from './components/CommodityCell';
import OriginCell from './components/OriginCell';
import GraphCell from './components/GraphCell';
import CustomLoadingOverlay from './components/CustomLoadingOverlay';
import {
  quotesPriceDiscoverySummary,
  rpcQuotesPriceDiscoveryLevelTwo,
  rpcQuotesPriceDiscoveryLevelThree,
} from '../../lib/api';
import PriceDiscoveryFilter from './components/PriceDiscoveryFilter';
import OneCommodityTable from './components/OneCommodityTable';
import ManyCommodityTable from './components/ManyCommodityTable';

const PriceDiscovery = () => {
  const [currentCurrency, setCurrentCurrency] = useState(null);

  const commodities = [
    { value: null, label: 'Any' },
    { value: 195, label: 'Wheat' },
    { value: 25, label: 'Corn' },
    { value: 11, label: 'Barley' },
    { value: 143, label: 'Soybean' },
    { value: 160, label: 'Sunseed' },
    { value: 129, label: 'Rapeseed' },
    { value: 48, label: 'DDGS' },
    { value: 154, label: 'Soybean Meal' },
    { value: 155, label: 'Soybean Meal Pellet' },
    { value: 134, label: 'Rapeseed Meal' },
    { value: 107, label: 'Palm Oil' },
    { value: 109, label: 'Palm Olein' },
    { value: 157, label: 'Soybean Oil' },
    { value: 176, label: 'Sunseed Oil' },
    { value: 112, label: 'Peas' },
  ];

  const StyledIcon = styled.span.withConfig({
    displayName: 'StyledIcon',
  })`
      position: relative;
      margin-left: 2px;
      top: 1px;`;

  const rawCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'RUB', 'BRL', 'ZAR',
    'KRW', 'IDR', 'ARS', 'UAH', 'HUF', 'TRY', 'EGP', 'JPY', 'CNY', 'INR', 'MYR'];
  const currencies = [
    {
      value: undefined,
      label: 'Market Standard',
    },
    ...rawCurrencies
      .map(c => ({ value: c, label: c })),
  ];

  const [currentCommodityId, setCurrentCommodityId] = useState(null);
  const commodityStyles = {
    container: (base, state) => ({
      ...base,
      display: 'inline-block',
      width: '150px',
    }),
  };

  const currencyStyles = {
    container: (base, state) => ({
      ...base,
      display: 'inline-block',
      width: '200px',
    }),
  };


  const Title = styled.h3.withConfig({
    displayName: 'Title',
  })`
    display: inline-block;
    margin-bottom: 15px;
    margin-right: 10px;
  `;

  const HtmlTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: '#1d2740',
      fontSize: '14px',
      paddingTop: '15px',
    },
  }))(Tooltip);

  return (
    <Container className="priceDiscovery" id="priceDiscoveryContainer" style={{ paddingRight: 0 }}>
      <Row>
        <Col md={12}>
          <Title className="page-title">Price Discovery</Title>
          <Select
            defaultValue={commodities[0]}
            isSearchable
            name="commodity"
            options={commodities}
            onChange={(payload) => {
              // setCurrentCommodityId(null);
              setCurrentCommodityId(payload && payload.value);
            }}
            styles={commodityStyles}
            className="react-select"
            classNamePrefix="react-select"
          />
          {
            currentCommodityId && (
              <>
                <Select
                  defaultValue={currencies[0]}
                  isSearchable
                  name="currency"
                  options={currencies}
                  onChange={payload => setCurrentCurrency(payload && payload.value)}
                  styles={currencyStyles}
                  className="react-select"
                  classNamePrefix="react-select"
                />
                <HtmlTooltip title={<div>Currency selection only applies to individual records</div>}>
                  <StyledIcon className="sidebar__link-icon icon icon-info" />
                </HtmlTooltip>
              </>
            )
          }
        </Col>
      </Row>
      { currentCommodityId ? (
        <OneCommodityTable commodityId={currentCommodityId} currency={currentCurrency} />
      ) : (
        <ManyCommodityTable />
      )}


    </Container>
  );
};

export default PriceDiscovery;
