import { Box, Stack, StackItem } from '@lidofinance/lido-ui';
import styled from 'styled-components';

import LedgerImage from '@/assets/ledger/default.svg?react';
import { TextStyled } from './LedgerModal';

const StyledBox = styled(Box)`
  text-align: center;
  width: 310px;
  margin: 0 auto;
`;

export const ConnectionScreen = () => (
  <StyledBox>
    <Stack direction="column" spacing="xl" align="stretch">
      <StackItem>
        <LedgerImage />
      </StackItem>
      <StackItem>
        <TextStyled>Please connect your Ledger and launch Solana app on your device</TextStyled>
      </StackItem>
    </Stack>
  </StyledBox>
);
