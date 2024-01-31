import React from 'react';

import { WALLET_ID } from '@/constants';
import { NOOP } from '@/utils/noop';
import ModalWalletButton from './ModalWalletButton';
import { WalletsButtonsContainer } from './styles';

type Props = {
  wallets: WALLET_ID[];
  disabled?: boolean;
  flat?: boolean;
  onClick?: (id: WALLET_ID) => void;
};

const WalletsList: React.FC<Props> = ({ wallets: walletIds, disabled, flat, onClick = NOOP }) => (
  <WalletsButtonsContainer>
    {walletIds.map((walletId) => (
      <ModalWalletButton
        key={walletId}
        walletId={walletId}
        disabled={disabled}
        flat={flat}
        onClick={() => onClick(walletId)}
      />
    ))}
  </WalletsButtonsContainer>
);

export default WalletsList;
