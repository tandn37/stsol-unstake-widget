import { Box, Divider } from '@lidofinance/lido-ui';
import React, { useCallback } from 'react';

import { AccordionContent, AccordionHeader } from '@/components/base/Accordion';
import { WALLET_ID } from '@/constants';
import { useConnect } from '@/contexts/ConnectProvider';
import { MODAL_ID, ModalProps, useModal } from '@/contexts/modals';
import { useAvailableWallets } from '@/hooks/useAvailableWallets';
import WalletsList from './WalletsList';
import {
  ErrorContainer,
  StyledModal as Modal,
  ModalText,
  ScrollContainer,
  Spacer,
  StickySection,
} from './styles';
import { useRequirements } from './useRequirements';

const ConnectWalletModal: React.FC<ModalProps> = (props) => {
  const { onClose } = props;
  const { connect } = useConnect();
  const { handleOpen: openLedgerModal } = useModal(MODAL_ID.LEDGER);

  const { primaryWallets, secondaryWallets, primaryTitle, secondaryTitle, primaryDisabledText } =
    useAvailableWallets();
  const { requirements, hideRequirements, isHaveRequirements } = useRequirements();

  const handleConnect = useCallback(
    (walletId: WALLET_ID) => {
      if (isHaveRequirements(walletId)) return;

      if (walletId === WALLET_ID.Ledger) {
        openLedgerModal();
        return;
      }

      connect(walletId);
      onClose();
    },
    [isHaveRequirements, connect, onClose, openLedgerModal],
  );

  const [expanded, setExpanded] = React.useState(false);
  const toggleExpanded = useCallback(() => {
    setExpanded((exp) => !exp);
  }, []);

  return requirements ? (
    <Modal
      center
      title={requirements.title}
      titleIcon={requirements.icon}
      onBack={hideRequirements}
      onExited={hideRequirements}
      {...props}
    >
      <ErrorContainer>{requirements.text}</ErrorContainer>
    </Modal>
  ) : (
    <Modal title={primaryTitle} {...props}>
      <ScrollContainer expanded={expanded}>
        {primaryDisabledText ? (
          <>
            <ModalText size="xs">{primaryDisabledText}</ModalText>
            <WalletsList wallets={primaryWallets} disabled />
            <Spacer />
          </>
        ) : (
          <>
            <WalletsList wallets={primaryWallets} onClick={handleConnect} />
          </>
        )}
        {secondaryWallets.length > 0 && (
          <>
            <StickySection>
              <Divider />
              <Box onClick={toggleExpanded}>
                <AccordionHeader expanded={expanded}>{secondaryTitle}</AccordionHeader>
              </Box>
            </StickySection>
            <AccordionContent expanded={expanded}>
              <WalletsList wallets={secondaryWallets} disabled flat />
            </AccordionContent>
          </>
        )}
      </ScrollContainer>
    </Modal>
  );
};

export default ConnectWalletModal;
