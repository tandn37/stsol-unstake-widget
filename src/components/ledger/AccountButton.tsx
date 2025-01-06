import WalletIcon from '@/assets/icons/wallet.svg?react';
import { Address, Text } from '@lidofinance/lido-ui';
import { lamportsToSol } from '@lidofinance/solido-sdk';
import { FC } from 'react';
import styled, { keyframes } from 'styled-components';
import { AccountRecord } from './types';

const ButtonStyled = styled.div`
  background-color: #00ffa7 !important;
  border-radius: 10px;
  display: flex;
  padding: 16px 20px;
  justify-content: space-between;
  align-items: center;

  margin-top: 10px;

  :first-child {
    margin-top: 0;
  }

  :hover {
    cursor: pointer;
    background: rgba(0, 255, 167, 0.85);
  }
`;

const BoxStyled = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-right: 20px;
  }
`;

const gradientKeyframes = keyframes`
  100% {
    background-position: 368px 0;
  }
`;

const SkeletonWrapper = styled(ButtonStyled)`
  background: linear-gradient(270deg, #eff2f6 0%, #eff2f6 0.01%, #fff 34.14%, #eff2f6 100%) 0 0;
  animation: ${gradientKeyframes} 2s ease infinite;
`;

type Props = { onClick: () => void } & Pick<AccountRecord, 'address' | 'balance'>;

export const AccountButton: FC<Props> = ({ address, balance, onClick }) => (
  <ButtonStyled onClick={onClick}>
    <BoxStyled>
      <WalletIcon />
      <Address address={address} symbols={8} />
    </BoxStyled>
    <Text size="xs" strong>
      {balance !== undefined ? lamportsToSol(balance) : '0'} SOL
    </Text>
  </ButtonStyled>
);

export const AccountButtonSkeleton = () => (
  <SkeletonWrapper>
    <WalletIcon />
  </SkeletonWrapper>
);
