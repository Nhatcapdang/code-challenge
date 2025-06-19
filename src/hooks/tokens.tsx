import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { QueryKey } from '../constants/queryKey';

const orcapools = axios.create({
  baseURL: 'https://pools-api.mainnet.orca.so',
});

const orcaApi = axios.create({
  baseURL: 'https://api.orca.so',
});

export function useTokensWithPriceMutation() {
  return useMutation({
    mutationFn: async (address: string[]) => {
      const response = await orcaApi.get<ResponseOrca<TTokenDataWithPrice[]>>(
        `/v2/solana/tokens`,
        {
          params: {
            tokens: address.join(','),
          },
        }
      );
      return response.data.data;
    },
  });
}

export function useTokensWithPrice(address: string[]) {
  return useQuery({
    queryKey: [QueryKey.TokensWithPrice, address],
    queryFn: async () => {
      const response = await orcaApi.get<ResponseOrca<TTokenDataWithPrice[]>>(
        `/v2/solana/tokens`,
        {
          params: {
            tokens: address.join(','),
          },
        }
      );
      return response.data.data;
    },
    initialData: [],
  });
}

export function useTokens() {
  return useQuery({
    queryKey: [QueryKey.Tokens],
    queryFn: async () => {
      const response = await orcaApi.get<ResponseOrca<TTokenData[]>>(
        `/v2/solana/tokens/search`
      );
      return response.data;
    },
    select(data) {
      return data.data?.map((item) => ({
        value: item.address,
        label: item.metadata.symbol,
        ...item,
      }));
    },
  });
}

export function useSwapQuoteMutation() {
  return useMutation({
    mutationFn: async ({
      from,
      to,
      amount = '0',
    }: {
      from: string;
      to: string;
      amount: string;
    }) => {
      const response = await orcapools.get<ResponseOrca<TSwapQuote>>(
        `/swap-quote`,
        {
          params: {
            from,
            to,
            isLegacy: false,
            amountIsInput: true,
            includeData: true,
            includeComputeBudget: false,
            maxTxSize: 1180,
            amount: amount + '00000000000',
          },
        }
      );
      const outputAmount = response.data.data.swap.outputAmount;
      response.data.data.swap.inputAmount = amount;
      response.data.data.swap.outputAmount = outputAmount.slice(0, -6);
      return response.data.data;
    },
  });
}

export function useSwapQuote({
  from,
  to,
  amount,
}: {
  from: string;
  to: string;
  amount: string;
}) {
  return useQuery({
    queryKey: [QueryKey.SwapQuote, from, to, amount],
    queryFn: async () => {
      const response = await orcapools.get<ResponseOrca<TSwapQuote>>(
        `/swap-quote`,
        {
          params: {
            from,
            to,
            isLegacy: false,
            amountIsInput: true,
            includeData: true,
            includeComputeBudget: false,
            maxTxSize: 1180,
            amount: amount + '00000000000',
          },
        }
      );
      return response.data;
    },
    enabled: amount !== '0',
  });
}
