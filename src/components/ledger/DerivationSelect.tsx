import { Box, Option, Select, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import styled from 'styled-components';
import { DerivationPathLength } from './types';

const TextStyled = styled(Text)`
  font-size: 14px;
  line-height: 24px;
  text-align: left;
  margin-bottom: 10px;
`;

export const DerivationSelect: FC<{
  value: DerivationPathLength;
  onChange: (_: DerivationPathLength) => void;
}> = ({ onChange, value }) => (
  <Box>
    <TextStyled color="secondary">Select HD derivation path</TextStyled>
    <Select onChange={onChange} value={value} fullwidth themeOverride="light">
      <Option value={0}>m/44/501 - Recommended</Option>
      <Option value={1}>m/44/501/0 - Ledger Live</Option>
      <Option value={2}>m/44/501/0/0</Option>
    </Select>
  </Box>
);
