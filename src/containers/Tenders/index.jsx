import React, { useState, useEffect, useRef } from 'react';
import {
  Col, Container, Row, Card, CardBody,
} from 'reactstrap';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import Popover from '@material-ui/core/Popover';
import { useFetch } from 'react-async';
import moment from 'moment';
import numeral from 'numeral';
import get from 'lodash/get';
import styled from 'styled-components';
import TendersFilter from './components/TendersFilter';
import YoYExportsChart from './components/YoYExportsChart';
import PopupTable from './components/PopupTable';
import { rpcTendersPriceDiscovery } from '../../lib/api';
import CustomLoadingOverlay from './components/CustomLoadingOverlay';
import YoYHeaderComponent from './components/YoYHeaderComponent';
import PriceVolume from './components/PriceVolume';
import UnitCell from './components/Unit';

const Tenders = () => {
  const [columnDefs, setColumnDefs] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  // DEFAULT: 6 months > current month > 5 months
  const genDefaultMonthArray = () => {
    const res = [];
    const currentLoopMonth = moment().subtract(6, 'months');

    let i = 0;
    while (i < 12) {
      res.push(currentLoopMonth.format('YYYY-MM'));
      currentLoopMonth.add(1, 'month');
      i += 1;
    }
    return res;
  };

  // When YEAR is specified, this is the months we want to display
  // If year is not empty the columns are the months of that year from Jan-Dec
  const genYearMonthArray = (year) => {
    const res = [];
    let i = 0;
    while (i < 12) {
      res.push(moment(year, 'YYYY').month(i).format('YYYY-MM'));
      i += 1;
    }
    return res;
  };

  const genColumnDefs = (monthArray) => {
    const headBaseColumnDefs = [
      {
        headerName: 'Destination',
        field: 'country_name',
        headerClass: 'header-destination',
        cellClass: 'cell-destination',
        minWidth: 110,
      },
      {
        headerName: 'Unit',
        // field: '',
        cellRenderer: 'UnitCellRenderer',
        headerClass: 'header-unit',
        cellClass: 'cell-unit',
      },
    ];

    const numberFormatter = (params) => {
      if (!params.value) {
        return '-';
      }
      return numeral(params.value).format('0,0');
    };

    const tailBaseColumnDefs = [
      {
        field: 'raising',
        headerClass: 'header-h-chart',
        cellClass: 'cell-h-chart',
        width: 280,
        suppressSizeToFit: true,
        headerComponent: 'YoYHeaderComponent',
        headerComponentParams: { monthArray },
        cellRenderer: 'yoyExportsChartRenderer',
      },
    ];

    const pricesColDefs = monthArray.map(m => ({
      headerName: moment(m, 'YYYY-MM').format('MM/YY'),
      field: m,
      cellRenderer: 'priceVolumeRenderer',
      headerClass: 'header-price-volume',
      cellClass: moment().isSame(moment(m), 'month')
        ? ['cell-price-volume', 'cell-current-month']
        : 'cell-price-volume',
    }));

    return [
      ...headBaseColumnDefs,
      ...pricesColDefs,
      ...tailBaseColumnDefs,
    ];
  };


  const [searchedCommodityId, setSearchedCommodityId] = useState(null);
  const [searchedOriginCountryId, setSearchedOriginCountryId] = useState(null);
  const [searchedYear, setSearchedYear] = useState(null);

  const parseData = (data) => {
    const parsedData = data.map((d) => {
      const cleanData = { ...d };
      Object.entries(d.dataset).forEach((p) => {
        const formattedDate = moment(p[0]).format('YYYY-MM');
        const price = p[1];
        cleanData[formattedDate] = price;
      });
      return ({
        ...cleanData,
      });
    });
    return parsedData;
  };


  const [tenderList, setTenderList] = useState(null);
  const { url: tPDUrl, meta: tPDMeta } = rpcTendersPriceDiscovery;

  const {
    data: tenderData,
    error: tenderError,
    isPending: tenderIsPending,
    run: tenderRun,
  } = useFetch(tPDUrl, tPDMeta, {
    defer: true,
  });

  useEffect(() => {
    if (tenderData) {
      let monthsArray = [];
      if (searchedYear) {
        monthsArray = genYearMonthArray(searchedYear);
      } else {
        monthsArray = genDefaultMonthArray();
      }
      setColumnDefs(genColumnDefs(monthsArray));

      const parsed = parseData(tenderData);
      setTenderList(parsed);
      gridApi.hideOverlay();
      setTimeout(() => {
        gridApi.sizeColumnsToFit();
      }, 0);
    }
  }, [tenderData]);

  useEffect(() => {
    tenderRun({
      body: JSON.stringify({
        param_import_country_id: null, // importCountryId,
        param_origin_country_id: null, // originCountryId,
        param_commodity_id: null, // commodityId,
        param_seller: null, // seller,
        param_buyer: null, // buyer,
        param_year: null, // year,
      }),
    });
  }, []);

  const suppressContextMenu = true;

  const rowClassRules = {
    'row-bg-color1': (params) => {
      if (params.rowIndex % 2 === 0) {
        return true;
      }
      return false;
    },
    'row-bg-color2': (params) => {
      if (params.rowIndex % 2 !== 0) {
        return true;
      }
      return false;
    },
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      });
    });
  };

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTablePayload, setPopupTablePayload] = useState(null);
  const onCellClicked = (payload) => {
    if (payload.column.colId === 'country_name' || payload.column.colId === 'raising') {
      return;
    }
    setPopupTablePayload({
      shipmentMonth: moment(payload.column.colId).format('YYYY-MM-DD'),
      originCountryId: payload.data.country_id,
      originCountryName: payload.data.country_name,
    });
    setPopupOpen(true);
  };


  const [popupId, setPopupId] = useState(undefined);
  const handleClosePopup = () => {
    setPopupOpen(false);
    setPopupId(undefined);
    setTimeout(() => {
      // This gives time for the popup to disappear before title data is reset
      setPopupTablePayload(null);
    }, 100);
  };

  const style = {
    width: '100%',
    height: 'calc(100vh - 290px)',
  };

  const frameworkComponents = {
    yoyExportsChartRenderer: YoYExportsChart,
    YoYHeaderComponent,
    customLoadingOverlay: CustomLoadingOverlay,
    priceVolumeRenderer: PriceVolume,
    UnitCellRenderer: UnitCell,
  };

  const defaultColDef = {
    // width: 80,
  };


  const search = (params) => {
    console.log(params);
    const originCountryId = get(params, 'origin.value', null);
    const commodityId = get(params, 'commodity.value', null);
    const year = get(params, 'year.value', null);
    gridApi.showLoadingOverlay();

    tenderRun({
      body: JSON.stringify({
        param_commodity_id: commodityId,
        param_origin_country_id: originCountryId,
        param_year: year,
        param_seller: null,
        param_buyer: null,
        param_import_country_id: null,
      }),
    });
    setSearchedCommodityId(commodityId);
    setSearchedOriginCountryId(originCountryId);
    setSearchedYear(year);
  };


  const popupOriginEl = useRef(null);
  return (
    <Container className="tenders">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Tenders</h3>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="filter-container">
          <Card>
            <CardBody>
              <TendersFilter onSubmit={search} />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="grid-container" style={style} ref={popupOriginEl}>
            <AgGridReact
              headerHeight={60}
              defaultColDef={defaultColDef}
              columnDefs={columnDefs}
              rowData={tenderList}
              rowClassRules={rowClassRules}
              loadingOverlayComponent="customLoadingOverlay"
              frameworkComponents={frameworkComponents}
              rowHeight={80}
              suppressContextMenu={suppressContextMenu}
              onGridReady={onGridReady}
              onCellClicked={onCellClicked}
            />
          </div>
        </Col>
      </Row>
      <Popover
        id={popupId}
        open={popupOpen}
        anchorEl={popupOriginEl.current}
        onClose={handleClosePopup}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        style={{ overflow: 'scroll' }}
      >
        <PopupTable
          onClose={handleClosePopup}
          requestPayload={popupTablePayload}
        />
      </Popover>
    </Container>
  );
};

export default Tenders;
