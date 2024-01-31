import { SupportedClusters } from '@lidofinance/solido-sdk/dist/esm/core/src/types';

type Config = {
  activeSolanaChain: SupportedClusters;
  rpcEndpoint: string;
  walletConnectProjectId: string;
};

const DEFAULT_ACTIVE_SOLANA_CHAIN = 'testnet';
const DEFAULT_SOLANA_RPC_ENDPOINT = 'https://api.testnet.solana.com';
const DEFAULT_WALLET_CONNECT_PROJECT_ID = '';

const config: Config = {
  activeSolanaChain: (import.meta.env.VITE_ACTIVE_SOLANA_CHAIN ??
    DEFAULT_ACTIVE_SOLANA_CHAIN) as SupportedClusters,
  rpcEndpoint: import.meta.env.VITE_SOLANA_RPC_ENDPOINT ?? DEFAULT_SOLANA_RPC_ENDPOINT,
  walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID ?? DEFAULT_WALLET_CONNECT_PROJECT_ID,
};

export const getConfig = () => config;
