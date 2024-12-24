/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_ACTIVE_SOLANA_CHAIN: string;
  readonly VITE_SOLANA_RPC_ENDPOINT: string;
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  readonly VITE_NANENS_VOTE_PUBKEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
