import { SwapFormData } from '@/components/swap';
import { pick } from 'lodash';
import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

export type SwapState = {
  _hasHydrated: boolean;
  initialSwapForm: SwapFormData;
};

export type SwapActions = {
  setSwapForm: (swapForm: SwapFormData) => void;
  onInverseSwap: () => void;
  _setHasHydrated: (hasHydrated: boolean) => void;
};

export type SwapStore = SwapState & SwapActions;

export const defaultInitStateSwap: SwapState = {
  _hasHydrated: false,
  initialSwapForm: {
    payToken: null,
    receiveToken: null,
    payAmount: 0,
    receiveAmount: 0,
    slippage: 0.5,
  },
};

export const createSwapStore = (
  initState: SwapState = defaultInitStateSwap
) => {
  return createStore<SwapStore>()(
    persist(
      (set, get) => ({
        ...initState,
        setSwapForm: swapForm => set({ initialSwapForm: swapForm }),
        onInverseSwap: () =>
          set({
            initialSwapForm: {
              ...get().initialSwapForm,
              payToken: get().initialSwapForm.receiveToken,
              receiveToken: get().initialSwapForm.payToken,
              payAmount: get().initialSwapForm.receiveAmount,
              receiveAmount: get().initialSwapForm.payAmount,
            },
          }),
        _setHasHydrated: hasHydrated => set({ _hasHydrated: hasHydrated }),
      }),
      {
        name: 'swap-storage',
        partialize: state => pick(state, []),
        onRehydrateStorage: () => {
          return state => {
            state?._setHasHydrated(true);
          };
        },
      }
    )
  );
};
