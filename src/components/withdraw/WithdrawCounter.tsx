import { Tooltip } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { CounterStyled, Loader } from './styles';

export const WithdrawCounter: FC<{ title: string; loading: boolean; icon: JSX.Element; value: number }> = ({
  title,
  loading,
  icon,
  value,
}) => (
  <CounterStyled>
    <Tooltip placement="bottom" title={title}>
      <span>
        {icon}
        {loading ? <Loader /> : <span>{value}</span>}
      </span>
    </Tooltip>
  </CounterStyled>
);
