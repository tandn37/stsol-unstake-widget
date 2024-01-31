import { FormatToken } from '@/components/base/FormatToken';
import { useAccount } from '@/contexts/account';
import { useWithdrawData } from '@/contexts/withdraw';
import { TickSquare, TimeSquare } from '@lidofinance/lido-ui';
import {
  CardLegend,
  CardLegendAccount,
  CardLegendBalance,
  CardLegendBlock,
  CardLegendDivider,
  CardLegendSection,
} from '@/components/base/CardLegend';
import { WithdrawCounter } from './WithdrawCounter';

export default function WithdrawLegend() {
  const { address } = useAccount();

  const { loading, amountToWithdraw, amountInPending, countInPending, countToWithdraw } = useWithdrawData();

  return (
    <CardLegend>
      <CardLegendSection>
        <CardLegendBlock label="Available to withdraw">
          <CardLegendBalance
            loading={loading}
            balance={<FormatToken amount={amountToWithdraw} symbol="SOL" />}
          />
        </CardLegendBlock>
        <CardLegendAccount address={address} />
      </CardLegendSection>
      <CardLegendDivider />
      <CardLegendSection equal>
        <CardLegendBlock label="My stake accounts">
          <WithdrawCounter
            title="Ready to withdraw"
            loading={loading}
            icon={<TickSquare />}
            value={countToWithdraw}
          />
          <WithdrawCounter title="Pending" loading={loading} icon={<TimeSquare />} value={countInPending} />
        </CardLegendBlock>
        <CardLegendBlock label="Pending amount">
          <CardLegendBalance
            loading={loading}
            balance={<FormatToken amount={amountInPending} symbol="SOL" />}
          />
        </CardLegendBlock>
      </CardLegendSection>
    </CardLegend>
  );
}
