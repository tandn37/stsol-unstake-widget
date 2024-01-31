import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useSDK } from '@/contexts/sdk';

type ProtocolState = {
  loading: boolean;
  isUnstakeDisabled: boolean;
};

export const ProtocolStateContext = createContext<ProtocolState>({
  loading: true,
  isUnstakeDisabled: false,
});

export const ProtocolStateProvider = ({ children }) => {
  const sdk = useSDK();

  const [isUnstakeDisabled, setUnstakeDisabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sdk) {
      return;
    }

    void sdk.isUnStakeAvailable().then((isUnStakeAvailable) => {
      setUnstakeDisabled(!isUnStakeAvailable);
      setLoading(false);
    });
  }, [sdk]);

  const ctxValue = useMemo(() => ({ loading, isUnstakeDisabled }), [loading, isUnstakeDisabled]);

  return <ProtocolStateContext.Provider value={ctxValue}>{children}</ProtocolStateContext.Provider>;
};

export const useUnstakeDisabled = () => useContext(ProtocolStateContext);
