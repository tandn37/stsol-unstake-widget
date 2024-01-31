import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useCallback, useContext, useEffect, useState } from 'react';
import { LedgerContext } from './LedgerContext';
import { generatePaths, getPathPublicKey } from './utils';
import { AccountRecord, DerivationPath, GeneratePathsParams } from './types';

export const useLedger = () => useContext(LedgerContext);

export const useLedgerAccounts = ({ derivationLength, perPage, page }: GeneratePathsParams) => {
  const { transport, reconnect, setError } = useLedger();
  const { connection } = useConnection();
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);

  const loadAccounts = useCallback(
    async (params: GeneratePathsParams) => {
      if (!transport.current) return;

      const paths = generatePaths(params);

      const addressList: [DerivationPath, PublicKey][] = [];
      try {
        for await (const path of paths) {
          const pubkey = await getPathPublicKey(transport.current, path);
          addressList.push([path, pubkey]);
        }
      } catch (e) {
        return;
      }

      const pubkeys = addressList.map(([, pubkey]) => pubkey);
      const info =
        pubkeys.length > 0 ? await connection.getMultipleAccountsInfo(pubkeys).catch(() => []) : [];

      return addressList.map(([path, pubkey], index) => ({
        path,
        address: pubkey.toString(),
        balance: info[index]?.lamports || 0,
      })) as AccountRecord[];
    },
    [connection, transport],
  );

  useEffect(() => {
    void (async () => {
      await reconnect();
      setAccounts([]);

      try {
        const _accounts = await loadAccounts({ derivationLength, perPage, page });
        if (_accounts?.length) {
          setAccounts(_accounts);
        }
      } catch (e) {
        setError(e);
      }
    })();
  }, [loadAccounts, derivationLength, page, perPage, reconnect, setError]);

  return accounts;
};
