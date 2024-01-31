import { useAccount } from '@/contexts/account';
import ConnectWalletButton from './ConnectWalletButton';
import WalletButton from './SolanaWalletButton';

export default function Wallet() {
  const { active, address, balanceInLamports } = useAccount();

  return active ? (
    <WalletButton address={address} balance={balanceInLamports} />
  ) : (
    <ConnectWalletButton inHeader />
  );
}
