import { Link } from '@lidofinance/lido-ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import styled from 'styled-components';

import Button from '@/components/base/Button';
import Modal from '@/components/base/Modal';
import { useConnect } from '@/contexts/ConnectProvider';
import { useAccount } from '@/contexts/account';
import useSolanaExplorerLink from '@/hooks/useSolanaExplorerLink';
import { useWallet } from '@solana/wallet-adapter-react';

import CopyIcon from '@/assets/icons/copy.svg?react';
import ExternalLinkIcon from '@/assets/icons/external-link.svg?react';

const ModalTitle = styled.p`
  font-weight: 800;
  font-size: 18px;
  line-height: 26px;
  text-align: left;
  margin-bottom: 32px;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 10px;
  padding: 20px;
  text-align: left;
`;

const AccountInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Left = styled.div``;
const ConnectedWith = styled.p`
  font-size: 12px;
  line-height: 20px;
  color: #505a7a;
  margin-bottom: 8px;
`;

const Address = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 800;
  font-size: 14px;
  line-height: 26px;
  p {
    margin-left: 8px;
  }
`;

const DisconnectButton = styled(Button)`
  background: #f4f6f8;
  border: 1px solid #00a3ff;
  width: 7rem;
  border-radius: 6px;
  font-weight: 800;
  font-size: 12px;
  padding: 6px 12px;
  line-height: 20px;
  color: #00a3ff;
  &:hover {
    background-color: #00a3ff;
    color: white;
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
`;

const Action = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  p {
    margin-left: 6px;
    color: ${(props) => props.theme.colors.primary};
    font-size: 12px;
    font-weight: 800;
  }
  :hover {
    cursor: pointer;
  }
`;

export default function WalletModal(props) {
  const { onClose } = props;

  const { address } = useAccount();
  const { disconnect } = useConnect();
  const { wallet } = useWallet();
  const solanaExplorerLink = useSolanaExplorerLink(address?.toString(), 'address');

  const handleDisconnect = useCallback(() => {
    disconnect();
    onClose();
  }, [disconnect, onClose]);

  const shortAddress = useMemo(() => {
    if (address) {
      const parsedAddress = address.toString();
      const len = parsedAddress.length;
      const sliceUpTo = 6;
      return `${parsedAddress.slice(0, sliceUpTo)}...${parsedAddress.slice(len - (sliceUpTo + 1), len + 1)}`;
    }
    return '';
  }, [address]);

  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(() => {
    setCopied(true);
  }, []);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <Modal {...props}>
      <ModalTitle>Account</ModalTitle>
      <ModalContent>
        <AccountInfo>
          <Left>
            <ConnectedWith>Connected with {wallet?.adapter?.name}</ConnectedWith>
            <Address>
              <Jazzicon diameter={24} seed={address ? jsNumberForAddress(address.toString()) : 0} />
              <p>{shortAddress}</p>
              <Link href={solanaExplorerLink} style={{ fontSize: 'inherit' }}>
                &nbsp; &nbsp;
                <ExternalLinkIcon />
              </Link>
            </Address>
          </Left>
        </AccountInfo>
        <ActionsWrapper>
          <CopyToClipboard text={address} onCopy={onCopy}>
            <Action>
              <CopyIcon />
              {copied ? <p>Copied!</p> : <p>Copy address</p>}
            </Action>
          </CopyToClipboard>
          <DisconnectButton onClick={handleDisconnect}>Disconnect</DisconnectButton>
        </ActionsWrapper>
      </ModalContent>
    </Modal>
  );
}
