import useSolanaExplorerLink from '@/hooks/useSolanaExplorerLink';
import { shortenAddress } from '@/utils/shortenAddress';
import { Link } from '@lidofinance/lido-ui';
import { PublicKey } from '@solana/web3.js';
import React, { FC } from 'react';
import { isMobile } from 'react-device-detect';

type Props = {
  account: PublicKey | string;
  asLink?: boolean;
};

export const AccountAddress: FC<Props> = ({ account, asLink }) => {
  const href = useSolanaExplorerLink(account, 'address');
  const text = shortenAddress(account, isMobile);
  if (asLink) {
    return <Link href={href}>{text}</Link>;
  }
  return <span>{text}</span>;
};
