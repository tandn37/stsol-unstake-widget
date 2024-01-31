import React from 'react';

import { WALLET_ID } from '@/constants';

import { getWalletProps } from '@/utils/walletsUtils';
import { Box } from '@lidofinance/lido-ui';

type Props = {
  walletId: WALLET_ID;
  inPopup?: boolean;
  inButton?: boolean;
  inHeader?: boolean;
};

const WalletIcon: React.FC<Props> = ({ walletId, inPopup, inButton, inHeader }) => {
  const width = inPopup ? 64 : inHeader ? 28 : 40;
  const { name, icon } = getWalletProps(walletId);
  const Icon = typeof icon === 'function' ? icon : undefined;
  const src = typeof icon === 'string' ? icon : undefined;

  return (
    <Box display="flex" width={width} paddingRight={inButton ? (inHeader ? 8 : 12) : undefined}>
      {src ? (
        <img alt={name} width={width} height={width} src={src} />
      ) : Icon ? (
        <Icon width={width} height={width} />
      ) : null}
    </Box>
  );
};

export default WalletIcon;
