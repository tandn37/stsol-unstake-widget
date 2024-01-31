import { Pagination, Stack, StackItem } from '@lidofinance/lido-ui';
import { FC, useCallback, useState } from 'react';
import styled from 'styled-components';
import { AccountButton, AccountButtonSkeleton } from './AccountButton';
import { DerivationSelect } from './DerivationSelect';
import { useLedgerAccounts } from './useLedger';
import { DerivationPath, DerivationPathLength } from './types';

const PER_PAGE_LIMIT = 5;
const PAGES_LIMIT = 4; // @note first 20 accounts (5 x 4)

type Props = {
  onSelect: (path: DerivationPath) => void;
};

const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
`;

export const AccountsScreen: FC<Props> = ({ onSelect }) => {
  const [derivationLength, setDerivationLength] = useState<DerivationPathLength>(0);
  const [page, setPage] = useState<number>(1);
  const accounts = useLedgerAccounts({ derivationLength, perPage: PER_PAGE_LIMIT, page });

  const handleChange = useCallback((value) => {
    setDerivationLength(value);
    setPage(1);
  }, []);

  const skeletonRows = accounts.length > 0 ? 0 : derivationLength > 0 ? PER_PAGE_LIMIT : 1;

  return (
    <Stack direction="column" spacing="xl" align="stretch">
      <StackItem>
        <DerivationSelect value={derivationLength} onChange={handleChange} />
      </StackItem>
      <StackItem>
        {accounts.length === 0
          ? Array.from({ length: skeletonRows }).map((_, i) => <AccountButtonSkeleton key={i} />)
          : accounts.map((account) => (
              <AccountButton key={account.address} {...account} onClick={() => onSelect(account.path)} />
            ))}
        {derivationLength > 0 && (
          <BoxWrapper>
            <Pagination pagesCount={PAGES_LIMIT} onItemClick={setPage} />
          </BoxWrapper>
        )}
      </StackItem>
    </Stack>
  );
};
