import { CustomWalletProps, WALLET_ID, walletConfigs } from '@/constants';
import { getDeepLink } from '@/utils/deepLinks';
import { redirect } from '@/utils/redirect';
// import { isMobileOrTablet } from '@/utils/userAgent';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { isAndroid, isIOS, isMobileOrTablet } from './userAgent';

const props = ({ name, icon, url, via, deepLink, hideOnAndroid, hideOnIOS }: CustomWalletProps) => ({
  name,
  icon,
  url,
  via,
  deepLink,
  hideOnAndroid,
  hideOnIOS,
});

export const getWalletProps = (walletId: WALLET_ID) =>
  props({
    ...walletConfigs[walletId]?.adapter,
    ...walletConfigs[walletId],
  });

export const getWalletAdapter = (walletId: WALLET_ID) => walletConfigs[walletId].adapter;

export const isWalletAvailable = (walletId: WALLET_ID, onlyInstalled = false) =>
  walletConfigs[walletId]?.adapter?.readyState === WalletReadyState.Installed ||
  (!onlyInstalled && walletConfigs[walletId]?.adapter?.readyState === WalletReadyState.Loadable);

// @note deepLink available only for mobile or tablet
export const isWalletHasDeepLink = (walletId: WALLET_ID) =>
  isMobileOrTablet && !!getWalletProps(walletId)?.deepLink;

export const isWalletPlatformDisabled = (walletId: WALLET_ID) =>
  (isIOS && getWalletProps(walletId)?.hideOnIOS) || (isAndroid && getWalletProps(walletId)?.hideOnAndroid);

// @note the wallet state is Installed or Loadable or it has deepLink and platform not disabled
export const isWalletReadyToUse = (walletId: WALLET_ID) =>
  (isWalletAvailable(walletId) || isWalletHasDeepLink(walletId)) && !isWalletPlatformDisabled(walletId);

// @note the wallet state is not Installed and it has deepLink
export const isWalletShouldOpenDeepLink = (walletId: WALLET_ID) =>
  !isWalletAvailable(walletId, true) && isWalletHasDeepLink(walletId);

export const openDeepLink = (walletId: WALLET_ID) => {
  const { deepLink } = getWalletProps(walletId);

  if (deepLink) {
    redirect(getDeepLink(deepLink));
    return true;
  }
  return false;
};
