type TPoolToptrending24h = {
  id: string;
  chain: string;
  dex: string;
  type: string;
  quoteAsset: string;
  createdAt: string;
  liquidity: number;
  volume24h: number;
  updatedAt: string;
  baseAsset: {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    decimals: number;
    dev: string;
    circSupply: number;
    totalSupply: number;
    tokenProgram: string;
    launchpad: string;
    usdPrice: number;
    firstPool: {
      id: string;
      createdAt: string;
    };
    holderCount: number;
    audit: {
      mintAuthorityDisabled: boolean;
      freezeAuthorityDisabled: boolean;
      topHoldersPercentage: number;
      devBalancePercentage: number;
      devMigrations: number;
    };
    organicScore: number;
    organicScoreLabel: string;
    tags: string[];
    graduatedPool: string;
    graduatedAt: string;
    priceBlockId: number;
    liquidity: number;
    stats5m: {
      priceChange: number;
      holderChange: number;
      liquidityChange: number;
      volumeChange: number;
      buyVolume: number;
      sellVolume: number;
      sellOrganicVolume: number;
      numBuys: number;
      numSells: number;
      numTraders: number;
      numOrganicBuyers: number;
      numNetBuyers: number;
    };
    stats1h: {
      priceChange: number;
      holderChange: number;
      liquidityChange: number;
      volumeChange: number;
      buyVolume: number;
      sellVolume: number;
      buyOrganicVolume: number;
      sellOrganicVolume: number;
      numBuys: number;
      numSells: number;
      numTraders: number;
      numOrganicBuyers: number;
      numNetBuyers: number;
    };
    stats6h: {
      priceChange: number;
      holderChange: number;
      liquidityChange: number;
      volumeChange: number;
      buyVolume: number;
      sellVolume: number;
      buyOrganicVolume: number;
      sellOrganicVolume: number;
      numBuys: number;
      numSells: number;
      numTraders: number;
      numOrganicBuyers: number;
      numNetBuyers: number;
    };
    stats24h: {
      priceChange: number;
      holderChange: number;
      liquidityChange: number;
      buyVolume: number;
      sellVolume: number;
      buyOrganicVolume: number;
      sellOrganicVolume: number;
      numBuys: number;
      numSells: number;
      numTraders: number;
      numOrganicBuyers: number;
      numNetBuyers: number;
    };
    ctLikes: number;
    smartCtLikes: number;
  };
};

type TOrder = {
  mode: string;
  swapType: string;
  router: string;
  requestId: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: string;
  routePlan: [
    {
      swapInfo: {
        ammKey: string;
        label: string;
        inputMint: string;
        outputMint: string;
        inAmount: string;
        outAmount: string;
        feeAmount: string;
        feeMint: string;
      };
      percent: number;
    },
    {
      swapInfo: {
        ammKey: string;
        label: string;
        inputMint: string;
        outputMint: string;
        inAmount: string;
        outAmount: string;
        feeAmount: string;
        feeMint: string;
      };
      percent: number;
    },
    {
      swapInfo: {
        ammKey: string;
        label: string;
        inputMint: string;
        outputMint: string;
        inAmount: string;
        outAmount: string;
        feeAmount: string;
        feeMint: string;
      };
      percent: number;
    },
  ];
  inputMint: string;
  outputMint: string;
  feeMint: string;
  feeBps: number;
  prioritizationFeeLamports: number;
  transaction: unknown;
  gasless: boolean;
  taker: string;
  inUsdValue: number;
  outUsdValue: number;
  priceImpact: number;
  swapUsdValue: number;
  totalTime: number;
};
