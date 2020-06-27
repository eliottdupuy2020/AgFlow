import React, { useState, useEffect } from 'react';
import {
  Col, Container, Row, Card, CardBody,
} from 'reactstrap';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import moment from 'moment';
import { useFetch } from 'react-async';
import get from 'lodash/get';
import remove from 'lodash/remove';
import numeral from 'numeral';
import FreightFilter from './components/FreightFilter';
import HistoricalChart from './components/HistoricalChart';
import DestinationCell from './components/DestinationCell';
import LoadingCell from './components/LoadingCell';
import CustomLoadingOverlay from './components/CustomLoadingOverlay';
import { latestFreightsPriceDiscovery, rpcFreightPriceDiscovery, rpcFreightPriceDiscoveryDetails } from '../../lib/api';

const Freight = () => {
  const [autoOpenNode, setAutoOpenNode] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [filterExportCountryId, setFilterExportCountryId] = useState(null);

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

  const genCorrectMonthArray = () => {
    const res = [];
    let i = 0;
    while (i < 6) {
      res.push(moment().add(i, 'month').format('YYYY-MM'));
      i += 1;
    }
    return res;
  };
  const correctMonthsArray = genCorrectMonthArray();

  const genColumnDefs = () => {
    const headBaseColumnDefs = [
      {
        headerName: 'Origin',
        cellRenderer: 'LoadingPortCellRenderer',
        field: 'export_country_name',
        headerClass: 'header-loading-port',
        // cellClass: 'cell-loading-port',
        width: 200,
        suppressSizeToFit: true,
      },
    ];

    const numberFormatter = params => numeral(params.value).format('0,0');

    const tailBaseColumnDefs = [{
      headerName: 'Vessel size',
      field: 'volume',
      headerClass: 'header-volume',
      cellClass: 'cell-volume',
      valueFormatter: numberFormatter,
    }, {
      headerName: 'Update date',
      field: 'valid_on',
      headerClass: 'header-update-date',
      cellClass: 'cell-update-date',
    }, {
      headerName: 'Last 6 months spot price',
      field: '',
      headerClass: 'header-h-chart',
      cellClass: 'cell-h-chart',
      width: 180,
      suppressSizeToFit: true,
      cellRenderer: 'historicalChartRenderer',
    },
    ];

    const pricesColDefs = correctMonthsArray.map(m => ({
      headerName: moment(m).format('MM/YY'),
      field: m,
      headerClass: 'header-price',
      // cellClass: moment().isSame(moment(m), 'month') ? ['cell-price', 'cell-current-month'] : 'cell-price',
      cellClass: 'cell-price',
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

  const style = {
    width: '100%',
    height: 'calc(100vh - 290px)',
  };

  const frameworkComponents = {
    historicalChartRenderer: HistoricalChart,
    DestinationCellRenderer: DestinationCell,
    customLoadingOverlay: CustomLoadingOverlay,
    LoadingPortCellRenderer: LoadingCell,
  };

  const parseData = (data) => {
    const parsedData = data.map((d) => {
      const cleanData = { ...d };
      Object.entries(d.prices).forEach((p) => {
        const formattedDate = moment(p[0]).format('YYYY-MM');
        const price = p[1];
        if (correctMonthsArray.includes(formattedDate)) {
          cleanData[formattedDate] = price;
        }
      });
      return ({
        ...cleanData,
      });
    });
    return parsedData;
  };


  const [reqParentData, setReqParentData] = useState(null);
  const { url: fPDDUrl, meta: fPDDMeta } = rpcFreightPriceDiscoveryDetails;
  const {
    run: fetchChildren,
    data: childData,
  } = useFetch(fPDDUrl, fPDDMeta, {
    defer: true,
  });

  useEffect(() => {
    if (childData) {
      const parsedData = parseData(childData);
      if (reqParentData) {
        remove(parsedData, o => (o.export_id === reqParentData.exportId && o.import_id === reqParentData.importId));
      }
      gridApi.updateRowData({ add: parsedData });
      gridApi.hideOverlay();
      setReqParentData(null);
    }
  }, [childData]);

  const [freightList, setFreightList] = useState(null);
  const { url: rpcFPDUrl, meta: rpcFPDMeta } = rpcFreightPriceDiscovery;
  const { run: runRpcFPD } = useFetch(rpcFPDUrl, rpcFPDMeta, {
    onResolve: (data) => {
      const parsed = parseData(data);
      const markAsRoot = genericData => genericData.map(d => ({ ...d, isRoot: true }));
      const addFakeId = genericData => genericData.map((d, idx) => ({ ...d, id: idx })); // FIXME: Is it working?
      setFreightList(addFakeId(markAsRoot(parsed)));
      gridApi.hideOverlay();
    },
    defer: true,
  });

  useEffect(() => {
    runRpcFPD({
      body: JSON.stringify({
        import_country_id: null,
        export_country_id: null,
        volume: null,
      }),
    });
  }, []);

  const search = (params) => {
    const exportId = get(params, 'export_country.value', null);
    const importId = get(params, 'import_country.value', null);
    const volume = get(params, 'vessel_volume.value', null);
    gridApi.showLoadingOverlay();

    setFilterExportCountryId(exportId);
    runRpcFPD({
      body: JSON.stringify({
        import_country_id: importId,
        export_country_id: exportId,
        volume,
      }),
    });
  };

  return (
    <Container className="freight">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Freight</h3>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="filter-container">
          <Card>
            <CardBody>
              <FreightFilter onSubmit={search} />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="grid-container" style={style}>
            <AgGridReact
              headerHeight={60}
              defaultColDef={defaultColDef}
              columnDefs={columnDefs}
              rowData={freightList}
              rowClassRules={rowClassRules}
              frameworkComponents={frameworkComponents}
              loadingOverlayComponent="customLoadingOverlay"
              rowHeight={80}
              suppressContextMenu
              onGridReady={onGridReady}
              treeData
              autoGroupColumnDef={{
                headerName: 'Destination',
                width: 200,
                cellRenderer: 'DestinationCellRenderer',
                suppressSizeToFit: true,
              }}
              getDataPath={(data) => {
                if (data.isRoot) {
                  return [data.import_country_name];
                }
                return [
                  data.import_country_name,
                  `${data.export_country_name}-${data.export_id}-${data.import_id}-${JSON.stringify(data.prices)}`];
              }}
              onCellClicked={(payload) => {
                if (payload && payload.colDef && payload.colDef.headerName
                    && payload.colDef.headerName === 'Destination') {
                  if (payload.node.allChildrenCount > 0) {
                    return;
                  }
                  setReqParentData({ exportId: payload.data.export_id, importId: payload.data.import_id });
                  gridApi.showLoadingOverlay();
                  fetchChildren({
                    body: JSON.stringify({
                      import_country_id: get(payload, 'data.import_country_id', null),
                      volume: get(payload, 'data.volume'),
                      export_country_id: filterExportCountryId,
                    }),
                  });
                }
              }}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Freight;
