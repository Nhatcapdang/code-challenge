import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { uniqBy } from 'lodash';

type Token = {
  currency: string;
  // format: 2023-08-29T07:10:40.000Z
  date: string;
  price: number;
  image: string;
};
export function useTokens() {
  return useQuery<Token[]>({
    queryKey: ['use-tokens'],
    queryFn: async () => {
      const response = await axios.get<Token[]>(
        'https://interview.switcheo.com/prices.json'
      );

      const responseIma = await Promise.allSettled(
        response.data.map(async item => {
          const image = await axios.get<string>(
            `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${item.currency}.svg`
          );
          return {
            ...item,
            // svg to base64
            image: `data:image/svg+xml;base64,${Buffer.from(
              image.data
            ).toString('base64')}`,
          };
        })
      );
      const results = responseIma.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        }
        return {
          ...response.data[index],
          image: 'https://dummyimage.com/60x60/000/fff',
        };
      });
      return uniqBy(results, 'currency');
    },
  });
}

export type UseTokensResponse = NonNullable<
  ReturnType<typeof useTokens>['data']
>;
