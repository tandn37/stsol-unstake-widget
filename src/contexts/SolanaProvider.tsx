import { CONFIRM_TRANSACTION_INITIAL_TIMEOUT, CONNECTOR_NAME, wallets } from '@/constants';
import { ConnectProvider } from '@/contexts/ConnectProvider';
import { AccountProvider } from '@/contexts/account';
import { ProtocolStateProvider } from '@/contexts/protocolState';
import { SdkProvider } from '@/contexts/sdk';
import useErrorToast from '@/hooks/useErrorToast';
import { useWalletError } from '@/hooks/useWalletError';
import { getErrorConnectionText } from '@/utils/getErrorConnectionText';
import { Adapter, WalletDisconnectedError, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { ConnectionConfig } from '@solana/web3.js';
import { useCallback, useMemo } from 'react';
import { getConfig } from '@/contexts/config';

export default function SolanaProviders({ children }) {
  const { rpcEndpoint } = getConfig();
  const { toast: errorToast } = useErrorToast();
  const setWalletError = useWalletError();

  const connectionConfig: ConnectionConfig = useMemo(
    () => ({
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: CONFIRM_TRANSACTION_INITIAL_TIMEOUT,
    }),
    [],
  );

  const onError = useCallback(
    (error: WalletError, adapter?: Adapter) => {
      // onError triggers on every manual disconnecting, so we should select real errors
      if (!(error instanceof WalletDisconnectedError)) {
        errorToast(getErrorConnectionText(error.message));
        setWalletError({ error, adapter });
      }
    },
    [errorToast, setWalletError],
  );

  return (
    <ConnectionProvider endpoint={rpcEndpoint} config={connectionConfig}>
      <SdkProvider>
        <WalletProvider localStorageKey={CONNECTOR_NAME} autoConnect wallets={wallets} onError={onError}>
          <ConnectProvider>
            <AccountProvider>
              <ProtocolStateProvider>{children}</ProtocolStateProvider>
            </AccountProvider>
          </ConnectProvider>
        </WalletProvider>
      </SdkProvider>
    </ConnectionProvider>
  );
}
