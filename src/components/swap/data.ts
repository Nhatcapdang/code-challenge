import { ComboboxItem } from '@mantine/core';

export type SelectDropdownItem = ComboboxItem & TTokenData;

export const DefaultTokens: SelectDropdownItem[] = [
  {
    address: 'So11111111111111111111111111111111111111112',
    mintAuthority: null,
    supply: 0,
    decimals: 9,
    isInitialized: true,
    freezeAuthority: null,
    tokenProgram: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    extensions: {},
    tags: [],
    updatedEpoch: 803,
    updatedAt: '2025-06-16T04:03:15.275908Z',
    metadata: {
      coingeckoId: 'solana',
      image:
        'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      name: 'Solana',
      risk: 2,
      symbol: 'SOL',
    },
    stats: {
      '24h': {
        volume: 405090392.00868887,
      },
    },
    label: 'SOL',
    value: 'SOL',
  },
  {
    address: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
    mintAuthority: '6iQKfEyhr3bZMotVkW6beNZz5CPAkiwvgV2CTje9pVSS',
    supply: 14214792541422094,
    decimals: 9,
    isInitialized: true,
    freezeAuthority: null,
    tokenProgram: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    extensions: {},
    tags: [],
    updatedEpoch: 803,
    updatedAt: '2025-06-15T20:46:20.763594Z',
    metadata: {
      coingeckoId: 'jito-sol',
      image: 'https://storage.googleapis.com/token-metadata/JitoSOL-256.png',
      name: 'Jito Staked SOL',
      risk: 2,
      symbol: 'JitoSOL',
    },
    stats: {
      '24h': {
        volume: 16011246.781867009,
      },
    },
    label: 'JitoSOL',
    value: 'JitoSOL',
  },
];
