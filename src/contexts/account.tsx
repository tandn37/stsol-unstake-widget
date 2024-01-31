import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useSDK } from './sdk';

type AddressWithBalance = {
  address?: PublicKey;
  balanceInLamports: number;
};

type AccountContext = {
  address?: PublicKey;
  active: boolean;
  balanceInLamports: number;
  stSol: AddressWithBalance;
  stSolAccountsList: Required<AddressWithBalance>[];
  setActiveStSolAccount: (address: PublicKey) => void;
};

const initialStSolAccount: AddressWithBalance = { address: undefined, balanceInLamports: 0 };

const initialValue: AccountContext = {
  address: undefined,
  active: false,
  balanceInLamports: 0,
  stSol: initialStSolAccount,
  stSolAccountsList: [],
  setActiveStSolAccount: () => {},
};

const AccountContext = createContext<AccountContext>(initialValue);

export const useSolBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balanceInLamports, setBalanceInLamports] = useState(0);

  useEffect(() => {
    if (!connection || !publicKey) {
      setBalanceInLamports(0);
      return;
    }

    void (async function update() {
      const accountInfo = await connection.getAccountInfo(publicKey);
      setBalanceInLamports(accountInfo?.lamports ?? 0);
    })();

    const id = connection.onAccountChange(publicKey, (accountInfo) => {
      setBalanceInLamports(accountInfo?.lamports ?? 0);
    });

    return () => void connection.removeAccountChangeListener(id);
  }, [connection, publicKey]);

  return balanceInLamports;
};

export const useStSolAccount = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const sdk = useSDK();

  const [stSolAccountsList, setStSolAccountsList] = useState<Required<AddressWithBalance>[]>([]);
  const [stSolAccount, setStSolAccount] = useState<AddressWithBalance>(initialStSolAccount);

  useEffect(() => {
    void (async function update() {
      const accounts = (sdk && publicKey && (await sdk.getStSolAccountsForUser(publicKey))) || [];
      setStSolAccountsList(accounts);
      setStSolAccount(accounts[0] ?? initialStSolAccount);
    })();
  }, [sdk, publicKey]);

  useEffect(() => {
    if (!connection || !stSolAccount.address) {
      setStSolAccount(initialStSolAccount);
      return;
    }

    async function updateBalance() {
      let balanceInLamports: number;
      try {
        const { value } = await connection.getTokenAccountBalance(stSolAccount.address);
        balanceInLamports = +value.amount;
      } catch {
        balanceInLamports = 0;
      }

      setStSolAccount((prev) => ({
        ...prev,
        balanceInLamports,
      }));
    }
    void updateBalance();

    // @note can we parse accountInfo to get current tokenAccountBalance?
    const id = connection.onAccountChange(stSolAccount.address, () => void updateBalance());
    return () => void connection.removeAccountChangeListener(id);
  }, [stSolAccount.address, connection]);

  const setActiveStSolAccount = useCallback(
    (address) => {
      const activeAccount = stSolAccountsList.find((a) => a.address === address);
      setStSolAccount(activeAccount ?? { address, balanceInLamports: 0 });
    },
    [stSolAccountsList],
  );

  return useMemo(
    () => ({ stSolAccount, stSolAccountsList, setActiveStSolAccount }),
    [stSolAccount, stSolAccountsList, setActiveStSolAccount],
  );
};

export const AccountProvider = ({ children }) => {
  const { publicKey } = useWallet();

  const balance = useSolBalance();
  const { stSolAccount, stSolAccountsList, setActiveStSolAccount } = useStSolAccount();

  const value: AccountContext = useMemo(
    () => ({
      active: !!publicKey,
      address: publicKey ?? undefined,
      balanceInLamports: balance,
      stSol: stSolAccount,
      stSolAccountsList,
      setActiveStSolAccount,
    }),
    [balance, publicKey, stSolAccount, stSolAccountsList, setActiveStSolAccount],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

export const useAccount = () => useContext(AccountContext);
