import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { delay } from 'lodash';
import { QueryKey } from '@/src/constants/queryKey';

const datapiJup = axios.create({
  baseURL: 'https://datapi.jup.ag/v1',
});

export function usePoolToptrending24h() {
  return useQuery({
    queryKey: [QueryKey.PoolToptrending24h],
    queryFn: async () => {
      const response = await datapiJup.get<{ pools: TPoolToptrending24h[] }>(
        `/pools/toptrending/24h`
      );
      return response.data.pools;
    },
    select(data) {
      return data.map((pool) => ({
        ...pool,
        value: pool.baseAsset.id,
        label: pool.baseAsset.symbol,
      }));
    },
    // initialData: [],
  });
}

export function useSearchToken() {
  return useMutation({
    mutationFn: async (params: { query: string }) => {
      const response = await axios.get<TPoolToptrending24h[]>(
        `https://datapi.jup.ag/v1/assets/search`,
        {
          params: {
            query: params.query,
          },
        }
      );
      return response.data;
    },
  });
}

export function useOrderBook() {
  return useMutation({
    mutationFn: async (params: {
      inputMint: string;
      outputMint: string;
      decimals?: number;
      amount?: string | number;
    }) => {
      const response = await axios.get<TOrder>(
        `https://ultra-api.jup.ag/order`,
        {
          params: {
            inputMint: params.inputMint,
            outputMint: params.outputMint,
            amount: params.amount + '0'.repeat(params.decimals || 0),
            swapMode: 'ExactIn',
          },
        }
      );
      return response.data;
    },
  });
}

export function useSwap() {
  return useMutation({
    mutationFn: async (params: {
      inputMint: string;
      outputMint: string;
      amount?: string | number;
    }) => {
      const response = await axios.post<TOrder>(
        `https://jsonplaceholder.typicode.com/posts`,
        params
      );
      delay(() => {
        console.log('swap success');
      }, 2000);
      return response.data;
    },
  });
}
