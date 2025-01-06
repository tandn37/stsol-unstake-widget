import { Link } from '@lidofinance/lido-ui';
import { useMemo } from 'react';
import styled from 'styled-components';

import useSolanaExplorerLink, { ExplorerLinkEntity } from '@/hooks/useSolanaExplorerLink';
import { TX_STAGE } from '@lidofinance/solido-sdk';

import RoundCheckIcon from '@/assets/icons/check-round.svg?react';
import RoundCrossIcon from '@/assets/icons/cross-round.svg?react';

import Modal from '@/components/base/Modal';
import Spinner from '@/components/base/Spinner';

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 38px;
`;

const BoldText = styled.p`
  font-size: 16px;
  line-height: 26px;
  font-weight: 500;
  margin: 24px 0 8px;
`;

const LightText = styled.p`
  font-size: 14px;
  margin-bottom: 42px;
  hyphens: auto;
  color: #ffffff;
`;

const InstructionText = styled.p`
  font-size: 12px;
  color: #ffffff;
  opacity: 0.5;
  margin-bottom: 18px;
`;

const SolanaExplorerLink = styled(Link)`
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  color: ${(props) => props.theme.colors.primary};
  margin-top: 18px;
`;

export type WithdrawTxModalProps = {
  stage: TX_STAGE;
  txAmount: number;
  explorerLinkParams: {
    value: string;
    entity: ExplorerLinkEntity;
  };
  restakeIsChecked?: boolean;
  txError: string;
  onClose: () => void;
};

export default function WithdrawTxModal({
  stage,
  txAmount,
  explorerLinkParams,
  txError,
  restakeIsChecked,
  onClose,
}: WithdrawTxModalProps) {
  const txLink = useSolanaExplorerLink(explorerLinkParams?.value, explorerLinkParams?.entity);

  const content = useMemo(() => {
    switch (stage) {
      case TX_STAGE.AWAITING_SIGNING:
        return (
          <>
            <Spinner />
            <BoldText>You are now withdrawing {restakeIsChecked ? 'and restaking' : ''} {txAmount} SOL</BoldText>
            <LightText>Processing your request</LightText>
            <InstructionText>Confirm this transaction in your wallet</InstructionText>
          </>
        );
      case TX_STAGE.AWAITING_BLOCK:
        return (
          <>
            <Spinner />
            <BoldText>You are now withdrawing {restakeIsChecked ? 'and restaking' : ''} {txAmount} SOL</BoldText>
            <LightText>
              Transaction Approved. Waiting for transaction to be confirmed on the blockchain (MAX
              confirmation = ~32)
            </LightText>
            <InstructionText>Check the transaction status on Block Explorer</InstructionText>
            {txLink && <SolanaExplorerLink href={txLink}>View on Block Explorer</SolanaExplorerLink>}
          </>
        );
      case TX_STAGE.SUCCESS:
        return (
          <>
            <RoundCheckIcon />
            <BoldText>{txAmount} SOL has been withdrawn {restakeIsChecked ? 'and restaked' : ''}</BoldText>
            <LightText>Withdraw {restakeIsChecked ? 'and restake' : ''} operation was successful</LightText>

            {txLink && <SolanaExplorerLink href={txLink}>View on Block Explorer</SolanaExplorerLink>}
          </>
        );
      case TX_STAGE.ERROR:
        return (
          <>
            <RoundCrossIcon />
            <BoldText>Something went wrong</BoldText>
            {/* "de" is necessary for the correct hyphens in words */}
            <div lang="de">
              <LightText>{txError}</LightText>
            </div>

            {txLink && <SolanaExplorerLink href={txLink}>View on Block Explorer</SolanaExplorerLink>}
          </>
        );
      default:
        return null;
    }
  }, [stage, txAmount, txLink, txError]);

  return (
    <Modal open={stage !== TX_STAGE.IDLE} onClose={onClose}>
      <ModalContent>{content}</ModalContent>
    </Modal>
  );
}
