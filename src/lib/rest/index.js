import axios from 'axios';
import { FB_FUNC_URL } from '../../config/constants';

const getHeaders = () => ({
  headers: {
    'Content-Type': 'application/json',
  },
});

const sendVerification = email => axios.get(
  `${FB_FUNC_URL}/sendMail?dest=${email}`, getHeaders(),
)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response.data));

const sendTeamInvite = (email, firstName) => axios.get(
  `${FB_FUNC_URL}?dest=${email}&first_name=${firstName}`,
  getHeaders(),
)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response.data));

const saveHubspotUser = userObj => axios.post(
  `${FB_FUNC_URL}/saveHubspotUser`, userObj, getHeaders(),
)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response.data));

const isPlainObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

const updateHubspotUser = (userObj) => {
  const user = userObj;
  if (isPlainObject(userObj.country)) {
    user.country = userObj.country.label || '';
  }
  return axios.post(
    `${FB_FUNC_URL}/updateHubspotUser`, user, getHeaders(),
  )
    .then(({ data }) => data)
    .catch(err => Promise.reject(err.response.data));
};

const getTendersPriceDiscovery = (importCountryId, originCountryId, commodityId, seller, buyer, year) => axios.post(
  '/api/psql/rpc/tenders_price_discovery', {
    param_import_country_id: importCountryId,
    param_origin_country_id: originCountryId,
    param_commodity_id: commodityId,
    param_seller: seller,
    param_buyer: buyer,
    param_year: year,
  }, getHeaders(),
)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response.data));

const getTendersPriceDiscoveryDetails = (importCountryId, shipmentMonth) => axios.post(
  '/api/psql/rpc/tenders_price_discovery_details', {
    import_country_id: importCountryId,
    shipment_month: shipmentMonth,
  }, getHeaders(),
)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response.data));

const getTendersBuyers = () => axios.get('/api/psql/tenders_buyers', getHeaders())
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response.data));

const getTendersSellers = () => axios.get('/api/psql/tenders_sellers', getHeaders())
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response.data));

const getCommodities = () => axios.get('/api/psql/tenders_commodities', getHeaders())
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response.data));

const getCountries = () => axios.get('/api/psql/tenders_import_countries', getHeaders())
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response.data));

export {
  sendVerification,
  sendTeamInvite,
  saveHubspotUser,
  updateHubspotUser,
  getTendersPriceDiscovery,
  getTendersPriceDiscoveryDetails,
  getTendersBuyers,
  getTendersSellers,
  getCommodities,
  getCountries,
};
