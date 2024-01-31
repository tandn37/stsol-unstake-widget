import { toPrecision } from '@lidofinance/solido-sdk';
import { useState } from 'react';

import DataTable from '@/components/DataTable';
import BlockLoader from '@/components/base/BlockLoader';
import Card from '@/components/base/Card';
import CardDataWrapper from '@/components/base/CardDataWrapper';
import CardDeck from '@/components/base/CardDeck';
import InfoPanel from '@/components/base/InfoPanel';
import UnstakeForm from '@/components/unstake/UnstakeForm';
import SolanaWalletCard from '@/components/wallet/SolanaWalletCard';
import { useAccount } from '@/contexts/account';
import useTransactionParams from '@/hooks/useTransactionParams';

export const UnstakeCard = () => {
  const [formInputValue, setFormInputValue] = useState(undefined);

  const { active, address, balanceInLamports, stSol } = useAccount();

  const { exchangeRate, unstakeExchangeRate } = useTransactionParams();

  return (
    <CardDeck>
      {active && (
        <SolanaWalletCard
          address={address}
          balances={[
            {
              label: 'SOL Balance',
              balance: balanceInLamports,
              currency: 'SOL',
            },
            {
              label: 'stSOL Balance',
              balance: stSol.balanceInLamports,
              currency: 'stSOL',
              ratio: exchangeRate,
            },
            undefined,
          ]}
        />
      )}

      <Card>
        <UnstakeForm setFormInputValue={setFormInputValue} />

        <CardDataWrapper>
          <DataTable
            data={[
              {
                label: 'You will receive',
                value: unstakeExchangeRate ? (
                  `~${toPrecision((formInputValue || 0) * unstakeExchangeRate, 4)} ${'SOL'}`
                ) : (
                  <BlockLoader />
                ),
                tooltip: `Transaction cost${''} will be deducted from your SOL balance`,
              },
              {
                label: 'Exchange rate',
                value: unstakeExchangeRate ? (
                  `1 stSOL = ~${toPrecision(unstakeExchangeRate, 4) || 1} SOL`
                ) : (
                  <BlockLoader />
                ),
                tooltip:
                  'Updates at the end of an epoch. Rising exchange rate indicates an appreciation in stSOL value',
              },
            ]}
          />

          <InfoPanel>
            Your stake will take 2-3 days to completely deactivate upon Unstaking.
            <br />
            After that, you can use your wallet (Phantom or Solflare) to withdraw the inactive stake.
          </InfoPanel>
        </CardDataWrapper>
      </Card>
    </CardDeck>
  );
};
