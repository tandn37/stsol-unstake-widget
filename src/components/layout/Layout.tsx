import styled from 'styled-components';
import Header from './Header';
import { PropsWithChildren } from 'react';
import { Link } from '@lidofinance/lido-ui';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-width: 320px;

  max-width: 536px;
  margin: 0 auto 200px;
  padding: 0 20px;
`;

const LayoutTitleStyle = styled.h1`
  font-size: 26px;
  line-height: 38px;
  font-weight: 800;
  color: #00FFA7;
  margin-bottom: 4px;
`;

const LayoutSubTitleStyle = styled.h4`
  font-size: 13px;
  font-weight: 500;
  color: #FFFFFF;
  margin-bottom: 16px;
`;

type LayoutProps = {
  title: string;
  subtitle: string;
  wide?: boolean;
};

export default function Layout({ children, title, subtitle }: PropsWithChildren<LayoutProps>) {
  return (
    <>
      <Header />
      <Content>
        <LayoutTitleStyle>{title}</LayoutTitleStyle>
        <LayoutSubTitleStyle>Unstake stSOL and withdraw/restake SOL with <b>Nansen's 0%</b> commission validator to earn <b>NSN points</b> - check your restaked SOL positions at <Link href="https://stake.nansen.ai">Nansen Staking Hub</Link></LayoutSubTitleStyle>
        {children}
      </Content>
    </>
  );
}

