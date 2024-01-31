import { Link } from '@lidofinance/lido-ui';

import BlueButton from '@/components/BlueButton';
import { WALLET_ID } from '@/constants';
import { openWindow } from '@/utils/openWindow';
import { getWalletProps } from '@/utils/walletsUtils';
import { Description } from './styles';

const getBraveError = () => ({
  title: `Brave wallet couldn't connect`,
  text: (
    <>
      If you are using the Brave browser, please, set &quot;Default cryptocurrency wallet&quot; to &quot;Brave
      Wallet&quot; in Settings and reload the page. Otherwise, you need to install{' '}
      <Link href="https://brave.com/">Brave browser </Link> to use
      <Link href={getWalletProps(WALLET_ID.Brave).url}> Brave Wallet </Link>.
    </>
  ),
});

const getTrustError = () => ({
  title: `Trust Wallet couldn't connect`,
  text: <>It is available only on iOS and Android devices.</>,
});

const getDefaultError = (walletId: WALLET_ID) => ({
  title: 'Extension required',
  text: (
    <>
      <Description>
        <>
          We couldn&apos;t detect{' '}
          <Link href={getWalletProps(walletId).url}>{getWalletProps(walletId).name} </Link> extension in you
          browser. Please visit the store to install the extension.
        </>
      </Description>
      <BlueButton
        size="sm"
        fullwidth
        onClick={() => {
          openWindow(getWalletProps(walletId).url);
        }}
      >
        Browse extension
      </BlueButton>
    </>
  ),
});

export const getExtensionError = (walletId) => {
  switch (true) {
    case walletId === WALLET_ID.Trust:
      return getTrustError();
    case walletId === WALLET_ID.Brave:
      return getBraveError();
    default:
      return getDefaultError(walletId);
  }
};
