import { Button, Modal, Warning } from '@lidofinance/lido-ui';
import styled from 'styled-components';

import { MODAL_ID, ModalProps, useModal } from '@/contexts/modals';
import { isMobileOrTablet } from '@/utils/userAgent';
import { useError } from '@/contexts/ErrorProvider';

import LedgerError from '@/assets/ledger/error.svg?react';
import { WALLET_ID } from '@/constants';

const TextStyled = styled.p`
  font-size: 14px;
  line-height: 24px;
`;

const ButtonStyled = styled(Button)`
  font-weight: 400;
`;

const Stack = styled.div`
  > * {
    margin-bottom: 16px;
  }
  > *:last-child {
    margin-bottom: 0;
  }
`;

export default function WalletErrorModal({ ...props }: ModalProps) {
  const { handleOpen } = useModal(MODAL_ID.CONNECT);
  const { error } = useError();
  const showBackButton = error?.action === 'connect' && !isMobileOrTablet;

  const title = error?.action === 'connect' ? 'Error connecting' : 'Something went wrong';
  const message =
    error?.message ??
    'The connection attempt failed. Please click try again and follow the steps to connect in your wallet.';
  const icon = error?.adapterName === WALLET_ID.Ledger ? <LedgerError /> : <Warning />;

  return (
    <Modal {...props} center title={title} titleIcon={icon}>
      <Stack>
        <TextStyled>{message}</TextStyled>
        {showBackButton && (
          <ButtonStyled variant="ghost" fullwidth onClick={handleOpen}>
            Back to wallet
          </ButtonStyled>
        )}
      </Stack>
    </Modal>
  );
}
