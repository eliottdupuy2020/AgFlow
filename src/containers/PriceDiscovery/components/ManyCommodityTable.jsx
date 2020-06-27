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
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CommodityCell from './CommodityCell';
import GraphCell from './GraphCell';
import CustomLoadingOverlay from './CustomLoadingOverlay';
import {
  quotesPriceDiscoverySummary,
  rpcQuotesPriceDiscoveryLevelTwo,
  rpcQuotesPriceDiscoveryLevelThree,
} from '../../../lib/api';
import PriceDiscoveryFilter from './PriceDiscoveryFilter';

const ManyCommodityTable = () => {
  const [autoOpenNode, setAutoOpenNode] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [filterExportCountryId, setFilterExportCountryId] = useState(null);
  const [colDefs, setColDefs] = useState([]);
  const [correctMonthsArray, setCorrectMonthsArrayState] = useState([]);
  const [currentCurrency, setCurrentCurrency] = useState(null);

  useEffect(() => {
    if (colDefs && gridApi) {
      gridApi.setColumnDefs(colDefs);
    }
  }, [colDefs]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    const gridColumnApi = params.columnApi;

    params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      });
    });
  };
  const defaultColDef = {};

  const genCorrectMonthArray = (maxDate) => {
    const res = [];
    if (!maxDate) {
      return res;
    }
    let currentIterationMonth = moment();
    while (currentIterationMonth.isSameOrBefore(maxDate, 'month')) {
      res.push(currentIterationMonth.format('YYYY-MM'));
      currentIterationMonth = currentIterationMonth.add(1, 'month');
    }
    return res;
  };

  // eslint-disable-next-line
    const genColumnDefs = (correctMonthsArray) => {
    if (!correctMonthsArray) {
      // eslint-disable-next-line
      correctMonthsArray = [];
    }
    const headBaseColumnDefs = [
      {
        headerName: 'Commodity',
        width: 150,
        field: 'commodity',
        // cellRenderer: 'CommodityCellRenderer',
        suppressSizeToFit: true,
        headerClass: 'header-commodity',
        cellClass: 'cell-commodity',
      },
      {
        headerName: '',
        cellRenderer: 'GraphRenderer',
        cellClass: 'cell-graph-renderer',
        suppressSizeToFit: true,
        width: 60,
      },
      {
        headerName: 'Export',
        headerClass: 'header-export',
        cellClass: 'cell-export',
        field: 'export_country_name',
        // cellClass: 'cell-export',
        // cellRenderer: 'OriginCellRenderer',
        suppressSizeToFit: true,
        width: 120,
      },
      {
        headerName: 'Incoterm',
        field: 'incoterm_code',
        headerClass: 'header-incoterm',
        cellClass: 'cell-incoterm',
        suppressSizeToFit: true,
        width: 70,
      },
      {
        headerName: 'Destination',
        field: 'import_country_name',
        headerClass: 'header-destination',
        cellClass: 'cell-destination',
        width: 120,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Update date',
        field: 'valid_on',
        headerClass: 'header-update-date',
        cellClass: 'cell-update-date',
        valueFormatter: date => moment(date.value, 'YYYY-MM-DD').format('YY-MM-DD'),
        suppressSizeToFit: true,
        width: 100,
      },
      {
        headerName: 'Kind',
        field: 'kind',
        headerClass: 'header-kind',
        cellClass: 'cell-kind',
        suppressSizeToFit: true,
        valueFormatter: (param) => {
          switch (param.value) {
            case 's':
              return 'Seller';
            case 'b':
              return 'Buyer';
            case 'n':
              return 'Nominal';
            case 't':
              return 'Traded';
            default:
              return '-';
          }
        },
        width: 100,
      },
      {
        headerName: 'Unit',
        headerClass: 'header-unit',
        cellClass: 'cell-unit',
        width: 100,
        valueFormatter: param => `${get(param, 'data.currency', '')} ${get(param, 'data.weight_unit', '')}`,
      },
    ];

    const numberFormatter = params => numeral(params.value).format('0,0');

    const tailBaseColumnDefs = [
    ];

    const pricesColDefs = correctMonthsArray.map(m => ({
      headerName: moment(m).format('MM/YY'),
      field: m,
      headerClass: 'header-price',
      // cellClass: moment().isSame(moment(m), 'month') ? ['cell-price', 'cell-current-month'] : 'cell-price',
      cellClass: 'cell-price',
      suppressSizeToFit: true,
      width: 80,

    }));

    return [
      ...headBaseColumnDefs,
      ...pricesColDefs,
      ...tailBaseColumnDefs,
    ];
  };

  const columnDefs = genColumnDefs();

  const rowClassRules = {
    'row-bg-color1': (params) => {
      if (params.rowIndex % 2 === 0 && params.node.parent.id === 'ROOT_NODE_ID') {
        return true;
      }
      return false;
    },
    'row-bg-color1__level2': (params) => {
      if (params.rowIndex % 2 === 0 && params.node.parent.id !== 'ROOT_NODE_ID') {
        return true;
      }
      return false;
    },
    'row-bg-color2': (params) => {
      if (params.rowIndex % 2 !== 0 && params.node.parent.id === 'ROOT_NODE_ID') {
        return true;
      }
      return false;
    },
    'row-bg-color2__level2': (params) => {
      if (params.rowIndex % 2 !== 0 && params.node.parent.id !== 'ROOT_NODE_ID') {
        return true;
      }
      return false;
    },
  };

  const style = {
    width: '100%',
    height: '100vh',
    // This is the filter size
    // height: 'calc(100vh - 290px)',
  };

  const frameworkComponents = {
    CommodityCellRenderer: CommodityCell,
    customLoadingOverlay: CustomLoadingOverlay,
    // OriginCellRenderer: OriginCell,
    GraphRenderer: GraphCell,
  };

  // eslint-disable-next-line
      const parseData = (data) => {
    const parsedData = data.map((d) => {
      const cleanData = { ...d };
      Object.entries(d.prices).forEach((p) => {
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

  const addParentKey = (data, key) => data.map(d => ({ ...d, parent: key }));
  const markAsLevel = (data, level) => data.map(d => ({ ...d, level }));

  const [priceDiscoverySummary, setPriceDiscoverySummary] = useState(null);
  const { url: quotesPriceDiscoverySummaryUrl, meta: quotesPriceDiscoverySummaryMeta } = quotesPriceDiscoverySummary;
  const {
    data: rawPriceDiscoveryList, error: freightError, isPending: freightIsPending, run: freightRun,
  } = useFetch(quotesPriceDiscoverySummaryUrl, quotesPriceDiscoverySummaryMeta, {
    onResolve: (data) => {
      let maxDate = moment();
      data.forEach((d) => {
        const { prices } = d;
        Object.entries(prices).forEach((o) => {
          const currDate = moment(o[0], 'YYYY-MM-DD');
          if (currDate.isAfter(maxDate)) {
            maxDate = currDate;
          }
        });
      });
      // eslint-disable-next-line
      const correctMonthsArray = genCorrectMonthArray(maxDate);
      setCorrectMonthsArrayState(correctMonthsArray);
      setColDefs(genColumnDefs(correctMonthsArray));
      const parsed = parseData(data);

      setPriceDiscoverySummary(markAsLevel(parsed, 0));
    },
  });

  return (
    <Row>
      <Col md={12}>
        <div className="grid-container" style={style}>
          <AgGridReact
            headerHeight={80}
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
            rowData={priceDiscoverySummary}
            rowClassRules={rowClassRules}
            frameworkComponents={frameworkComponents}
            loadingOverlayComponent="customLoadingOverlay"
            rowHeight={50}
            suppressContextMenu
            onGridReady={onGridReady}
          />
        </div>
      </Col>
    </Row>
  );
};

export default ManyCommodityTable;
