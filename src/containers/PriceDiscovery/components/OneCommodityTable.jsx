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
import OriginCell from './OriginCell';
import GraphCell from './GraphCell';
import CustomLoadingOverlay from './CustomLoadingOverlay';
import {
  quotesPriceDiscoverySummary,
  rpcQuotesPriceDiscoveryLevelTwo,
  rpcQuotesPriceDiscoveryLevelThree,
} from '../../../lib/api';
import PriceDiscoveryFilter from './PriceDiscoveryFilter';
import SpecsContributorCell from './SpecsContributorCell';

const OneCommodityTable = (props) => {
  const [autoOpenNode, setAutoOpenNode] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [filterExportCountryId, setFilterExportCountryId] = useState(null);
  const [colDefs, setColDefs] = useState([]);
  const [correctMonthsArray, setCorrectMonthsArrayState] = useState([]);

  useEffect(() => {
    if (colDefs && gridApi) {
      gridApi.setColumnDefs(colDefs);
    }
  }, [colDefs]);

  const onGridReady = (params) => {
    params.api.showLoadingOverlay();
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
      // {
      //   headerName: 'Contributor',
      //   headerClass: 'header-contributor',
      //   cellClass: 'cell-contributor',
      //   suppressSizeToFit: true,
      //   width: 100,
      //   valueFormatter: param => get(param, 'data.contributor', '-'),
      // },
      {
        headerName: 'Specs',
        headerClass: 'header-specs',
        cellClass: 'cell-specs',
        // field: 'specs',
        suppressSizeToFit: true,
        width: 180,
        cellRenderer: 'SpecsContributorRenderer',
      },
      {
        headerName: '',
        cellRenderer: 'GraphRenderer',
        cellClass: 'cell-graph-renderer',
        suppressSizeToFit: true,
        width: 60,
      },
      // {
      //   headerName: 'Export',
      //   headerClass: 'header-loading-port',
      //   cellClass: 'cell-loading-port',
      //   cellRenderer: 'OriginCellRenderer',
      //   suppressSizeToFit: true,
      //   width: 120,
      // },
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
    // CommodityCellRenderer: CommodityCell,
    customLoadingOverlay: CustomLoadingOverlay,
    OriginCellRenderer: OriginCell,
    GraphRenderer: GraphCell,
    SpecsContributorRenderer: SpecsContributorCell,
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

  // const [priceDiscoverySummary, setPriceDiscoverySummary] = useState(null);
  // const { url: quotesPriceDiscoverySummaryUrl, meta: quotesPriceDiscoverySummaryMeta } = quotesPriceDiscoverySummary;
  // const {
  //   data: rawPriceDiscoveryList, error: freightError, isPending: freightIsPending, run: freightRun,
  // } = useFetch(quotesPriceDiscoverySummaryUrl, quotesPriceDiscoverySummaryMeta, {
  //   onResolve: (data) => {
  //     let maxDate = moment();
  //     data.forEach((d) => {
  //       const { prices } = d;
  //       Object.entries(prices).forEach((o) => {
  //         const currDate = moment(o[0], 'YYYY-MM-DD');
  //         if (currDate.isAfter(maxDate)) {
  //           maxDate = currDate;
  //         }
  //       });
  //     });
  //     // eslint-disable-next-line
  //       const correctMonthsArray = genCorrectMonthArray(maxDate);
  //     setCorrectMonthsArrayState(correctMonthsArray);
  //     setColDefs(genColumnDefs(correctMonthsArray));
  //     const parsed = parseData(data);

  //     setPriceDiscoverySummary(markAsLevel(parsed, 0));
  //   },
  // });

  const [parentUniqueKey, setParentUniqueKey] = useState(null);
  const [reqParentData, setReqParentData] = useState(null);
  const { url: rQPDL2Url, meta: rQPDL2Meta } = rpcQuotesPriceDiscoveryLevelTwo;
  const {
    run: fetchLevelTwo,
    data,
  } = useFetch(rQPDL2Url, rQPDL2Meta);
  useEffect(() => {
    if (data) {
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
      let parsedData = parseData(data);
      parsedData = markAsLevel(parsedData, 0);
      gridApi.setRowData(parsedData);
      gridApi.hideOverlay();
      setReqParentData(null);
    }
  }, [data]);

  const { commodityId, currency } = props;
  useEffect(() => {
    if (gridApi) {
      gridApi.showLoadingOverlay();
    }
    const payload = {
      req_commodity_id: commodityId,
      opt_import_country_id: null,
      opt_export_country_id: null,
      opt_incoterm_code: null,
      opt_contributor_id: null,
      opt_container: null,
    };
    fetchLevelTwo({
      body: JSON.stringify(payload),
    });
  }, [commodityId, currency]);

  const [rowToExpand, setRowToExpand] = useState(null);
  const { url: rQPDL3Url, meta: rQPDL3Meta } = rpcQuotesPriceDiscoveryLevelThree;
  const {
    run: fetchLevelThree,
    data: levelThreeData,
  } = useFetch(rQPDL3Url, rQPDL3Meta, {
    defer: true,
  });
  useEffect(() => {
    if (levelThreeData) {
      let parsedData = parseData(levelThreeData);
      parsedData = addParentKey(parsedData, parentUniqueKey);
      parsedData = markAsLevel(parsedData, 1);
      gridApi.updateRowData({ add: parsedData });
      gridApi.hideOverlay();
      const row = gridApi.getRowNode(rowToExpand);
      gridApi.setRowNodeExpanded(row, true);
      setRowToExpand(null);
      setParentUniqueKey(null);
    }
  }, [levelThreeData]);

  const rawCommodities = [
    'Wheat',
    'Corn',
    'Barley',
    'Soybean',
    'Sunseed',
    'Rapeseed',
    'DDGS',
    'Soybean Meal',
    'Soybean Meal Pellet',
    'Rapeseed Meal',
    'Palm Oil',
    'Palm Olein',
    'Soybean Oil',
    'Sunseed Oil',
    'Peas',
  ];
  const commodities = [
    {
      value: null,
      label: 'Any',
    },
    ...rawCommodities
      .map(c => ({ value: c, label: c })),
  ];

  // const { url: fPDDUrl, meta: fPDDMeta } = rpcPriceDiscoveryPriceDiscoveryDetails;
  // const {
  //   run: fetchChildren,
  //   data: childData,
  // } = useFetch(fPDDUrl, fPDDMeta, {
  //   defer: true,
  // });

  // useEffect(() => {
  //   if (childData) {
  //     const parsedData = parseData(childData);
  //     if (reqParentData) {
  //       remove(parsedData, o => (o.export_id === reqParentData.exportId && o.import_id === reqParentData.importId));
  //     }
  //     gridApi.updateRowData({ add: parsedData });
  //     gridApi.hideOverlay();
  //     setReqParentData(null);
  //   }
  // }, [childData]);


  // const { url: rpcFPDUrl, meta: rpcFPDMeta } = rpcPriceDiscoveryPriceDiscovery;
  // const { run: runRpcFPD } = useFetch(rpcFPDUrl, rpcFPDMeta, {
  //   onResolve: (data) => {
  //     const parsed = parseData(data);
  //     const markAsRoot = genericData => genericData.map(d => ({ ...d, isRoot: true }));
  //     const addFakeId = genericData => genericData.map((d, idx) => ({ ...d, id: idx })); // FIXME: Is it working?
  //     setPriceDiscoveryList(addFakeId(markAsRoot(parsed)));
  //     gridApi.hideOverlay();
  //   },
  //   defer: true,
  // });

  const search = (params) => {
    const incoterm = get(params, 'incoterm.value', null);
    const importCountry = get(params, 'import_country.value', null);
    const exportCountry = get(params, 'export_country.value', null);
    const containerType = get(params, 'container_type.value', null);

    const payload = {
      req_commodity_id: commodityId,
      opt_import_country_id: importCountry,
      opt_export_country_id: exportCountry,
      opt_incoterm_code: incoterm,
      opt_contributor_id: null,
      opt_container: containerType,
    };
    gridApi.showLoadingOverlay();
    fetchLevelTwo({
      body: JSON.stringify(payload),
    });

    // console.log('Search w/', incoterm, averageOn);
    // const importId = get(params, 'import_country.value', null);
    // const volume = get(params, 'vessel_volume.value', null);
    // gridApi.showLoadingOverlay();

    // setFilterExportCountryId(exportId);
    // runRpcFPD({
    //   body: JSON.stringify({
    //     import_country_id: importId,
    //     export_country_id: exportId,
    //     volume,
    //   }),
    // });
  };

  return (
    <>
      <Row>
        <Col md={12} className="filter-container">
          <Card>
            <CardBody>
              <PriceDiscoveryFilter onSubmit={search} />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="grid-container" style={style}>
            <AgGridReact
              headerHeight={80}
              defaultColDef={defaultColDef}
              columnDefs={columnDefs}
              // rowData={priceDiscoverySummary}
              rowData={[]}
              rowClassRules={rowClassRules}
              frameworkComponents={frameworkComponents}
              loadingOverlayComponent="customLoadingOverlay"
              rowHeight={50}
              suppressContextMenu
              onGridReady={onGridReady}
              treeData
              autoGroupColumnDef={{
                headerName: 'Export',
                width: 150,
                cellRenderer: 'OriginCellRenderer',
                suppressSizeToFit: true,
              }}
              getDataPath={(localData) => {
                const uniqueDataKey = JSON.stringify(localData);
                if (localData.level === 0) {
                  return [uniqueDataKey];
                }
                return [localData.parent, uniqueDataKey];
              }}
              onCellClicked={(payload) => {
                if (payload && payload.colDef && payload.colDef.headerName
                                    && payload.colDef.headerName === 'Export') {
                  if (payload.node.allChildrenCount > 0) {
                    // If data has already been loaded, do not load it again
                    return;
                  }
                  if (payload.node.level !== 0) {
                    return;
                  }
                  setParentUniqueKey(JSON.stringify(payload.data));
                  gridApi.showLoadingOverlay();
                  setRowToExpand(payload.node.id);
                  fetchLevelThree({
                    body: JSON.stringify({
                      req_commodity_id: get(payload, 'data.commodity_id'),
                      req_export_id: get(payload, 'data.export_id'),
                      req_import_country_id: get(payload, 'data.import_country_id'),
                      req_incoterm: get(payload, 'data.incoterm_code'),
                      req_specs: get(payload, 'data.specs'),
                      opt_currency: currency,
                    }),
                  });
                }
              }}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default OneCommodityTable;
