import { SwapFormData } from '@/components/swap';
import { useMutation } from '@tanstack/react-query';

export const useSwapMutation = () => {
  return useMutation({
    mutationFn: async (data: SwapFormData) => {
      console.log('swap data', data);
      await new Promise(resolve => setTimeout(() => resolve(true), 3000));
      return {
        success: true,
        message: 'Swap successful',
      };
    },
  });
};
