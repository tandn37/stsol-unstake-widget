import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo, useState } from 'react';
import useInterval from 'use-interval';

import { WALLET_ID, desktopCommonWallets, desktopWallets, mobileWallets } from '@/constants';
import { isMobileOrTablet } from '@/utils/userAgent';
import { isWalletReadyToUse } from '@/utils/walletsUtils';

enum PrimaryTitle {
  mobile = 'No mobile wallets detected',
  desktop = 'No desktop wallets detected',
  default = 'Connect wallet',
}

enum PrimaryDisabledText {
  mobile = 'Unfortunately we haven’t detected any wallets on your device. You can find a list of supported mobile wallets below:',
  desktop = 'Unfortunately we haven’t detected any wallets on your device. You can find a list of supported desktop wallets below:',
}

enum SecondaryTitle {
  mobile = 'Supported mobile wallets',
  desktop = 'Supported desktop wallets',
  default = 'Not detected wallets',
}

export function useAvailableWallets() {
  const currentPlatformWallets = isMobileOrTablet ? mobileWallets : desktopWallets;
  const { connected } = useWallet();

  const [readyWallets, setReadyWallets] = useState<WALLET_ID[]>([]);

  useInterval(
    () => {
      const _readyWallets = currentPlatformWallets.filter(isWalletReadyToUse);
      if (JSON.stringify(_readyWallets) !== JSON.stringify(readyWallets)) {
        setReadyWallets(_readyWallets);
      }
    },
    connected ? null : 1000,
  );

  return useMemo(() => {
    const primaryWallets = readyWallets.length > 0 ? readyWallets : currentPlatformWallets;
    const primaryTitle =
      readyWallets.length > 0
        ? PrimaryTitle.default
        : isMobileOrTablet
        ? PrimaryTitle.mobile
        : PrimaryTitle.desktop;
    const primaryDisabledText =
      readyWallets.length === 0
        ? isMobileOrTablet
          ? PrimaryDisabledText.mobile
          : PrimaryDisabledText.desktop
        : undefined;

    const isShownAllAvailableWallets = primaryWallets.length === currentPlatformWallets.length;

    const secondaryWallets = isMobileOrTablet
      ? desktopCommonWallets.filter((w) => !primaryWallets.includes(w))
      : isShownAllAvailableWallets
      ? mobileWallets.filter((w) => !primaryWallets.includes(w))
      : desktopCommonWallets.filter((w) => !primaryWallets.includes(w));
    const secondaryTitle = isMobileOrTablet
      ? SecondaryTitle.desktop
      : isShownAllAvailableWallets
      ? SecondaryTitle.mobile
      : SecondaryTitle.default;

    return {
      primaryWallets,
      primaryTitle,
      primaryDisabledText,
      secondaryWallets,
      secondaryTitle,
    };
  }, [currentPlatformWallets, readyWallets]);
}
