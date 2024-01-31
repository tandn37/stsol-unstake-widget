import { ReactElement, useCallback, useState } from 'react';

import { WALLET_ID } from '@/constants';
import { getConflictingWalletsText } from '@/utils/walletConflicts';
import { getWalletProps, isWalletReadyToUse } from '@/utils/walletsUtils';
import WalletIcon from './WalletIcon';
import { getExtensionError } from './walletsRequirmentsTexts';

export type RequirementsData = {
  icon?: ReactElement;
  title?: string;
  text?: string | ReactElement;
};

export const useRequirements = () => {
  const [requirements, setRequirements] = useState<RequirementsData>(null);

  const hideRequirements = useCallback(() => {
    setRequirements(null);
  }, [setRequirements]);

  const isHaveRequirements = useCallback((walletId: WALLET_ID) => {
    const notAvailableWallet = !isWalletReadyToUse(walletId);
    const conflictText = getConflictingWalletsText(walletId);

    switch (true) {
      case notAvailableWallet:
        const error = getExtensionError(walletId);
        setRequirements({
          icon: <WalletIcon walletId={walletId} inPopup />,
          title: error.title,
          text: error.text,
        });
        return true;
      case !!conflictText:
        setRequirements({
          icon: <WalletIcon walletId={walletId} inPopup />,
          title: `${getWalletProps(walletId).name} couldn't connect`,
          text: conflictText,
        });
        return true;

      default:
        return false;
    }
  }, []);

  return {
    requirements,
    hideRequirements,
    isHaveRequirements,
  };
};
