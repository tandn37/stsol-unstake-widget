import Card from '@/components/base/Card';
import CardDeck from '@/components/base/CardDeck';
import { WithdrawForm } from '@/components/withdraw/WithdrawForm';
import WithdrawLegend from '@/components/withdraw/WithdrawLegend';
import { useAccount } from '@/contexts/account';
import { WithdrawDataProvider } from '@/contexts/withdraw';

export const WithdrawCard = () => {
  const { active } = useAccount();

  return (
    <CardDeck>
      <WithdrawDataProvider>
        {active && <WithdrawLegend />}

        <Card>
          <WithdrawForm />
        </Card>
      </WithdrawDataProvider>
    </CardDeck>
  );
};
