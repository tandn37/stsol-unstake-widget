import { PublicKey } from '@solana/web3.js';

import AccountSelector from '@/components/AccountSelector';
import {
  CardLegend,
  CardLegendAccount,
  CardLegendBalance,
  CardLegendBlock,
  CardLegendDivider,
  CardLegendSection,
} from '@/components/base/CardLegend';
import { FormatToken } from '@/components/base/FormatToken';
import { useAccount } from '@/contexts/account';

type BalanceEntry<T = number> = {
  label: string;
  balance?: T;
  currency?: string;
  highlighted?: boolean;
  ratio?: number;
};

export type WalletCardProps = {
  address: PublicKey;
  balances: [BalanceEntry, BalanceEntry, BalanceEntry<string> | undefined];
};

export default function SolanaWalletCard({ address, balances }: WalletCardProps) {
  const [firstEntry, secondEntry, thirdEntry] = balances;
  const { stSol, stSolAccountsList, setActiveStSolAccount } = useAccount();

  const setSelectedStSolAccount = (account) => {
    setActiveStSolAccount(account.address);
  };

  return (
    <CardLegend>
      <CardLegendSection>
        <CardLegendBlock label={firstEntry.label}>
          <CardLegendBalance
            loading={firstEntry.balance === undefined}
            balance={<FormatToken amount={firstEntry.balance} symbol={firstEntry.currency} />}
          />
        </CardLegendBlock>
        <CardLegendAccount address={address} />
      </CardLegendSection>
      <CardLegendDivider />
      <CardLegendSection>
        {secondEntry && (
          <CardLegendBlock
            label={
              <>
                {secondEntry.label}{' '}
                <AccountSelector
                  accounts={stSolAccountsList}
                  selectedAccount={stSol}
                  setSelectedAccount={setSelectedStSolAccount}
                  title="Select stSOL account"
                  tokenUnit="stSOL"
                />
              </>
            }
          >
            <CardLegendBalance
              small
              loading={secondEntry.balance === undefined}
              balance={<FormatToken amount={secondEntry.balance} symbol={secondEntry.currency} />}
              second={
                <FormatToken
                  approx
                  amount={secondEntry.balance / secondEntry.ratio}
                  symbol={firstEntry.currency}
                />
              }
            />
          </CardLegendBlock>
        )}
        {thirdEntry && (
          <CardLegendBlock label={thirdEntry.label}>
            <CardLegendBalance
              small
              highlighted={thirdEntry.highlighted}
              loading={thirdEntry.balance === undefined}
              balance={thirdEntry.balance}
            />
          </CardLegendBlock>
        )}
      </CardLegendSection>
    </CardLegend>
  );
}
