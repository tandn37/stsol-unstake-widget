import {
  SolanaMobileWalletAdapter,
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
} from '@solana-mobile/wallet-adapter-mobile';
import { BaseWalletAdapter, WalletName } from '@solana/wallet-adapter-base';
import {
  BraveWalletAdapter,
  Coin98WalletAdapter,
  CoinbaseWalletAdapter,
  ExodusWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolongWalletAdapter,
  TrustWalletAdapter,
  WalletConnectWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { ElementType } from 'react';

import LedgerIcon from '@/assets/icons/wallets/ledger.svg?react';
import MathWalletIcon from '@/assets/icons/wallets/mathwallet.svg?react';
import TrustIcon from '@/assets/icons/wallets/trust.svg?react';
import FrontierIcon from '@/assets/icons/wallets/frontier.svg?react';
import { deepLink } from '@/utils/deepLinks';
import { getLedgerDerivation } from '@/utils/getLedgerDerivation';
import { getConfig } from '@/contexts/config';

const { activeSolanaChain, walletConnectProjectId, base } = getConfig();

export enum COMMON_WALLET_ID {
  WalletConnect = 'WalletConnect',
  MobileAdapter = 'MobileAdapter',
  Phantom = 'Phantom',
  Slope = 'Slope',
  Exodus = 'Exodus',
  Solflare = 'Solflare',
  Ledger = 'Ledger',
  Solong = 'Solong',
  Brave = 'Brave',
  MathWallet = 'MathWallet',
  Coin98 = 'Coin98',
  Coinbase = 'Coinbase',
  Trust = 'Trust',
}

export enum VIRTUAL_WALLET_ID {
  MA_Solflare = 'MA_Solflare',
  MA_Espresso = 'MA_Espresso',
  MA_Ultimate = 'MA_Ultimate',
  WC_Spot = 'WC_Spot',
  WC_Frontier = 'WC_Frontier',
  WC_MathWallet = 'WC_MathWallet',
  WC_Fireblocks = 'WC_Fireblocks',
  WC_Ottr = 'WC_Ottr',
  WC_Glow = 'WC_Glow',
  WC_Omni = 'WC_Omni',
  WC_SafePal = 'WC_SafePal',
  WC_Onto = 'WC_Onto',
}
export type WALLET_ID = COMMON_WALLET_ID | VIRTUAL_WALLET_ID;
export const WALLET_ID = { ...COMMON_WALLET_ID, ...VIRTUAL_WALLET_ID };

export type CustomWalletProps = Partial<{
  name: string | WalletName<string>;
  icon: string | ElementType<any>;
  url: string;
  deepLink?: ReturnType<typeof deepLink>;
  via?: COMMON_WALLET_ID;
  openInApp?: boolean;
  showOnMobile?: boolean;
  hideOnDesktop?: boolean;
  hideOnAndroid?: boolean;
  hideOnIOS?: boolean;
  alwaysAtTheEnd?: boolean;
}>;

export type WalletProps = {
  adapter: BaseWalletAdapter;
} & CustomWalletProps;

type WalletAdaptersAndProps<T extends string> = Record<T, WalletProps>;
type VirtualWalletProps = Record<
  VIRTUAL_WALLET_ID,
  WalletProps & Required<Pick<CustomWalletProps, 'name' | 'via'>>
>;

const commonWalletConfigs: WalletAdaptersAndProps<COMMON_WALLET_ID> = {
  [COMMON_WALLET_ID.Phantom]: {
    adapter: new PhantomWalletAdapter(),
    deepLink: deepLink`https://phantom.app/ul/browse/${'pageUrl'}?ref=${'refUrl'}`,
    openInApp: true,
  },
  [COMMON_WALLET_ID.Ledger]: {
    adapter: new LedgerWalletAdapter({
      derivationPath: getLedgerDerivation(),
    }),
    icon: LedgerIcon,
  },
  // [COMMON_WALLET_ID.Solflare]: {
  //   adapter: new SolflareWalletAdapter({
  //     network: activeSolanaChain as any,
  //   }),
  //   // deepLink: deepLink`https://solflare.com/ul/v1/browse/${'pageUrl'}?ref=${'refUrl'}`,
  //   openInApp: true,
  //   showOnMobile: true,
  //   hideOnAndroid: true,
  // },
  [COMMON_WALLET_ID.Coinbase]: { adapter: new CoinbaseWalletAdapter() },
  // [COMMON_WALLET_ID.Exodus]: { adapter: new ExodusWalletAdapter() },
  // [COMMON_WALLET_ID.MathWallet]: {
  //   adapter: new MathWalletAdapter(),
  //   icon: MathWalletIcon,
  // },
  // [COMMON_WALLET_ID.Brave]: { adapter: new BraveWalletAdapter() },
  // [COMMON_WALLET_ID.Coin98]: { adapter: new Coin98WalletAdapter() },
  // [COMMON_WALLET_ID.Slope]: { adapter: new SlopeWalletAdapter() },
  // [COMMON_WALLET_ID.Solong]: { adapter: new SolongWalletAdapter() },
  [COMMON_WALLET_ID.Trust]: {
    adapter: new TrustWalletAdapter(),
    icon: TrustIcon,
    deepLink: deepLink`https://link.trustwallet.com/open_url?coin_id=501&url=${'pageUrl'}`,
    openInApp: true,
  },
  [COMMON_WALLET_ID.WalletConnect]: {
    adapter: new WalletConnectWalletAdapter({
      network: activeSolanaChain as any,
      options: {
        relayUrl: 'wss://relay.walletconnect.com',
        projectId: walletConnectProjectId,
        metadata: {
          name: 'Stake Solana | Lido',
          description: 'Lido-DAO governed liquid staking protocol for the Solana blockchain',
          url: 'https://solana.lido.fi/',
          icons: [
            'https://docs.solana.lido.fi/img/stSOL.svg?react',
            'https://solana.lido.fi/favicon-32x32.png',
          ],
        },
      },
    }),
    showOnMobile: true,
    alwaysAtTheEnd: true,
  },
  [COMMON_WALLET_ID.MobileAdapter]: {
    adapter: new SolanaMobileWalletAdapter({
      cluster: activeSolanaChain,
      appIdentity: {
        name: 'Stake Solana | Lido',
        uri: 'https://solana.lido.fi',
        icon: '/favicon-32x32.png',
      },
      addressSelector: createDefaultAddressSelector(),
      authorizationResultCache: createDefaultAuthorizationResultCache(),
      onWalletNotFound: createDefaultWalletNotFoundHandler(),
    }),
    name: 'Mobile Adapter',
    showOnMobile: true,
    hideOnDesktop: true,
    alwaysAtTheEnd: true,
  },
};

const via = (id: COMMON_WALLET_ID) => ({ via: id, adapter: commonWalletConfigs[id].adapter });

/*
const virtualWalletConfigs: VirtualWalletProps = {
  [VIRTUAL_WALLET_ID.MA_Solflare]: {
    ...via(COMMON_WALLET_ID.MobileAdapter),
    name: 'Solflare',
    icon: commonWalletConfigs[COMMON_WALLET_ID.Solflare].adapter.icon,
    showOnMobile: true,
    hideOnDesktop: true,
  },
  [VIRTUAL_WALLET_ID.MA_Espresso]: {
    ...via(COMMON_WALLET_ID.MobileAdapter),
    name: 'Espresso Cash',
    icon: `${base}/wallets/espresso-cash.png`,
    showOnMobile: true,
    hideOnDesktop: true,
  },
  [VIRTUAL_WALLET_ID.MA_Ultimate]: {
    ...via(COMMON_WALLET_ID.MobileAdapter),
    name: 'Ultimate',
    icon: `${base}/wallets/ultimate.png`,
    showOnMobile: true,
    hideOnDesktop: true,
  },
  [VIRTUAL_WALLET_ID.WC_Spot]: {
    ...via(COMMON_WALLET_ID.WalletConnect),
    name: 'Spot',
    icon: `${base}/wallets/spot.webp`,
    showOnMobile: true,
  },
  [VIRTUAL_WALLET_ID.WC_Frontier]: {
    ...via(COMMON_WALLET_ID.WalletConnect),
    name: 'Frontier Wallet',
    icon: FrontierIcon,
    showOnMobile: true,
  },
  [VIRTUAL_WALLET_ID.WC_MathWallet]: {
    ...via(COMMON_WALLET_ID.WalletConnect),
    name: 'MathWallet',
    icon: commonWalletConfigs[COMMON_WALLET_ID.MathWallet].icon,
    showOnMobile: true,
    hideOnDesktop: true,
  },
  [VIRTUAL_WALLET_ID.WC_Fireblocks]: {
    ...via(COMMON_WALLET_ID.WalletConnect),
    name: 'Fireblocks',
    icon: `${base}/wallets/fireblocks.webp`,
  },
  [VIRTUAL_WALLET_ID.WC_Ottr]: {
    ...via(COMMON_WALLET_ID.WalletConnect),
    name: 'Ottr',
    icon: `${base}/wallets/ottr.webp`,
  },
  [VIRTUAL_WALLET_ID.WC_Glow]: {
    ...via(COMMON_WALLET_ID.WalletConnect),
    name: 'Glow',
    icon: `${base}/wallets/glow.png`,
  },
  [VIRTUAL_WALLET_ID.WC_Omni]: {
    ...via(COMMON_WALLET_ID.WalletConnect),
    name: 'Omni',
    icon: `${base}/wallets/omni.webp`,
  },
  [VIRTUAL_WALLET_ID.WC_SafePal]: {
    ...via(COMMON_WALLET_ID.WalletConnect),
    name: 'SafePal',
    icon: `${base}/wallets/safepal.webp`,
  },
  [VIRTUAL_WALLET_ID.WC_Onto]: {
    ...via(COMMON_WALLET_ID.WalletConnect),
    name: 'Onto',
    icon: `${base}/wallets/onto.webp`,
  },
};
*/

export const walletConfigs: WalletAdaptersAndProps<WALLET_ID> = {
  ...commonWalletConfigs,
  // ...virtualWalletConfigs,
};

export const wallets = Object.values(commonWalletConfigs).map((w) => w.adapter);

const lastWallets = Object.entries(walletConfigs)
  .filter(([, w]) => w.alwaysAtTheEnd)
  .map(([id]) => id as WALLET_ID);
const lastToTheEnd = (a: WALLET_ID, b: WALLET_ID) => lastWallets.indexOf(a) - lastWallets.indexOf(b);

const getWallets = (fn: (w: WalletProps) => boolean) =>
  Object.entries(walletConfigs)
    .filter(([, w]) => fn(w))
    .map(([id]) => id as WALLET_ID)
    .sort(lastToTheEnd);

export const allWallets = getWallets((w) => !w.via);

export const mobileWallets = getWallets((w) => w.showOnMobile || !!w.deepLink);

export const desktopWallets = getWallets((w) => !w.hideOnDesktop);

export const desktopCommonWallets = getWallets((w) => !w.hideOnDesktop && !w.via);

export const appWallets = getWallets((w) => w.openInApp);
