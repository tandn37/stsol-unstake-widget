import styled from 'styled-components';

import { glimmer } from '@/components/base/InlineLoader';
import Wallet from '@/components/wallet/SolanaWallet';
import { NETWORK_BY_CLUSTER } from '@/constants/solanaChains';
import useChain from '@/hooks/useChain';
import logo from '@/assets/nansen.svg';

const HeaderStyled = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  overflow-x: hidden;
  padding: 16px 120px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 16px 32px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 16px 20px;
  }
`;

const Logo = styled.img`
  height: 32px;
  width: auto;
`;

const Left = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const NetworkName = styled.div`
  margin-right: 16px;
  font-size: 12px;
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;

  span {
    width: max-content;
  }
`;

const Dot = styled.p`
  height: 6px;
  width: 6px;
  min-width: 6px;
  background-color: lightgreen;
  border-radius: 50%;
  animation: ${glimmer} 2s ease-in-out infinite;
  margin-right: 6px;
`;

const Header = () => {
  const chain = useChain();

  return (
    <HeaderStyled>
      <Left>
        <Logo src={logo} alt="Nansen" />
      </Left>
      <Right>
        <NetworkName>
          <Dot />
          <span>{NETWORK_BY_CLUSTER[chain]}</span>
        </NetworkName>
        <Wallet />
      </Right>
    </HeaderStyled>
  );
};

export default Header;
