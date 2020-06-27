import React from 'react';
import {
  Col, Container, Row,
} from 'reactstrap';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import ReportInfo from './components/ReportInfo';
import demoData from './demoData';

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.onGridReady = this.onGridReady.bind(this);
    this.state = {
      defaultColDef: {
        // width: 80,
      },
      columnDefs: [
        {
          headerName: 'Report Info',
          field: 'info',
          cellRenderer: 'renderInfo',
        },
      ],
      rowData: demoData,
      rowClassRules: {
        'row-bg-color2': (params) => {
          if (params.rowIndex % 2 === 0) {
            return true;
          }
          return false;
        },
        'row-bg-color1': (params) => {
          if (params.rowIndex % 2 !== 0) {
            return true;
          }
          return false;
        },
      },
      style: {
        width: '100%',
        height: 'calc(100vh - 160px)',
      },
      frameworkComponents: {
        renderInfo: ReportInfo,
      },
    };
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      });
    });
  };

  render() {
    const {
      style, defaultColDef, columnDefs, rowData, rowClassRules, frameworkComponents,
    } = this.state;
    const suppressContextMenu = true;
    const enableRangeSelection = true;
    const pagination = true;

    return (
      <Container className="reports">
        <Row>
          <Col md={12}>
            <h3 className="page-title">Reports</h3>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="grid-container" style={style}>
              <AgGridReact
                headerHeight={0}
                defaultColDef={defaultColDef}
                columnDefs={columnDefs}
                rowData={rowData}
                rowClassRules={rowClassRules}
                frameworkComponents={frameworkComponents}
                rowHeight={78}
                suppressContextMenu={suppressContextMenu}
                pagination={pagination}
                paginationPageSize={15}
                onGridReady={this.onGridReady}
              />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Reports;
