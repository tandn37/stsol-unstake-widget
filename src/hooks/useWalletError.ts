import { Adapter, WalletError } from '@solana/wallet-adapter-base';
import { useCallback } from 'react';

import { WALLET_ID } from '@/constants';
import { WalletAction, useError } from '@/contexts/ErrorProvider';
import { getWalletProps } from '@/utils/walletsUtils';

type WalletAdapterError = {
  error: WalletError;
  adapter: Adapter;
};

type ErrorMap = {
  adapterName: string;
  errors: string[];
  message: string;
  action: WalletAction;
}[];

const ERRORS_TO_SHOW: ErrorMap = [
  {
    adapterName: getWalletProps(WALLET_ID.Trust).name,
    errors: [
      'not supported chainid',
      'no assets found',
      'transaction rejected',
      'the transaction was cancelled',
    ],
    message: `Unable to connect Trust Wallet. Please check if you have multichain or Solana chain in the settings and come back here again.`,
    action: 'connect',
  },
  {
    adapterName: getWalletProps(WALLET_ID.Trust).name,
    errors: ['ledger device: unknown_error (0x6808)'],
    message: 'Please enable blind signing on your Ledger hardware wallet.',
    action: 'sign',
  },
];

export const useWalletError = () => {
  const { setError } = useError();

  return useCallback(
    (errorState?: WalletAdapterError) => {
      if (!errorState?.error) return;

      const { error, adapter } = errorState;
      const match = ERRORS_TO_SHOW.find(
        ({ adapterName, errors }) =>
          adapter.name === adapterName && errors.includes(error.message.toLowerCase()),
      );
      if (match) {
        const { message, adapterName, action } = match;
        setError({ message, adapterName, action });
      }
    },
    [setError],
  );
};
