import { Checkbox } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { InlineLoaderStyled, ListWrapper, WITHDRAW_LIST_LOADERS_COUNT, WithdrawRowStyled } from './styles';

const loadingItems = Array.from({ length: WITHDRAW_LIST_LOADERS_COUNT }, (_, i) => i);

export const WithdrawListLoader: FC = () => (
  <ListWrapper>
    {loadingItems.map((item) => (
      <WithdrawRowStyled key={item}>
        <Checkbox disabled />
        <InlineLoaderStyled />
      </WithdrawRowStyled>
    ))}
  </ListWrapper>
);
