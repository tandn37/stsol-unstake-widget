import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { MODAL_ID, useModal } from './modals';

export type WalletAction = 'connect' | 'disconnect' | 'sign';

export type ErrorProps = {
  message: string;
  action: WalletAction;
  adapterName: string;
};

export type ErrorContext = {
  error: ErrorProps | undefined;
  setError(value: ErrorProps): void;
};

export const ErrorContext = createContext<ErrorContext>({ error: undefined, setError: () => {} });

export const ErrorProvider = ({ children }) => {
  const { handleOpen } = useModal(MODAL_ID.ERROR);
  const [error, setError] = useState<ErrorProps | undefined>();

  const handleError = useCallback(
    (_error: ErrorProps) => {
      setError(_error);
      handleOpen();
    },
    [handleOpen],
  );

  const value = useMemo(() => ({ error, setError: handleError }), [error, handleError]);

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
};

export const useError = () => useContext(ErrorContext);
