import styled from 'styled-components';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { FC, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { shortenAddress } from '@/utils/shortenAddress';
import { PublicKey } from '@solana/web3.js';

const AddressBadgeStyled = styled.div<{ mode: 'light' | 'dark' }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.mode === 'light' ? props.theme.colors.background : '#00000020')};
  padding: 4px 4px 4px 14px;
  border-radius: 100px;

  .address {
    color: ${(props) => (props.mode === 'light' ? '#5D6B7B' : '#ffffff')};
    margin-right: 4px;
    font-size: 12px;
  }
`;

const AddressBadge: FC<{ address: string | PublicKey; mode?: 'light' | 'dark' }> = ({
  address,
  mode = 'light',
}) => {
  const shortAddress = useMemo(() => {
    if (address) {
      return shortenAddress(address, isMobile);
    }
  }, [address]);

  return (
    <AddressBadgeStyled mode={mode}>
      <p className="address">{shortAddress}</p>
      <Jazzicon diameter={24} seed={jsNumberForAddress(address.toString())} />
    </AddressBadgeStyled>
  );
};

export default AddressBadge;
