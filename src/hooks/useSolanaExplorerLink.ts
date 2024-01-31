import { PublicKey } from '@solana/web3.js';
import useChain from './useChain';

export type ExplorerLinkEntity = 'tx' | 'address';

export default function useSolanaExplorerLink(
  id: string | PublicKey | null,
  entity: ExplorerLinkEntity = 'tx',
) {
  const chain = useChain();

  if (!id) return null;

  return chain === 'mainnet-beta'
    ? `https://solana.fm/${entity}/${id}`
    : `https://explorer.solana.com/${entity}/${id}?cluster=${chain}`;
}
