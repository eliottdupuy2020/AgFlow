/* eslint-disable import/prefer-default-export */

// GENERAL

export const fetchAllIncoterms = {
  url: '/api/psql/incoterms?select=code',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};


// FREIGHT

export const fetchAllCommodities = {
  url: '/api/psql/commodities?select=commodity_id,name',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const fetchAllLocations = {
  url: '/api/psql/locations?select=location_id,name',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};


export const fetchAllPorts = {
  url: '/api/psql/locations?location_type=eq.port',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const fetchAllCountries = {
  url: '/api/psql/locations?location_type=eq.country',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const fetchFreightVolumes = {
  url: '/api/psql/freight_volumes',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const latestFreightsPriceDiscovery = {
  url: '/api/psql/freights_price_discovery_view',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const rpcFreightPriceDiscovery = {
  url: '/api/psql/rpc/freights_price_discovery_summary',
  meta: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const rpcFreightPriceDiscoveryDetails = {
  url: '/api/psql/rpc/freights_price_discovery_details',
  meta: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};


export const rpcFreightPriceDiscoveryHistorical = {
  url: '/api/psql/rpc/freight_price_discovery_historical',
  meta: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};


// PRICE DISCOVERY

export const quotesPriceDiscoverySummary = {
  url: '/api/psql/quotes_price_discovery_summary',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const rpcQuotesPriceDiscoveryLevelTwo = {
  url: '/api/psql/rpc/quotes_price_discovery_level_two',
  meta: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const rpcQuotesPriceDiscoveryLevelThree = {
  url: '/api/psql/rpc/quotes_price_discovery_level_three',
  meta: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const rpcQuotesPriceDiscoveryHistorical = {
  url: '/api/psql/rpc/quotes_price_discovery_historical',
  meta: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const fetchQuotesPriceDiscoveryIncoterms = {
  url: '/api/psql/quotes_price_discovery_incoterms',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const fetchQuotesPriceDiscoveryExportCountries = {
  url: '/api/psql/quotes_price_discovery_export_countries',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const fetchQuotesPriceDiscoveryImportCountries = {
  url: '/api/psql/quotes_price_discovery_import_countries',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const fetchQuotesPriceDiscoveryContributors = {
  url: '/api/psql/quotes_price_discovery_contributors',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};


// TRADEFLOWS

export const rpcTradeflowsVolumeDiscovery = {
  url: '/api/psql/rpc/tradeflows_volume_discovery',
  meta: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const rpcTradeflowsVolumeDiscoveryDetails = {
  url: '/api/psql/rpc/tradeflows_volume_discovery_details',
  meta: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};


export const fetchTradeflowsCommoditySubgroups = {
  url: '/api/psql/tradeflows_commodity_subgroup',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const fetchTradeflowsImportCountries = {
  url: '/api/psql/tradeflows_import_countries',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const fetchTradeflowsExportCountries = {
  url: '/api/psql/tradeflows_export_countries',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

// TENDERS

export const rpcTendersPriceDiscovery = {
  url: '/api/psql/rpc/tenders_price_discovery',
  meta: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const rpcTendersPriceDiscoveryDetails = {
  url: '/api/psql/rpc/tenders_price_discovery_details',
  meta: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const fetchTendersBuyers = {
  url: '/api/psql/tenders_buyers',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const fetchTendersSellers = {
  url: '/api/psql/tenders_sellers',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const fetchTendersCommodities = {
  url: '/api/psql/tenders_commodities',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

export const fetchTendersImportCountries = {
  url: '/api/psql/tenders_import_countries',
  meta: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};
