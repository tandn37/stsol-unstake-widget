import { Link } from '@lidofinance/lido-ui';
import { TX_STAGE, lamportsToSol } from '@lidofinance/solido-sdk';
import type { SetTxStageProps } from '@lidofinance/solido-sdk/dist/esm/core/src/types';
import { FC } from 'react';
import styled from 'styled-components';

import { AccountAddress } from '@/components/base/AccountAddress';
import Modal from '@/components/base/Modal';
import Spinner from '@/components/base/Spinner';
import useSolanaExplorerLink from '@/hooks/useSolanaExplorerLink';

import RoundCheckIcon from '@/assets/icons/check-round.svg?react';
import RoundCrossIcon from '@/assets/icons/cross-round.svg?react';

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
  margin: 0px 0 8px;
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

const CountText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.warning};
  margin-bottom: 16px;
`;

const IconWrapper = styled.div`
  margin-bottom: 24px;
`;

const SolanaExplorerLink = styled(Link)`
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  color: ${(props) => props.theme.colors.primary};
  margin-top: 18px;
`;

export type UnstakingTxModalProps = {
  stage: TX_STAGE;
  onClose: () => void;
  exchangeConvert: (value: number) => number;
  error?: string;
  warning?: string;
  transactionHash?: string;
  totalAmount?: number;
  totalCount?: number;
} & Pick<SetTxStageProps, 'remainingAmount' | 'remainingCount' | 'unstakeAmount' | 'stakeAccounts'>;

const TransactionCount: FC<Pick<UnstakingTxModalProps, 'totalCount' | 'remainingCount' | 'warning'>> = ({
  totalCount,
  remainingCount,
  warning,
}) => {
  if (totalCount > 1) {
    return (
      <CountText>
        Transaction {totalCount - remainingCount} of {totalCount}
      </CountText>
    );
  }
  if (warning) {
    return <CountText>Unstake will be performed in several transactions</CountText>;
  }
  return null;
};

const TransactionLink: FC<Pick<UnstakingTxModalProps, 'transactionHash'> & { skipInstruction?: boolean }> = ({
  transactionHash,
  skipInstruction = false,
}) => {
  const link = useSolanaExplorerLink(transactionHash, 'tx');
  if (!link) return null;
  return (
    <>
      {skipInstruction ? null : (
        <InstructionText>Check the transaction status on Block Explorer</InstructionText>
      )}
      <SolanaExplorerLink href={link}>View on Block Explorer</SolanaExplorerLink>
    </>
  );
};

const TransactionAmount: FC<Pick<UnstakingTxModalProps, 'totalAmount' | 'unstakeAmount'>> = ({
  totalAmount,
  unstakeAmount,
}) => {
  if (unstakeAmount === totalAmount) return <span>{lamportsToSol(totalAmount)} stSOL</span>;

  return (
    <span>
      {lamportsToSol(unstakeAmount)} / {lamportsToSol(totalAmount)} stSOL
    </span>
  );
};

const StagePrepare: FC<Omit<UnstakingTxModalProps, 'stage' | 'onClose'>> = ({
  exchangeConvert,
  totalAmount,
  ...props
}) => (
  <>
    <IconWrapper>
      <Spinner />
    </IconWrapper>
    <TransactionCount {...props} />
    <BoldText>Preparing unstake transaction</BoldText>
    <LightText>
      Upon approval approximately {lamportsToSol(exchangeConvert(totalAmount))} SOL will start deactivating in
      your stake account. It will be available for withdrawal once deactivated(~1-2 epochs)
    </LightText>
  </>
);

const StageAwaitingSigning: FC<Omit<UnstakingTxModalProps, 'stage' | 'onClose'>> = ({
  exchangeConvert,
  totalAmount,
  unstakeAmount,
  ...props
}) => (
  <>
    <IconWrapper>
      <Spinner />
    </IconWrapper>
    <TransactionCount {...props} />
    <BoldText>
      You are now unstaking <TransactionAmount totalAmount={totalAmount} unstakeAmount={unstakeAmount} />
    </BoldText>
    <LightText>
      Upon approval approximately {lamportsToSol(exchangeConvert(unstakeAmount))} SOL will start deactivating
      in your stake account. It will be available for withdrawal once deactivated(~1-2 epochs)
    </LightText>
    <InstructionText>Confirm this transaction in your wallet</InstructionText>
  </>
);

const StageAwaitingBlock: FC<Omit<UnstakingTxModalProps, 'stage' | 'onClose'>> = ({ ...props }) => (
  <>
    <IconWrapper>
      <Spinner />
    </IconWrapper>
    <TransactionCount {...props} />
    <BoldText>
      You are now unstaking <TransactionAmount {...props} />
    </BoldText>
    <LightText>
      Transaction Approved. Waiting for transaction to be confirmed on the blockchain (MAX confirmation = ~32)
    </LightText>
    <TransactionLink {...props} />
  </>
);

const StageSuccess: FC<Omit<UnstakingTxModalProps, 'stage' | 'onClose'>> = ({
  exchangeConvert,
  totalAmount,
  unstakeAmount,
  stakeAccounts = [],
  ...props
}) => (
  <>
    <IconWrapper>
      <RoundCheckIcon />
    </IconWrapper>
    <TransactionCount {...props} />
    <BoldText>
      <TransactionAmount totalAmount={totalAmount} unstakeAmount={unstakeAmount} /> Successfully Unstaked
    </BoldText>
    <LightText>
      {lamportsToSol(exchangeConvert(unstakeAmount))} SOL is now deposited in the following
      (deactivating)stake {stakeAccounts.length > 1 ? 'accounts ' : 'account '}
      {stakeAccounts
        .map<React.ReactNode>((s) => <AccountAddress key={s.toString()} account={s} asLink />)
        .reduce((prev, curr) => [prev, ', ', curr], '')}
    </LightText>
    <TransactionLink {...props} />
  </>
);

const StageError: FC<Omit<UnstakingTxModalProps, 'stage' | 'onClose'>> = ({ error, ...props }) => (
  <>
    <IconWrapper>
      <RoundCrossIcon />
    </IconWrapper>
    <TransactionCount {...props} warning={undefined} />
    <BoldText>Something went wrong</BoldText>
    {/* "de" is necessary for the correct hyphens in words */}
    <div lang="de">
      <LightText>{error}</LightText>
    </div>

    <TransactionLink {...props} skipInstruction />
  </>
);

export default function UnstakingTxModal({ stage, onClose, ...props }: UnstakingTxModalProps) {
  return (
    <Modal open={stage !== TX_STAGE.IDLE} onClose={onClose}>
      <ModalContent>
        {stage === TX_STAGE.PREPARE &&
          (props.totalCount ? <StageSuccess {...props} /> : <StagePrepare {...props} />)}
        {stage === TX_STAGE.AWAITING_SIGNING && <StageAwaitingSigning {...props} />}
        {stage === TX_STAGE.AWAITING_BLOCK && <StageAwaitingBlock {...props} />}
        {stage === TX_STAGE.SUCCESS && <StageSuccess {...props} />}
        {stage === TX_STAGE.ERROR && <StageError {...props} />}
      </ModalContent>
    </Modal>
  );
}
