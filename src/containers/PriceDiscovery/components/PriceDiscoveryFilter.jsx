import React, { useState, useEffect } from 'react';
import { Field, reduxForm, submit } from 'redux-form';
import { useFetch } from 'react-async';
import { Button } from 'reactstrap';
import _ from 'lodash';
import styled from 'styled-components';
import numeral from 'numeral';
import renderSelectField from '../../../shared/components/form/Select';
import {
  fetchQuotesPriceDiscoveryIncoterms,
  fetchQuotesPriceDiscoveryImportCountries,
  fetchQuotesPriceDiscoveryExportCountries,
  fetchQuotesPriceDiscoveryContributors,
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

const IncotermFilter = (props) => {
  const { handleSubmit, reset } = props;

  const [incoterms, setIncoterms] = useState([]);
  const { url: incotermUrl, meta: incotermMeta } = fetchQuotesPriceDiscoveryIncoterms;
  useFetch(incotermUrl, incotermMeta, {
    onResolve: (data) => {
      const parsedIncoterms = _
        .chain(data)
        .map(c => ({ value: c.incoterm_code, label: c.incoterm_code }))
        .sortBy('label')
        .value();
      setIncoterms([
        {
          value: undefined,
          label: 'Any',
        }, ...parsedIncoterms]);
    },
  });

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

  const [importCountries, setImportCountries] = useState([]);
  const { url: importCountriesUrl, meta: importCountriesMeta } = fetchQuotesPriceDiscoveryImportCountries;
  useFetch(importCountriesUrl, importCountriesMeta, {
    onResolve: (data) => {
      const parsedImportCountries = _
        .chain(data)
        .map(c => ({ value: c.import_country_id, label: c.import_country_name }))
        .sortBy('label')
        .value();
      setImportCountries([
        {
          value: undefined,
          label: 'Any',
        }, ...parsedImportCountries]);
    },
  });

  const [exportCountries, setExportCountries] = useState([]);
  const { url: exportCountriesUrl, meta: exportCountriesMeta } = fetchQuotesPriceDiscoveryExportCountries;
  useFetch(exportCountriesUrl, exportCountriesMeta, {
    onResolve: (data) => {
      const parsedExportCountries = _
        .chain(data)
        .map(c => ({ value: c.export_country_id, label: c.export_country_name }))
        .sortBy('label')
        .value();
      setExportCountries([
        {
          value: undefined,
          label: 'Any',
        }, ...parsedExportCountries]);
    },
  });

  const [contributors, setContributors] = useState([]);
  const { url: contributorsUrl, meta: contributorsMeta } = fetchQuotesPriceDiscoveryContributors;
  useFetch(contributorsUrl, contributorsMeta, {
    onResolve: (data) => {
      const parsedContributors = _
        .chain(data)
        .map(c => ({ value: c.contributor_id, label: c.contributor }))
        .sortBy('label')
        .value();
      setContributors([
        {
          value: undefined,
          label: 'Any',
        }, ...parsedContributors]);
    },
  });

  return (
    <form className="form form--horizontal" onSubmit={handleSubmit}>
      <div className="filter-col">
        <span className="filter-label">Incoterm</span>
        <div className="filter-field" style={{ width: 140 }}>
          <Field
            name="incoterm"
            component={renderSelectField}
            options={incoterms}
          />
        </div>
      </div>
      <div className="filter-col">
        <span className="filter-label">Import Country</span>
        <div className="filter-field" style={{ width: 140 }}>
          <Field
            name="import_country"
            component={renderSelectField}
            options={importCountries}
          />
        </div>
      </div>
      <div className="filter-col">
        <span className="filter-label">Export Country</span>
        <div className="filter-field" style={{ width: 140 }}>
          <Field
            name="export_country"
            component={renderSelectField}
            options={exportCountries}
          />
        </div>
      </div>
      <div className="filter-col">
        <span className="filter-label">Container type</span>
        <div className="filter-field" style={{ width: 140 }}>
          <Field
            name="container_type"
            component={renderSelectField}
            options={[
              {
                value: null,
                label: 'Any',
              },
              {
                value: 'Container',
                label: 'Container',
              }, {
                value: 'Other',
                label: 'Other',
              }]}
          />
        </div>
      </div>
      {/* <div className="filter-col">
        <span className="filter-label">Average on</span>
        <div className="filter-field" style={{ width: 180 }}>
          <Field
            name="average_on"
            component={renderSelectField}
            options={[{
              value: undefined,
              label: 'Any',
            }, {
              value: 'bid',
              label: 'Bid',
            }, {
              value: 'ask',
              label: 'Ask',
            },
            {
              value: 'nominal',
              label: 'Nominal',
            },
            {
              value: 'traded',
              label: 'Traded',
            }]}
          />
        </div>
      </div> */}
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
    </form>
  );
};

export default reduxForm({
  form: 'price_discovery_filter_form', // a unique identifier for this form,
})(IncotermFilter);
