import { MAX_WITHDRAW_COUNT } from '@lidofinance/solido-sdk';
import type { StakeAccount } from '@lidofinance/solido-sdk/dist/esm/core/src/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { FC, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSDK } from './sdk';
import { getWithdrawableAccounts } from '../utils/getWithdrawableAccounts';

export type WithdrawDavaValue = {
  loading: boolean;
  amountToWithdraw: number;
  amountInPending: number;
  countToWithdraw: number;
  countInPending: number;
  accounts: StakeAccount[];
  selection: ReturnType<typeof useWithdrawSelection>;
  updateAccounts: () => void;
};

const WithdrawDataContext = createContext<WithdrawDavaValue | null>(null);

export const WithdrawDataProvider: FC = ({ children }) => {
  const { publicKey } = useWallet();
  const sdk = useSDK();

  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<StakeAccount[]>([]);

  const loadAccounts = useCallback(
    async (verbose = false) => {
      if (!publicKey) {
        setAccounts([]);
        setLoading(false);
        return;
      }

      if (verbose) setLoading(true);
      try {
        // @ts-ignore
        const response = await getWithdrawableAccounts(sdk.connection, publicKey);
        setAccounts(response);
      } catch (err) {
        console.log('err', err);
        setAccounts([]);
      }
      setLoading(false);
    },
    [sdk, publicKey],
  );

  useEffect(() => {
    void loadAccounts(true);
  }, [loadAccounts]);

  const updateAccounts = useCallback(() => {
    void loadAccounts();
  }, [loadAccounts]);

  const selection = useWithdrawSelection(accounts);

  const amountToWithdraw = useMemo(
    () => accounts.reduce((acc, curr) => (curr.isReady ? acc + curr.lamports : acc), 0),
    [accounts],
  );

  const amountInPending = useMemo(
    () => accounts.reduce((acc, curr) => (!curr.isReady ? acc + curr.lamports : acc), 0),
    [accounts],
  );

  const countToWithdraw = useMemo(() => accounts.filter((curr) => curr.isReady).length, [accounts]);

  const countInPending = useMemo(() => accounts.filter((curr) => !curr.isReady).length, [accounts]);

  const value = useMemo(
    () => ({
      amountToWithdraw,
      amountInPending,
      countToWithdraw,
      countInPending,
      accounts,
      loading,
      updateAccounts,
      selection,
    }),
    [
      amountToWithdraw,
      amountInPending,
      countToWithdraw,
      countInPending,
      accounts,
      loading,
      updateAccounts,
      selection,
    ],
  );
  return <WithdrawDataContext.Provider value={value}>{children}</WithdrawDataContext.Provider>;
};

export const useWithdrawData = () => useContext(WithdrawDataContext);

const useWithdrawSelection = (accounts: StakeAccount[] | null) => {
  const [state, setSelectionState] = useState<{
    selection_set: Set<string>;
  }>({ selection_set: new Set() });

  const withdrawableIdToIndex = useMemo(
    () =>
      accounts
        .filter((a) => a.isReady)
        .reduce((map, cur, i) => ({ ...map, [cur.pubkey.toString()]: i }), {} as { [key: string]: number }),
    [accounts],
  );

  const selectedItems = useMemo(() => {
    if (!accounts) return [];
    return Array.from(state.selection_set.keys())
      .filter((key) => key in withdrawableIdToIndex)
      .map((key) => accounts[withdrawableIdToIndex[key]]);
  }, [accounts, withdrawableIdToIndex, state]);

  const selectedCount = selectedItems.length;

  const selectedAmount = useMemo(
    () => selectedItems.reduce((acc, item) => acc + item.lamports, 0),
    [selectedItems],
  );

  const isSelected = useCallback(
    (key: PublicKey) =>
      Boolean(state.selection_set.has(key.toString()) && key.toString() in withdrawableIdToIndex),
    [state, withdrawableIdToIndex],
  );

  const setSelected = useCallback(
    (key: PublicKey, value: boolean) => {
      setSelectionState((old) => {
        if (value && selectedCount >= MAX_WITHDRAW_COUNT) return old;
        if (value) old.selection_set.add(key.toString());
        else old.selection_set.delete(key.toString());
        return { selection_set: old.selection_set };
      });
    },
    [selectedCount],
  );

  const setSelectedMany = useCallback(() => {
    const freeSpace = MAX_WITHDRAW_COUNT - selectedCount;
    if (freeSpace <= 0) return;
    const keys = accounts.filter((a) => a.isReady && !isSelected(a.pubkey)).map((a) => a.pubkey);
    setSelectionState((old) => {
      keys.slice(0, freeSpace).forEach((k) => old.selection_set.add(k.toString()));
      return { selection_set: old.selection_set };
    });
  }, [selectedCount, accounts, isSelected]);

  const setUnselectedAll = useCallback(() => {
    setSelectionState(() => ({ selection_set: new Set() }));
  }, []);

  // populate state
  const isEmptyData = !accounts?.length;
  useEffect(() => {
    if (isEmptyData) {
      setUnselectedAll();
    } else {
      setSelectedMany();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmptyData]);

  return {
    isSelected,
    setSelected,
    setSelectedMany,
    setUnselectedMany: setUnselectedAll,
    selectedCount,
    selectedAmount,
    canSelectMore: selectedCount < MAX_WITHDRAW_COUNT,
  };
};
