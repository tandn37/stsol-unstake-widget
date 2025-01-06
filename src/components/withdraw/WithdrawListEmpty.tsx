import { useAccount } from '@/contexts/account';
import { FC } from 'react';
import { EmptyText, WrapperEmpty } from './styles';

export const WithdrawListEmpty: FC = () => {
  const { active } = useAccount();

  if (!active) {
    return (
      <WrapperEmpty>
        <EmptyText size="sm">
          Connect wallet to see your stake accounts
        </EmptyText>
      </WrapperEmpty>
    );
  }

  return (
    <WrapperEmpty>
      <EmptyText color="secondary" size="sm">
        No stake accounts for withdraw found
      </EmptyText>
    </WrapperEmpty>
  );
};
