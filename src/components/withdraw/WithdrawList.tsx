import { useWithdrawData } from '@/contexts/withdraw';
import { FC } from 'react';
import { WithdrawListLoader } from './WithdrawListLoader';
import { WithdrawRow } from './WithdrawRow';
import { ListWrapper } from './styles';
import { WithdrawListEmpty } from './WithdrawListEmpty';

export const WithdrawList: FC = () => {
  const { accounts, loading } = useWithdrawData();

  if (loading) {
    return <WithdrawListLoader />;
  }

  if (accounts.length === 0) {
    return <WithdrawListEmpty />;
  }

  return (
    <ListWrapper>
      {accounts.map((item) => (
        <WithdrawRow key={item.pubkey.toString()} item={item} />
      ))}
    </ListWrapper>
  );
};
