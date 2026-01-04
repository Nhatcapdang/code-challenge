declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_RESEND_API_KEY: string;
      NEXT_PUBLIC_SOLANA_RPC_URL: string;
      NEXT_PUBLIC_SOLANA_NETWORK: Cluster;
      NEXT_PUBLIC_PINATA_JWT: string;
      NEXT_PUBLIC_GATEWAY_URL: string;
    }
  }
}

export {};
