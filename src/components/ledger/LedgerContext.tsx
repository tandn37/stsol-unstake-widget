import type Transport from '@ledgerhq/hw-transport';
import {
  FC,
  MutableRefObject,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getTransport } from './utils';

export const LedgerContext = createContext<{
  transport: MutableRefObject<Transport>;
  isConnected: boolean;
  error: Error | null;
  setError: (e: Error | null) => void;
  reconnect: () => Promise<void>;
}>(null);

export const LedgerProvider: FC<{ active: boolean }> = ({ active, children }) => {
  const transport = useRef<Transport | null>(null);
  const [error, setError] = useState<Error>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(async () => {
    if (transport.current) return;

    setError(null);
    try {
      const t = await getTransport();
      transport.current = t;
      setIsConnected(true);
    } catch (e) {
      transport.current = null;
      setError(e);
      setIsConnected(false);
    }
  }, []);

  const close = useCallback(async (sileng = false) => {
    if (!transport.current) return;
    await transport.current.close();
    transport.current = null;
    if (!sileng) {
      setIsConnected(false);
    }
  }, []);

  const reconnect = useCallback(async () => {
    await close(true);
    await connect();
  }, [close, connect]);

  useEffect(() => {
    if (active) {
      void connect();
    } else {
      void close();
    }
  }, [active, close, connect]);

  const value = useMemo(
    () => ({
      transport,
      isConnected,
      error,
      setError,
      reconnect,
    }),
    [isConnected, error, reconnect],
  );

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
};
