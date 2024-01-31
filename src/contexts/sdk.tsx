import { SolidoSDK } from '@lidofinance/solido-sdk';
import { createContext, useContext, useMemo } from 'react';

import useChain from '@/hooks/useChain';
import { useConnection } from '@solana/wallet-adapter-react';

export const SdkContext = createContext<{ sdk: SolidoSDK }>({ sdk: undefined });

export const SdkProvider = ({ children }) => {
  const chain = useChain();
  const { connection } = useConnection();

  const solidoSDK = useMemo(() => {
    if (connection) {
      return new SolidoSDK(chain, connection);
    }
    return null;
  }, [connection, chain]);

  const ctxValue = useMemo(() => ({ sdk: solidoSDK }), [solidoSDK]);

  return <SdkContext.Provider value={ctxValue}>{children}</SdkContext.Provider>;
};

export const useSDK = () => useContext(SdkContext).sdk;
