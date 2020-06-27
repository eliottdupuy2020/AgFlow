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
import TradeflowsFilter from './components/TradeflowsFilter';
import YoYExportsChart from './components/YoYExportsChart';
import PopupTable from './components/PopupTable';
import { rpcTradeflowsVolumeDiscovery, latestFreightsPriceDiscovery } from '../../lib/api';
import CustomLoadingOverlay from './components/CustomLoadingOverlay';
import YoYHeaderComponent from './components/YoYHeaderComponent';


const Tradeflows = () => {
  const [columnDefs, setColumnDefs] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);


  // When YEAR is not specified, this is the months we want to display
  //   If year is empty, we have 1 next months + this month + 10 last months
  // 10 last months > this month > 1 next months
  const genDefaultMonthArray = () => {
    const res = [];
    const currentLoopMonth = moment().subtract(10, 'months');

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
        headerClass: 'header-kmt',
        cellClass: 'cell-kmt',
        minWidth: 110,
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
      valueFormatter: numberFormatter,
      headerClass: 'header-price',
      cellClass: moment().isSame(moment(m), 'month') ? ['cell-price', 'cell-current-month'] : 'cell-price',
      // cellClass: 'cell-price',
    }));

    return [
      ...headBaseColumnDefs,
      ...pricesColDefs,
      ...tailBaseColumnDefs,
    ];
  };


  const [searchedCommoditySubGroupId, setSearchedCommoditySubGroupId] = useState(null);
  const [searchedExportCountryId, setSearchedExportCountryId] = useState(null);
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


  const [tradeflowList, setTradeflowList] = useState(null);
  const { url: tVDUrl, meta: tVDMeta } = rpcTradeflowsVolumeDiscovery;

  const {
    data: tradeflowData,
    error: tradeflowError,
    isPending: tradeflowIsPending,
    run: tradeflowRun,
  } = useFetch(tVDUrl, tVDMeta, {
    defer: true,
  });

  useEffect(() => {
    if (tradeflowData) {
      let monthsArray = [];
      if (searchedYear) {
        monthsArray = genYearMonthArray(searchedYear);
      } else {
        monthsArray = genDefaultMonthArray();
      }
      setColumnDefs(genColumnDefs(monthsArray));

      const parsed = parseData(tradeflowData);
      setTradeflowList(parsed);
      gridApi.hideOverlay();
      setTimeout(() => {
        gridApi.sizeColumnsToFit();
      }, 0);
    }
  }, [tradeflowData]);

  useEffect(() => {
    tradeflowRun({
      body: JSON.stringify({
        param_commodity_subgroup_id: null,
        param_export_country_id: null,
        param_import_country_id: null,
        param_year: null,
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
      importCountryId: payload.data.country_id,
      importCountryName: payload.data.country_name,

      commoditySubGroupId: searchedCommoditySubGroupId,
      exportCountryId: searchedExportCountryId,
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
  };

  const defaultColDef = {
    // width: 80,
  };


  const search = (params) => {
    const exportId = get(params, 'export_country.value', null);
    const importId = get(params, 'import_country.value', null);
    const commodityId = get(params, 'commodity_subgroup.value', null);
    const year = get(params, 'year.value', null);
    gridApi.showLoadingOverlay();
    tradeflowRun({
      body: JSON.stringify({
        param_commodity_subgroup_id: commodityId,
        param_export_country_id: exportId,
        param_import_country_id: importId,
        param_year: year,
      }),
    });
    setSearchedCommoditySubGroupId(commodityId);
    setSearchedExportCountryId(exportId);
    setSearchedYear(year);
  };


  const popupOriginEl = useRef(null);
  return (
    <Container className="tradeflows">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Tradeflows</h3>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="filter-container">
          <Card>
            <CardBody>
              <TradeflowsFilter onSubmit={search} />
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
              rowData={tradeflowList}
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

export default Tradeflows;
