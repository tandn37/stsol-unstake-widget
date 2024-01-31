import { useWallet } from '@solana/wallet-adapter-react';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { WALLET_ID } from '@/constants';
import useErrorToast from '@/hooks/useErrorToast';
import { getLedgerDerivation } from '@/utils/getLedgerDerivation';
import { getWalletAdapter, isWalletShouldOpenDeepLink, openDeepLink } from '@/utils/walletsUtils';
import { WalletError } from '@solana/wallet-adapter-base';

interface LedgerWalletAdapter {
  _derivationPath: Buffer;
}

type ConnectContextValue = {
  connect: (walletId: WALLET_ID) => void;
  disconnect: () => void;
};
const ConnectContext = React.createContext<ConnectContextValue>({
  connect: null,
  disconnect: null,
});

export const ConnectProvider = ({ children }) => {
  const wallet = useWallet();

  const { toast: errorToast } = useErrorToast();

  const [requestConnect, setRequestConnect] = useState(false);

  const tryConnect = useCallback(async () => {
    if (wallet?.wallet?.adapter) {
      try {
        setRequestConnect(false);
        // try to force connection to access adapter errors if not installed
        await wallet.wallet.adapter.connect();
      } catch (e) {
        await wallet.disconnect();
        const error = e as WalletError;
        if (error.name === 'WalletNotFoundError' || error.name === 'WalletNotReadyError') {
          errorToast(error.message);
        }
      }
    }
  }, [wallet, errorToast]);

  useEffect(() => {
    if (wallet.wallet?.adapter && !wallet.connected && !wallet.connecting && requestConnect) {
      void tryConnect();
    }
  }, [tryConnect, wallet, requestConnect]);

  const innerConnect = useCallback(
    (walletId: WALLET_ID) => {
      const { name } = getWalletAdapter(walletId);

      wallet.select(name);
      setRequestConnect(true);
    },
    [wallet],
  );

  const connect = useCallback(
    (walletId: WALLET_ID) => {
      if (isWalletShouldOpenDeepLink(walletId)) {
        openDeepLink(walletId);
        return;
      }
      if (walletId === WALLET_ID.Ledger) {
        const adapter = getWalletAdapter(walletId) as unknown as LedgerWalletAdapter;
        adapter._derivationPath = getLedgerDerivation();
      }

      innerConnect(walletId);
    },
    [innerConnect],
  );

  const disconnect = useCallback(() => {
    void wallet.disconnect();
  }, [wallet]);

  const value = useMemo(() => ({ connect, disconnect }), [connect, disconnect]);

  return <ConnectContext.Provider value={value}>{children}</ConnectContext.Provider>;
};

export const useConnect = () => useContext(ConnectContext);
