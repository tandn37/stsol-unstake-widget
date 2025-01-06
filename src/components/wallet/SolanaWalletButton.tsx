import styled from 'styled-components';

import AddressBadge from '@/components/AddressBadge';
import { MODAL_ID, useModal } from '@/contexts/modals';
import { lamportsToSol } from '@lidofinance/solido-sdk';

const WalletButtonStyled = styled.div`
  background-color: #2b3540;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  :hover {
    cursor: pointer;
  }
`;

const BalanceStyled = styled.div`
  color: #FFFFFF;
  margin-right: 12px;
  font-size: 14px;
  font-weight: 800;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export default function WalletButton({ address, balance }) {
  const { handleOpen } = useModal(MODAL_ID.WALLET);
  return (
    <WalletButtonStyled onClick={handleOpen}>
      <BalanceStyled>{balance !== undefined ? lamportsToSol(balance) : '--'} SOL</BalanceStyled>
      <AddressBadge address={address} mode="light" />
    </WalletButtonStyled>
  );
}
