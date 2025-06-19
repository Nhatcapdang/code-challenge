type ResponseOrca<T> = {
  data: T;
  meta: {
    cursor: unknown;
    slot: number;
    block_time: number;
  };
};

type TTokenData = {
  address: string;
  mintAuthority: unknown;
  supply: number;
  decimals: number;
  isInitialized: boolean;
  freezeAuthority: unknown;
  tokenProgram: string;
  extensions: Record<string, unknown>;
  tags: string[];
  updatedEpoch: number;
  updatedAt: string;
  metadata: {
    coingeckoId: string;
    image: string;
    name: string;
    risk: number;
    symbol: string;
  };
  stats: {
    '24h': {
      volume: number;
    };
  };
};

type TTokenDataWithPrice = TTokenData & {
  priceUsdc: string;
};

type TSwapQuote = {
  request: {
    from: string;
    to: string;
    amount: string;
    amountIsInput: boolean;
    isLegacy: boolean;
    maxSplits: number;
    percentIncrement: number;
    numTopSplits: number;
    numTopPartials: number;
  };
  swap: {
    inputAmount: string;
    outputAmount: string;
    split: {
      pool: string;
      input: {
        mint: string;
        amount: string;
      };
      output: {
        mint: string;
        amount: string;
      };
      fees: {
        transferFee: object;
        tradeFee: {
          base: {
            amount: string;
            feeRate: string;
          };
        };
      };
    }[][];
  };
  data: {
    pools: {
      address: string;
      updatedSlot: number;
      writeVersion: number;
      whirlpoolsConfig: string;
      whirlpoolBump: number[];
      tickSpacing: number;
      feeTierIndexSeed: number[];
      feeRate: number;
      protocolFeeRate: number;
      liquidity: string;
      sqrtPrice: string;
      tickCurrentIndex: number;
      protocolFeeOwedA: string;
      protocolFeeOwedB: string;
      tokenMintA: string;
      tokenVaultA: string;
      feeGrowthGlobalA: string;
      tokenMintB: string;
      tokenVaultB: string;
      feeGrowthGlobalB: string;
      rewardLastUpdatedTimestamp: string;
      rewardInfos: [
        {
          mint: string;
          vault: string;
          authority: string;
          emissionsPerSecondX64: string;
          growthGlobalX64: string;
        },
        {
          mint: string;
          vault: string;
          authority: string;
          emissionsPerSecondX64: string;
          growthGlobalX64: string;
        },
        {
          mint: string;
          vault: string;
          authority: string;
          emissionsPerSecondX64: string;
          growthGlobalX64: string;
        },
      ];
    }[];
  };
  num_measured: number;
  optimal_amount_deviation: string;
  price_impact: string;
};
