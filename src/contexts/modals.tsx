import WalletErrorModal from '@/components/wallet/WalletErrorModal';
import ConnectWalletModal from '@/components/wallet/ConnectWalletModal';
import WalletModal from '@/components/wallet/SolanaWalletModal';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import LedgerModal from '@/components/ledger/LedgerModal';

export enum MODAL_ID {
  CONNECT,
  LEDGER,
  WALLET,
  WELCOME_TERMS,
  ERROR,
}

export type ModalProps = {
  open: boolean;
  onClose: () => void;
};

type ModalContext = {
  active?: MODAL_ID;
  open: (modalId: MODAL_ID) => void;
  close: () => void;
};

export const ModalContext = createContext<ModalContext>({
  active: undefined,
  open: () => null,
  close: () => null,
});

export default function ModalProvider({ children }) {
  const [active, setActive] = useState<MODAL_ID>(undefined);

  const open = useCallback((id: MODAL_ID) => {
    setActive(id);
  }, []);

  const close = useCallback(() => {
    setActive(undefined);
  }, []);

  const contextValue: ModalContext = useMemo(
    () => ({
      active,
      open,
      close,
    }),
    [active, open, close],
  );

  return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>;
}

export const useModal = (modalId: MODAL_ID) => {
  const { close, open } = useContext(ModalContext);
  return {
    handleOpen: useCallback(() => {
      open(modalId);
    }, [modalId, open]),
    handleClose: close,
  };
};

export const Modals = () => {
  const { active, close } = useContext(ModalContext);
  return (
    <>
      <ConnectWalletModal open={active === MODAL_ID.CONNECT} onClose={close} />
      <WalletModal open={active === MODAL_ID.WALLET} onClose={close} />
      <WalletErrorModal open={active === MODAL_ID.ERROR} onClose={close} />
      <LedgerModal open={active === MODAL_ID.LEDGER} onClose={close} />
    </>
  );
};
