'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore } from 'zustand';
import {
  SwapStore,
  createSwapStore,
  defaultInitStateSwap,
} from '../../stores/use-swap-store';

export type SwapStoreApi = ReturnType<typeof createSwapStore>;

export const SwapStoreContext = createContext<SwapStoreApi | undefined>(
  undefined
);

export interface SwapStoreProviderProps {
  children: ReactNode;
}

export const SwapStoreProvider = ({ children }: SwapStoreProviderProps) => {
  const storeRef = useRef<SwapStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createSwapStore(defaultInitStateSwap);
  }

  return (
    <SwapStoreContext.Provider value={storeRef.current}>
      {children}
    </SwapStoreContext.Provider>
  );
};

export const useSwapStore = <T,>(selector: (store: SwapStore) => T): T => {
  const swapStoreContext = useContext(SwapStoreContext);

  if (!swapStoreContext) {
    throw new Error(`useSwapStore must be used within SwapStoreProvider`);
  }

  return useStore(swapStoreContext, selector);
};
