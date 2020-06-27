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
  fetchTendersBuyers,
  fetchTendersSellers,
  fetchTendersCommodities,
  fetchTendersImportCountries,
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

const TendersFilter = (props) => {
  const { handleSubmit, reset } = props;

  const [importCountries, setImportCountries] = useState([]);
  const { url: importCountryUrl, meta: importCountryMeta } = fetchTendersImportCountries;
  useFetch(importCountryUrl, importCountryMeta, {
    onResolve: (data) => {
      const parsedCountries = _
        .chain(data)
        .map(c => ({ value: c.import_country_id, label: c.import_country_name }))
        .sortBy('label')
        .value();
      setImportCountries([
        {
          value: undefined,
          label: 'Any',
        }, ...parsedCountries]);
    },
  });


  const [buyers, setBuyers] = useState([]);
  const { url: buyersUrl, meta: buyersMeta } = fetchTendersBuyers;
  useFetch(buyersUrl, buyersMeta, {
    onResolve: (data) => {
      const parsedBuyers = _
        .chain(data)
        .map(c => ({ value: c.name, label: c.name }))
        .sortBy('label')
        .value();
      setBuyers([
        {
          value: undefined,
          label: 'Any',
        }, ...parsedBuyers]);
    },
  });


  const [sellers, setSellers] = useState([]);
  const { url: sellersUrl, meta: sellersMeta } = fetchTendersSellers;
  useFetch(buyersUrl, buyersMeta, {
    onResolve: (data) => {
      const parsedSellers = _
        .chain(data)
        .map(c => ({ value: c.name, label: c.name }))
        .sortBy('label')
        .value();
      setSellers([
        {
          value: undefined,
          label: 'Any',
        }, ...parsedSellers]);
    },
  });

  const [commodities, setCommodities] = useState([]);
  const { url: commoditiesUrl, meta: commoditiesMeta } = fetchTendersCommodities;
  useFetch(commoditiesUrl, commoditiesMeta, {
    onResolve: (data) => {
      const parsedCommodities = _
        .chain(data)
        .map(c => ({ value: c.commodity_id, label: c.commodity }))
        .sortBy('label')
        .value();
      setCommodities([
        {
          value: undefined,
          label: 'Any',
        }, ...parsedCommodities]);
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
        <span className="filter-label">Commodity</span>
        <div className="filter-field" style={{ width: 140 }}>
          <Field
            name="commodity"
            component={renderSelectField}
            options={commodities}
          />
        </div>
      </div>
      <div className="filter-col">
        <span className="filter-label">Buyer</span>
        <div className="filter-field" style={{ width: 140 }}>
          <Field
            name="buyer"
            component={renderSelectField}
            options={buyers}
          />
        </div>
      </div>
      <div className="filter-col">
        <span className="filter-label">Seller</span>
        <div className="filter-field" style={{ width: 140 }}>
          <Field
            name="seller"
            component={renderSelectField}
            options={sellers}
          />
        </div>
      </div>
      {/* <div className="filter-col">
        <span className="filter-label">Origin</span>
        <div className="filter-field" style={{ width: 180 }}>
          <Field
            name="origin"
            component={renderSelectField}
            options={importCountries}
          />
        </div>
      </div> */}
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
  form: 'tender_filter_form', // a unique identifier for this form,
})(TendersFilter);
