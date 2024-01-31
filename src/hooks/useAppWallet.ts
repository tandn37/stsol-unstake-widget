import { WALLET_ID, appWallets } from '@/constants';
import { isMobileOrTablet } from '@/utils/userAgent';
import { isWalletAvailable } from '@/utils/walletsUtils';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import useInterval from 'use-interval';

export default function useAppWallet() {
  const { connected } = useWallet();

  const [walletId, setWalletId] = useState<WALLET_ID>(null);

  useInterval(
    () => {
      setWalletId(getAppWallet());
    },
    connected || walletId ? null : 1000,
  );

  useEffect(() => {
    if (!walletId) {
      setWalletId(getAppWallet());
    }
  }, [connected, walletId]);

  return { walletId };
}

function getAppWallet() {
  if (!isMobileOrTablet) return null;

  const appWallet = appWallets.find((id) => isWalletAvailable(id, true));
  return appWallet ?? null;
}
