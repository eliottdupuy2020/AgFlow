import React, { useState, useEffect } from 'react';
import { Field, reduxForm, submit } from 'redux-form';
import { useFetch } from 'react-async';
import { Button } from 'reactstrap';
import _ from 'lodash';
import styled from 'styled-components';
import numeral from 'numeral';
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import renderSelectField from '../../../shared/components/form/Select';
import {
  // fetchAllCommodities, fetchAllCountries,
  fetchTradeflowsCommoditySubgroups,
  fetchTradeflowsImportCountries,
  fetchTradeflowsExportCountries,
} from '../../../lib/api';

const FilterActions = styled.div.withConfig({
  displayName: 'FilterActions',
})`
  margin-top: 2px;
  margin-left: 5px;
`;

const ResetButton = styled(Button).withConfig({
  displayName: 'ResetButton',
})`
  border: 0px;
`;

const Legend = styled.p.withConfig({
  displayName: 'Legend',
})`
  font-style: italic;
  opacity: 0.7;
  width: 100%;
  text-align: center;
  font-size: 12px;
`;

const TradeflowsFilter = (props) => {
  const { handleSubmit, reset } = props;
  const [importCountries, setImportCountries] = useState([]);
  const [exportCountries, setExportCountries] = useState([]);
  const [commoditiesSubGroups, setCommoditiesSubGroups] = useState([]);

  const { url: importCountryUrl, meta: importCountryMeta } = fetchTradeflowsImportCountries;
  useFetch(importCountryUrl, importCountryMeta, {
    onResolve: (data) => {
      const parsedCountries = _
        .chain(data)
        .map(c => ({ value: c.id, label: c.name }))
        .sortBy('label')
        .value();
      setImportCountries([
        {
          value: undefined,
          label: 'Any',
        }, ...parsedCountries]);
    },
  });

  const { url: exportCountryUrl, meta: exportCountryMeta } = fetchTradeflowsExportCountries;
  useFetch(exportCountryUrl, exportCountryMeta, {
    onResolve: (data) => {
      const parsedCountries = _
        .chain(data)
        .map(c => ({ value: c.id, label: c.name }))
        .sortBy('label')
        .value();
      setExportCountries([
        {
          value: undefined,
          label: 'Any',
        }, ...parsedCountries]);
    },
  });

  const { url: commoditiesSubGroupsUrl, meta: commoditiesSubGroupsMeta } = fetchTradeflowsCommoditySubgroups;
  useFetch(commoditiesSubGroupsUrl, commoditiesSubGroupsMeta, {
    onResolve: (data) => {
      const parsedCommoditiesSubGroups = _
        .chain(data)
        .map(c => ({ value: c.id, label: c.name }))
        .sortBy('label')
        .value();
      setCommoditiesSubGroups([
        {
          value: undefined,
          label: 'Any',
        }, ...parsedCommoditiesSubGroups]);
    },
  });

  const years = (() => {
    const res = [];
    const i = 0;
    const initialYear = moment('2017', 'YYYY');
    const currentLoopYear = cloneDeep(initialYear);
    const todayYear = moment();

    while (!todayYear.isBefore(currentLoopYear, 'year')) {
      res.push({
        value: currentLoopYear.format('YYYY'),
        label: currentLoopYear.format('YYYY'),
      });
      currentLoopYear.add(1, 'year');
    }

    res.unshift({
      value: undefined,
      label: 'Any',
    });
    return res;
  })();

  return (
    <form className="form form--horizontal" onSubmit={handleSubmit}>
      <div className="filter-col">
        <span className="filter-label">Destination</span>
        <div className="filter-field" style={{ width: 140 }}>
          <Field
            name="import_country"
            component={renderSelectField}
            options={importCountries}
          />
        </div>
      </div>
      <div className="filter-col">
        <span className="filter-label">Export</span>
        <div className="filter-field" style={{ width: 180 }}>
          <Field
            name="export_country"
            component={renderSelectField}
            options={exportCountries}
          />
        </div>
      </div>
      <div className="filter-col">
        <span className="filter-label">Commodity group</span>
        <div className="filter-field" style={{ width: 120 }}>
          <Field
            name="commodity_subgroup"
            component={renderSelectField}
            options={commoditiesSubGroups}
          />
        </div>
      </div>
      <div className="filter-col">
        <span className="filter-label">Year</span>
        <div className="filter-field" style={{ width: 120 }}>
          <Field
            name="year"
            component={renderSelectField}
            options={years}
          />
        </div>
      </div>
      <FilterActions>
        <Button outline color="primary">Search</Button>
        <ResetButton
          outline
          color="danger"
          onClick={() => {
            reset();
            // This just makes sure the reset() worked before submitting.
            setTimeout(() => {
              handleSubmit();
            }, 0);
          }}
        >Reset
        </ResetButton>{' '}
      </FilterActions>
      <Legend> * All volumes displayed in kilometric tons</Legend>
    </form>
  );
};

export default reduxForm({
  form: 'tradeflow_filter_form', // a unique identifier for this form,
})(TradeflowsFilter);
