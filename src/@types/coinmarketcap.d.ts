type TCoimarketCapResponse<T> = {
  data: T[];
  status: {
    timestamp: string;
    error_code: string;
    error_message: string;
    elapsed: number;
    credit_count: number;
  };
};

type IFearGreedHistorical = {
  timestamp: string;
  value: number;
  value_classification:
    | 'Extreme fear'
    | 'Fear'
    | 'Neutral'
    | 'Greed'
    | 'Extreme greed';
};

type TQuotesLatest = {
  tags: {
    slug: string;
    name: string;
    category: string;
  }[];
  id: number;
  name: string;
  symbol: string;
  slug: string;
  is_active: number;
  infinite_supply: boolean;
  is_fiat: number;
  circulating_supply: number;
  total_supply: number;
  max_supply?: unknown;
  // '2024-03-29T04:42:08.000Z'
  date_added: string;
  num_market_pairs: number;
  cmc_rank: number;
  // '2025-04-20T07:35:00.000Z';
  last_updated: string;
  tvl_ratio: number;
  platform: {
    id: number;
    slug: string;
    name: string;
    symbol: string;
    // '0x57e114B691Db790C35207b2e685D4A43181e6061'
    token_address: string;
  };
  self_reported_circulating_supply: number;
  self_reported_market_cap: number;
  quote: TQoute[];
};

type TQoute = {
  id: number;
  symbol: string;
  price: number;
  volume_24h: number;
  volume_change_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  percent_change_60d: number;
  percent_change_90d: number;
  market_cap: number;
  market_cap_dominance: number;
  fully_diluted_market_cap: number;
  tvl: number;
  // '2025-04-20T07:34:00.000Z';
  last_updated: string;
};
