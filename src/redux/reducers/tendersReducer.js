import {
  TENDER_BUYERS_LOADED,
  TENDER_SELLERS_LOADED,
  TENDER_COMMODITY_LOADED,
  TENDER_PRICES_LOADED,
  TENDER_COUNTRIES_LOADED,
  TENDER_DETAILS_LOADED,
} from '../actions/tendersActions';

const initialState = {
  prices: [],
  buyers: [],
  sellers: [],
  countries: [],
  commodities: [],
  details: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TENDER_BUYERS_LOADED:
      return { ...state, buyers: action.tenderData };
    case TENDER_SELLERS_LOADED:
      return { ...state, sellers: action.tenderData };
    case TENDER_COUNTRIES_LOADED:
      return { ...state, countries: action.tenderData };
    case TENDER_COMMODITY_LOADED:
      return { ...state, commodities: action.tenderData };
    case TENDER_DETAILS_LOADED:
      return { ...state, details: action.tenderData };
    case TENDER_PRICES_LOADED:
    {
      const countries = state.countries || [];
      const data = action.priceData || [];
      let result = [];
      try {
        for (let i = 0; i < data.length; i += 1) {
          const keys = Object.keys(data[i].dataset || []);
          const values = Object.values(data[i].dataset || []);
          const country = data[i].country_name || '';
          const item = {
            id: i + 1,
            country,
          };
          for (let j = 0; j < keys.length; j += 1) {
            item[`${keys[j]}_t`] = values[j].total_volume || 0;
            item[`${keys[j]}_a`] = values[j].average_price || 0;
          }
          try {
            item.import_country_id = countries.find(x => x.import_country_name === country).import_country_id || '';
          } catch (e) {
            item.import_country_id = '';
          }
          result.push(item);
        }
      } catch (e) {
        result = [];
      }

      return {
        ...state,
        prices: result,
      };
    }
    default:
      return state;
  }
}
