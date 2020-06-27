import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { useFetch } from 'react-async';
import numeral from 'numeral';
import * as _ from 'lodash';
import styled from 'styled-components';
import moment from 'moment';
import { rpcTendersPriceDiscoveryDetails } from '../../../lib/api';
import Loading from '../../../shared/components/Loading';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    backgroundColor: '#131722',
  },
  labelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: 11,
    paddingTop: 12,
    fontSize: 14,
    fontWeight: 800,
    paddingLeft: 22,
    color: '#d8defb',
    backgroundColor: '#202943',
    height: 40,
  },
  close: {
    marginTop: -3,
    cursor: 'pointer',
  },
  table: {
    minWidth: 700,
    margin: 10,
    width: 'calc(100% - 20px)',
  },
  tableHeadRow: {
    backgroundColor: '#202943',
    height: 35,
  },
  tableRow: {
    backgroundColor: '#131722',
  },
  tableHeadCell: {
    color: '#d8defb',
    borderBottomColor: '#131722',
  },
  tableCell: {
    color: '#fff',
    borderBottomColor: '#131722',
    width: '100px',
  },
});

const LoadingWrapper = styled.div.withConfig({
  displayName: 'LoadingWrapper',
})`
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1e2841
`;

const PopupTable = (props) => {
  const { classes, onClose, requestPayload } = props;
  const [rows, setRows] = useState([]);
  const { url, meta } = rpcTendersPriceDiscoveryDetails;
  const { isPending, run } = useFetch(url, meta, {
    onResolve: (data) => {
      const parsedData = _
        .chain(data)
        .map(d => ({
          seller: d.seller,
          buyer: d.buyer,
          volume: d.volume,
          commodity: d.commodity,
          price: d.price,
        }))
        .value();
      setRows(parsedData);
    },
  });
  useEffect(() => {
    run({
      body: JSON.stringify({
        shipment_month: requestPayload.shipmentMonth,
        import_country_id: requestPayload.originCountryId,
      }),
    });
  }, []);

  return (
    <div>
      {
      isPending ? <LoadingWrapper><Loading loading /></LoadingWrapper> : (
        <Paper className={classes.root}>
          <Typography className={classes.labelHeader}>
            { `Tradeflows Details to ${requestPayload && requestPayload.originCountryName}
            - ${requestPayload && moment(requestPayload.shipmentMonth, 'YYYY-MM-DD').format('MMMM YYYY')}` }
            <CloseIcon
              className={classes.close}
              onClick={onClose}
            />
          </Typography>
          <Table
            className={classes.table}
          >
            <TableHead>
              <TableRow
                className={classes.tableHeadRow}
              >
                <TableCell className={classes.tableHeadCell}>SELLER</TableCell>
                <TableCell className={classes.tableHeadCell}>BUYER</TableCell>
                <TableCell className={classes.tableHeadCell}>VOLUME(MT)</TableCell>
                <TableCell className={classes.tableHeadCell}>COMMODITY</TableCell>
                <TableCell className={classes.tableHeadCell}>PRICE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {rows.map((row, idx) => (
                <TableRow
                // eslint-disable-next-line
                  key={`${row.seller}-${row.buyer}-${row.volume}-${row.commodity}-${row.price}-${idx}`}
                  classes={{ hover: classes.hover }}
                  className={classes.tableRow}
                >
                  <TableCell component="th" scope="row" className={classes.tableCell}>
                    {row.seller}
                  </TableCell>
                  <TableCell className={classes.tableCell}>{row.buyer}</TableCell>
                  <TableCell className={classes.tableCell}>{row.volume}</TableCell>
                  <TableCell className={classes.tableCell}>{row.commodity}</TableCell>
                  <TableCell className={classes.tableCell}>{row.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )
        }
    </div>

  );
};

export default withStyles(styles)(PopupTable);
