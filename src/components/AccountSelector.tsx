import { useState } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import styled from 'styled-components';
import { shortenAddress } from '@/utils/shortenAddress';
import { lamportsToSol } from '@lidofinance/solido-sdk';
import Chevron from '@/assets/icons/chevron.svg?react';
import Modal from './base/Modal';

const AccountSelector = ({ accounts, selectedAccount, setSelectedAccount, title, tokenUnit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return typeof selectedAccount.address !== 'undefined' ? (
    <>
      <AccountBadge address={selectedAccount.address} onClick={() => setIsModalOpen(true)} />
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalTitle>{title}</ModalTitle>
        <ModalContent>
          {accounts.length > 0
            ? accounts.map((account) => (
                <Account
                  key={account.address}
                  onClick={() => {
                    setSelectedAccount({
                      address: account.address,
                      balanceInLamports: account.balanceInLamports,
                    });
                    setIsModalOpen(false);
                  }}
                >
                  <Jazzicon diameter={24} seed={jsNumberForAddress(account.address.toString())} />
                  <span className="address">{shortenAddress(account.address)}</span>
                  <span className="balance">
                    {lamportsToSol(account.balanceInLamports)} {tokenUnit}
                  </span>
                </Account>
              ))
            : null}
        </ModalContent>
      </Modal>
    </>
  ) : null;
};

const AccountBadge = ({ address, onClick }) => (
  <BadgeContainer onClick={onClick}>
    <Jazzicon diameter={14} seed={jsNumberForAddress(address.toString())} />
    <span className="address">{shortenAddress(address, true)}</span>
    <Chevron className="down" />
  </BadgeContainer>
);

export default AccountSelector;

const BadgeContainer = styled.span`
  border: 1px solid #fff;
  border-radius: 25px;
  padding: 2px 6px;
  margin-left: 0.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .address {
    margin-bottom: -2px;
    margin-left: 4px;
    margin-right: 4px;
  }

  .down {
    width: 10px;
    margin-bottom: -1px;
    transform: scale(0.8);

    path {
      stroke: white;
    }
  }
`;

const ModalTitle = styled.p`
  font-weight: 800;
  font-size: 18px;
  line-height: 26px;
  color: #080e14;
  text-align: left;
`;

const ModalContent = styled.div`
  padding-top: 20px;
`;

const Account = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 18px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 6px;
  cursor: pointer;
  color: #0b1637;

  &:hover {
    background-color: #e5f5ff;
  }

  &:not(:last-child) {
    margin-bottom: 12px;
  }

  .address {
    margin-left: 14px;
    font-size: 0.8rem;
    color: #5d6b7b;
  }

  .balance {
    margin-left: auto;
  }
`;
