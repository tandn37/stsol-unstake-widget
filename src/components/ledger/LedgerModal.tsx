import { Modal } from '@lidofinance/lido-ui';
import { useCallback } from 'react';
import styled from 'styled-components';

import { WALLET_ID } from '@/constants';
import { useConnect } from '@/contexts/ConnectProvider';
import { ModalProps } from '@/contexts/modals';
import { savePath } from '@/utils/getLedgerDerivation';
import { AccountsScreen } from './AccountsScreen';
import { ConnectionScreen } from './ConnectionScreen';
import { ErrorScreen } from './ErrorScreen';
import { LedgerProvider } from './LedgerContext';
import { DerivationPath } from './types';
import { useLedger } from './useLedger';

export const TextStyled = styled.p`
  font-size: 14px;
  line-height: 24px;
`;

// TODO: pagination and limit 20
export default function LedgerModal({ open, onClose }: ModalProps) {
  const handleClose = useCallback(
    (event) => {
      // @note hack for prevent close Modal on close Select
      if (!event) return;
      onClose();
    },
    [onClose],
  );

  return (
    <Modal open={open} onClose={handleClose} title="Ledger connect">
      <LedgerProvider active={open}>
        <LedgerScreen onClose={handleClose} />
      </LedgerProvider>
    </Modal>
  );
}

function LedgerScreen({ onClose }: { onClose: (event?: any) => void }) {
  const { isConnected, error, reconnect } = useLedger();
  const { connect } = useConnect();

  const handleAccountSelect = useCallback(
    (path: DerivationPath) => {
      savePath(path);
      onClose(true);
      connect(WALLET_ID.Ledger);
    },
    [connect, onClose],
  );

  return error ? (
    <ErrorScreen message={error.message} reset={() => void reconnect()} />
  ) : isConnected ? (
    <AccountsScreen onSelect={handleAccountSelect} />
  ) : (
    <ConnectionScreen />
  );
}
