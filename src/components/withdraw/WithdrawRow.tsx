import { useWithdrawData } from '@/contexts/withdraw';
import useSolanaExplorerLink from '@/hooks/useSolanaExplorerLink';
import { Checkbox, External } from '@lidofinance/lido-ui';
import type { StakeAccount } from '@lidofinance/solido-sdk/dist/esm/core/src/types';
import { FC, useCallback } from 'react';
import { FormatToken } from '@/components/base/FormatToken';
import { WithdrawStatus } from './WithdrawStatus';
import { LinkStyled, WithdrawRowStyled } from './styles';

export const WithdrawRow: FC<{ item: StakeAccount }> = ({ item }) => {
  const { selection } = useWithdrawData();
  const { isSelected: getIsSelected, setSelected, canSelectMore } = selection;
  const { pubkey, lamports, isReady } = item;

  const isSelected = getIsSelected(pubkey);
  const isDisabled = !isReady || (!isSelected && !canSelectMore);
  const link = useSolanaExplorerLink(pubkey.toString(), 'address');

  const label = <FormatToken amount={lamports} symbol="SOL" />;

  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSelected(pubkey, e.currentTarget.checked),
    [setSelected, pubkey],
  );

  return (
    <WithdrawRowStyled $disabled={isDisabled}>
      <Checkbox
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        label={label}
        checked={isSelected}
        disabled={isDisabled}
        onChange={handleSelect}
      />
      <WithdrawStatus isReady={isReady} />
      <LinkStyled href={link}>
        <External />
      </LinkStyled>
    </WithdrawRowStyled>
  );
};
