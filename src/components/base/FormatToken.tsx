import { lamportsToSol } from '@lidofinance/solido-sdk';
import { FC } from 'react';

export type FormatTokenProps = {
  amount: number;
  symbol: string;
  approx?: boolean;
};

export const FormatToken: FC<FormatTokenProps> = ({ amount, symbol, approx, ...rest }) => {
  const value = lamportsToSol(amount);

  const prefix = approx ? '≈ ' : '';

  return (
    <span {...rest}>
      {prefix}
      {value}&nbsp;{symbol}
    </span>
  );
};
