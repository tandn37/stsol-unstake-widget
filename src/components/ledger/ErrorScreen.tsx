import { Box, Button, Heading, Stack, StackItem } from '@lidofinance/lido-ui';
import { FC } from 'react';
import styled from 'styled-components';

import LedgerErrorImage from '@/assets/ledger/error.svg?react';
import { TextStyled } from './LedgerModal';

const StyledBox = styled(Box)`
  text-align: center;
  width: 310px;
  margin: 0 auto;
`;

const HeadingStyled = styled(Heading)`
  font-size: 16px;
  padding-bottom: 4px;
  line-height: 24px;
`;

export const ErrorScreen: FC<{ message: string; reset: () => void }> = ({ message, reset }) => (
  <Stack direction="column" spacing="xl" align="stretch">
    <StackItem>
      <StyledBox>
        <Stack direction="column" spacing="xl" align="stretch">
          <StackItem>
            <LedgerErrorImage />
          </StackItem>
          <StackItem>
            <HeadingStyled>Something went wrong</HeadingStyled>
            <TextStyled>{message}</TextStyled>
          </StackItem>
        </Stack>
      </StyledBox>
    </StackItem>
    <StackItem>
      <Button variant="ghost" fullwidth onClick={reset}>
        Retry
      </Button>
    </StackItem>
  </Stack>
);
