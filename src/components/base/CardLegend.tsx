import { PublicKey } from '@solana/web3.js';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

import AddressBadge from '@/components/AddressBadge';
import BlockLoader from './BlockLoader';
import Card from './Card';

const Block = styled.div``;

const Label = styled.div`
  font-size: 12px;
`;

const Balance = styled.p<{ small?: boolean; highlighted?: boolean }>`
  font-size: ${(props) => (props.small ? '16px' : '18px')};
  font-weight: 800;
  color: ${(props) => (props.highlighted ? '#53BA95' : 'inherit')};
`;

const SecondBalance = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #ffffff;
  opacity: 0.5;
`;

export const CardLegendSection = styled.div<{ equal?: boolean }>`
  display: grid;
  grid-template-columns: ${(props) => (props.equal ? 1 : 2)}fr 1fr;
  grid-gap: 16px;
  margin-bottom: 16px;
`;

export const CardLegendDivider = styled.div`
  height: 1px;
  background-color: #ffffff;
  opacity: 0.1;
  margin-bottom: 20px;
`;

export const CardLegend: FC = ({ children }) => <Card mode="dark">{children}</Card>;

export const CardLegendAccount: FC<{ address: string | PublicKey }> = ({ address }) => (
  <div>
    <AddressBadge address={address} mode="dark" />
  </div>
);

const Loader = () => <BlockLoader dark />;

type BlockEntry = {
  label: string | ReactNode;
};

export const CardLegendBlock: FC<BlockEntry> = ({ label, children }) => (
  <Block>
    <Label>{label}</Label>
    {children}
  </Block>
);

type BalanceEntry = {
  loading?: boolean;
  balance?: string | ReactNode;
  second?: string | ReactNode;
  small?: boolean;
  highlighted?: boolean;
};

export const CardLegendBalance: FC<BalanceEntry> = ({ loading, balance, second, small, highlighted }) => (
  <div>
    {loading ? (
      <Loader />
    ) : (
      <>
        <Balance small={small} highlighted={highlighted}>
          {balance}
        </Balance>
        {second && <SecondBalance>{second}</SecondBalance>}
      </>
    )}
  </div>
);
