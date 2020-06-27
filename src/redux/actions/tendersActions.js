import {
  getTendersPriceDiscovery,
  getTendersPriceDiscoveryDetails,
  getTendersBuyers,
  getTendersSellers,
  getCommodities,
  getCountries,
} from '../../lib/rest';

export const TENDER_PRICES_LOADED = 'TENDER_PRICES_LOADED';
export const TENDER_BUYERS_LOADED = 'TENDER_BUYERS_LOADED';
export const TENDER_SELLERS_LOADED = 'TENDER_SELLERS_LOADED';
export const TENDER_COMMODITY_LOADED = 'TENDER_COMMODITY_LOADED';
export const TENDER_COUNTRIES_LOADED = 'TENDER_COUNTRIES_LOADED';
export const TENDER_DETAILS_LOADED = 'TENDER_DETAILS_LOADED';

// noinspection JSAnnotator
export const loadTendersPrices = (importCountryId, originCountryId, commodityId, seller, buyer, year) => {
  console.log('[loadTendersPrices]');
  return dispatch => getTendersPriceDiscovery(importCountryId, originCountryId, commodityId, seller, buyer, year)
    .then(data => dispatch({
      type: TENDER_PRICES_LOADED,
      priceData: data,
    }))
    .catch(err => dispatch({
      type: TENDER_PRICES_LOADED,
      priceData: [],
    }));
};

export const loadTendersDetails = (importCountryId, shipmentMonth) => {
  console.log('[loadTendersDetails]');
  return dispatch => getTendersPriceDiscoveryDetails(importCountryId, shipmentMonth)
    .then(data => dispatch({
      type: TENDER_DETAILS_LOADED,
      tenderData: data,
    }))
    .catch(err => dispatch({
      type: TENDER_DETAILS_LOADED,
      tenderData: [],
    }));
};

export const loadTendersBuyers = () => dispatch => getTendersBuyers()
  .then((data) => {
    dispatch({
      type: TENDER_BUYERS_LOADED,
      tenderData: data,
    });
  })
  .catch((err) => {
    dispatch({
      type: TENDER_BUYERS_LOADED,
      tenderData: [],
    });
  });

export const loadTendersSellers = () => dispatch => getTendersSellers()
  .then((data) => {
    dispatch({
      type: TENDER_SELLERS_LOADED,
      tenderData: data,
    });
  })
  .catch((err) => {
    dispatch({
      type: TENDER_SELLERS_LOADED,
      tenderData: [],
    });
  });

export const loadCommodities = () => dispatch => getCommodities()
  .then((data) => {
    dispatch({
      type: TENDER_COMMODITY_LOADED,
      tenderData: data,
    });
  })
  .catch((err) => {
    dispatch({
      type: TENDER_COMMODITY_LOADED,
      tenderData: [],
    });
  });

export const loadCountries = () => dispatch => getCountries()
  .then((data) => {
    dispatch({
      type: TENDER_COUNTRIES_LOADED,
      tenderData: data,
    });
  })
  .catch((err) => {
    dispatch({
      type: TENDER_COUNTRIES_LOADED,
      tenderData: [],
    });
  });
