import React from 'react';
import { WALLET_ID } from '@/constants';
import { getWalletProps, isWalletAvailable } from './walletsUtils';

const getDefaultText = (walletId: WALLET_ID, conflictingWalletId: WALLET_ID) => (
  <>
    Your browser has a turned-on “{getWalletProps(conflictingWalletId).name}” extension. Please, turn off this
    extension and reload the page to enable {getWalletProps(walletId).name}.
  </>
);

const getMathWalletConflicts = (): React.ReactElement | undefined => {
  switch (true) {
    case isWalletAvailable(WALLET_ID.Exodus):
      return getDefaultText(WALLET_ID.MathWallet, WALLET_ID.Exodus);
    default:
      return undefined;
  }
};

const getPhantomConflicts = (): React.ReactElement | undefined => {
  switch (true) {
    case isWalletAvailable(WALLET_ID.Exodus):
      return getDefaultText(WALLET_ID.Phantom, WALLET_ID.Exodus);
    case isWalletAvailable(WALLET_ID.MathWallet):
      return getDefaultText(WALLET_ID.Phantom, WALLET_ID.MathWallet);
    default:
      return undefined;
  }
};

// checks if there are any collisions for wallets
export const getConflictingWalletsText = (walletId: WALLET_ID): React.ReactElement | undefined => {
  switch (walletId) {
    case WALLET_ID.MathWallet:
      return getMathWalletConflicts();

    case WALLET_ID.Phantom:
      return getPhantomConflicts();

    default:
      return undefined;
  }
};
