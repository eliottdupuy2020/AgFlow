import React, { useState, useEffect } from 'react';
import { Field, reduxForm, submit } from 'redux-form';
import { useFetch } from 'react-async';
import { Button } from 'reactstrap';
import _ from 'lodash';
import styled from 'styled-components';
import numeral from 'numeral';
import renderSelectField from '../../../shared/components/form/Select';
import {
  fetchAllCommodities, fetchAllPorts, fetchAllCountries, fetchFreightVolumes,
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

const FreightFilter = (props) => {
  const { handleSubmit, reset } = props;
  const [countries, setCountries] = useState([]);
  const [volumes, setVolumes] = useState([{ value: undefined, label: 'Any' }]);

  const { url: countryUrl, meta: countryMeta } = fetchAllCountries;
  useFetch(countryUrl, countryMeta, {
    onResolve: (data) => {
      const parsedCountries = _
        .chain(data)
        .map(c => ({ value: c.location_id, label: c.name }))
        .sortBy('label')
        .value();
      setCountries([
        {
          value: undefined,
          label: 'Any',
        }, ...parsedCountries]);
    },
  });

  const { url: volumeUrl, meta: volumeMeta } = fetchFreightVolumes;
  useFetch(volumeUrl, volumeMeta, {
    onResolve: (data) => {
      const parsedVolumes = _
        .chain(data)
        .map(v => ({ value: v.volume, label: numeral(v.volume).format('0,0') }))
        .sortBy('value')
        .value();
      setVolumes([{
        value: undefined,
        label: 'Any',
      }, ...parsedVolumes]);
    },
  });

  return (
    <form className="form form--horizontal" onSubmit={handleSubmit}>
      <div className="filter-col">
        <span className="filter-label">Destination</span>
        <div className="filter-field" style={{ width: 140 }}>
          <Field
            name="import_country"
            component={renderSelectField}
            options={countries}
          />
        </div>
      </div>
      <div className="filter-col">
        <span className="filter-label">Origin</span>
        <div className="filter-field" style={{ width: 180 }}>
          <Field
            name="export_country"
            component={renderSelectField}
            options={countries}
          />
        </div>
      </div>
      <div className="filter-col">
        <span className="filter-label">Vessel size</span>
        <div className="filter-field" style={{ width: 120 }}>
          <Field
            name="vessel_volume"
            component={renderSelectField}
            options={volumes}
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
      <Legend> * All volumes displayed in metric tons, all prices displayed in US Dollars</Legend>
    </form>
  );
};

export default reduxForm({
  form: 'freight_filter_form', // a unique identifier for this form,
})(FreightFilter);
