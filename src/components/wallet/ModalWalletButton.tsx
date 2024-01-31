import React from 'react';

import { WALLET_ID } from '@/constants';
import { getWalletProps } from '@/utils/walletsUtils';
import ConnectButton from './ConnectButton';
import WalletIcon from './WalletIcon';
import { TooltipWrapper } from './styles';

type Props = {
  walletId: WALLET_ID;
  disabled: boolean;
  flat: boolean;
  onClick: () => void;
};

const ModalWalletButton: React.FC<Props> = ({ walletId, disabled, onClick, flat }) => {
  const { name, via } = getWalletProps(walletId);

  return (
    <TooltipWrapper>
      <ConnectButton
        disabled={flat || disabled}
        flat={flat}
        icon={<WalletIcon walletId={walletId} />}
        viaIcon={via && <WalletIcon walletId={via} />}
        onClick={onClick}
      >
        {name}
      </ConnectButton>
    </TooltipWrapper>
  );
};

export default ModalWalletButton;
