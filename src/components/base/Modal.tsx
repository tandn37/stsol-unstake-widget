import { useCallback } from 'react';
import styled from 'styled-components';

const ModalBackdrop = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 2;
`;

const ModalPadding = styled.div`
  width: 100%;
  max-width: 480px;
  min-width: 320px;
  padding: 0 20px;
`;

const ModalStyled = styled.div`
  text-align: center;
  background-color: #ffffff;
  padding: 32px;
  border-radius: 10px;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 24px 20px;
  }
  z-index: 9;
`;

export default function Modal({ open, onClose, children }) {
  const handleClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

  if (!open) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalPadding>
        <ModalStyled onClick={handleClick}>{children}</ModalStyled>
      </ModalPadding>
    </ModalBackdrop>
  );
}
