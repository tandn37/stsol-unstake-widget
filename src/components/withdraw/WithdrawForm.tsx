import BlueButton from '@/components/BlueButton';
import { FormatToken } from '@/components/base/FormatToken';
import ConnectWalletButton from '@/components/wallet/ConnectWalletButton';
import { useAccount } from '@/contexts/account';
import { useWithdrawData } from '@/contexts/withdraw';
import { Stack, StackItem } from '@lidofinance/lido-ui';
import { lamportsToSol } from '@lidofinance/solido-sdk';
import { FC, useCallback } from 'react';
import { WithdrawList } from './WithdrawList';
import WithdrawTxModal from './WithdrawTxModal';
import { useWithdrawForm } from './useWithdrawForm';

export const WithdrawForm: FC = () => {
  const { active } = useAccount();
  const { selection } = useWithdrawData();
  const { selectedCount, selectedAmount } = selection;

  const isDisabled = selectedCount === 0;

  const amountToWithdraw =
    selectedAmount > 0 ? (
      <>
        &nbsp;
        <FormatToken amount={selectedAmount} symbol="SOL" />
      </>
    ) : null;

  const { txStage, txError, closeTxModal, withdraw, explorerLinkParams } = useWithdrawForm();

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      void withdraw();
    },
    [withdraw],
  );

  return (
    <>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Stack direction="column" spacing="md" align="stretch">
          <StackItem>
            <WithdrawList />
          </StackItem>
          <StackItem>
            {active ? (
              <BlueButton type="submit" disabled={isDisabled}>
                Withdraw {amountToWithdraw}
              </BlueButton>
            ) : (
              <ConnectWalletButton />
            )}
          </StackItem>
        </Stack>
      </form>

      <WithdrawTxModal
        stage={txStage}
        onClose={closeTxModal}
        txAmount={lamportsToSol(selectedAmount)}
        explorerLinkParams={explorerLinkParams}
        txError={txError}
      />
    </>
  );
};
