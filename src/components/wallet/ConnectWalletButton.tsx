import { useCallback } from 'react';
import { css } from 'styled-components';

import BlueButton from '@/components/BlueButton';
import { useConnect } from '@/contexts/ConnectProvider';
import { MODAL_ID, useModal } from '@/contexts/modals';
import useAppWallet from '@/hooks/useAppWallet';
import { getWalletProps } from '@/utils/walletsUtils';
import WalletIcon from './WalletIcon';

type Props = {
  inHeader?: boolean;
};

const ConnectWalletButton: React.FC<Props> = ({ inHeader = false }) => {
  const { handleOpen } = useModal(MODAL_ID.CONNECT);
  const { walletId } = useAppWallet();
  const { connect } = useConnect();
  const { name } = getWalletProps(walletId);

  const handleClick = useCallback(() => {
    if (walletId) {
      connect(walletId);
      return;
    }
    handleOpen();
  }, [connect, handleOpen, walletId]);

  const styles = inHeader
    ? css`
        font-size: 12px;
        padding: 12px 20px;
      `
    : undefined;

  return (
    <BlueButton onClick={handleClick} css={styles}>
      {walletId && <WalletIcon walletId={walletId} inButton inHeader={inHeader} />}
      {inHeader || !name ? 'Connect wallet' : `Connect ${name} wallet`}
    </BlueButton>
  );
};

export default ConnectWalletButton;
