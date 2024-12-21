import { TX_STAGE, lamportsToSol, solToLamports, toPrecision } from '@lidofinance/solido-sdk';
import type { SetTxStageProps } from '@lidofinance/solido-sdk/dist/esm/core/src/types.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

import BlueButton from '@/components/BlueButton';
import MaxButton from '@/components/MaxButton';
import Input from '@/components/base/Input';
import UnstakingTxModal, { UnstakingTxModalProps } from '@/components/unstake/UnstakingTxModal';
import ConnectWalletButton from '@/components/wallet/ConnectWalletButton';
import { useAccount } from '@/contexts/account';
import { useUnstakeDisabled } from '@/contexts/protocolState';
import { useSDK } from '@/contexts/sdk';
import useAmountForm from '@/hooks/useAmountForm';
import useMaxUnstakeAmount from '@/hooks/useMaxUnstakeAmount';
import { useMinUnstakeAmount } from '@/hooks/useMinUnstakeAmount';
import useTransactionParams from '@/hooks/useTransactionParams';
import { customUnstake } from './custom-unstake-function';

import StSolIcon from '@/assets/icons/stsol-round.svg?react';

export type StageProps = Omit<UnstakingTxModalProps, 'stage' | 'onClose' | 'exchangeConvert'>;

type Props = {
  setFormInputValue: Dispatch<SetStateAction<number>>;
};

function UnstakeForm({ setFormInputValue }: Props) {
  const { wallet } = useWallet();
  const { active, stSol } = useAccount();
  const sdk = useSDK();

  const { unstakeExchangeRate } = useTransactionParams();

  const [warning, setWarning] = useState<string | undefined>();

  const [txStage, setTxStage] = useState(TX_STAGE.IDLE);
  const [stageProps, setStageProps] = useState<StageProps>({});
  const closeTxModal = useCallback(() => setTxStage(TX_STAGE.IDLE), []);

  const { value: maxInStLamports, isReady: isMaxAmountReady } = useMaxUnstakeAmount();
  const minInLamports = useMinUnstakeAmount();

  const { isUnstakeDisabled } = useUnstakeDisabled();

  const onMax = useCallback(() => {
    void setValues({
      amount: lamportsToSol(stSol.balanceInLamports),
    });
  }, [stSol.balanceInLamports]);

  const unstake = useCallback(
    async (amount: number) => {
      try {
        const setTxStageCallback = ({ txStage: stage, ...props }: SetTxStageProps) => {
          setStageProps((prev) => ({
            ...prev,
            ...props,
            totalCount: prev.totalCount ?? (props.remainingCount ? props.remainingCount + 1 : undefined),
          }));
          setTxStage(stage);
        };

        const { remainingAmount } = await customUnstake(sdk, {
          amount,
          wallet: wallet?.adapter as never, // WalletAdapter instance
          setTxStage: setTxStageCallback,
          allowMultipleTransactions: true,
        });

        if (remainingAmount) {
          await unstake(remainingAmount);
        }
      } catch (e) {
        setStageProps((props) => ({ ...props, error: e.message || e.error?.message }));
        setTxStage(TX_STAGE.ERROR);
      }
    },
    [sdk, wallet?.adapter],
  );

  const submitSDK = useCallback(
    async ({ amount: amountInStSol }) => {
      setStageProps({
        totalAmount: solToLamports(amountInStSol),
        warning,
      });
      await unstake(solToLamports(amountInStSol));
    },
    [unstake, warning],
  );

  const { values, errors, handleChange, handleSubmit, isValidating, isSubmitting, setValues } = useAmountForm(
    {
      maxAmount: stSol.balanceInLamports,
      minAmount: minInLamports,
      walletConnected: active,
      onSubmit: submitSDK,
      initialValues: { amount: '' },
    },
  );

  useEffect(() => {
    setFormInputValue(values.amount);
  }, [setFormInputValue, values]);

  useEffect(() => {
    if (!warning && maxInStLamports && solToLamports(values.amount) > maxInStLamports) {
      setWarning('Unstake will be performed in several transactions');
    }
    if (warning && solToLamports(values.amount) <= maxInStLamports) {
      setWarning(undefined);
    }
  }, [maxInStLamports, values.amount, warning]);

  return (
    <>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Input
          name="amount"
          label="Unstake"
          placeholder="Amount"
          value={values.amount}
          onChange={handleChange}
          error={errors.amount}
          warning={warning}
          startIcon={<StSolIcon />}
          endIcon={
            <MaxButton disabled={isUnstakeDisabled || !isMaxAmountReady} onClick={onMax}>
              MAX
            </MaxButton>
          }
          disabled={isUnstakeDisabled}
        />
        {active ? (
          <BlueButton
            disabled={values.amount <= 0 || errors.amount || isValidating || isSubmitting}
            type="submit"
          >
            Submit
          </BlueButton>
        ) : (
          <ConnectWalletButton />
        )}
      </form>

      <UnstakingTxModal
        {...stageProps}
        stage={txStage}
        onClose={closeTxModal}
        exchangeConvert={(value) => toPrecision(value * unstakeExchangeRate, 4)}
      />
    </>
  );
}

export default UnstakeForm;
