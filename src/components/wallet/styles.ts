import { Modal, Text } from '@lidofinance/lido-ui';
import styled from 'styled-components';

import { isMobileOrTablet } from '@/utils/userAgent';

export const StyledModal = styled(Modal)`
  && {
    > div {
      width: 100%;
    }
  }
`;

export const TooltipWrapper = styled.div`
  position: relative;

  &:not(:hover) > div {
    display: none;
  }

  & > button {
    width: 100%;
  }
`;

export const ModalText = styled(Text)`
  max-width: 550px;
  padding: 0 4px 16px;
`;

export const Description = styled.div`
  margin-top: 8px;
  margin-bottom: 16px;
`;

export const ErrorContainer = styled.div`
  max-width: 540px;
  padding-bottom: 32px;
`;

export const WalletsButtonsContainer = styled.div`
  box-sizing: content-box;
  display: grid;
  grid-template-columns: repeat(5, 100px);
  grid-auto-rows: 100px;
  grid-gap: 10px;

  @media screen and (max-width: 720px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const Spacer = styled.div`
  height: 32px;
`;

export const ScrollContainer = styled.div<{ expanded: boolean }>`
  max-height: 70vh;

  ${({ expanded }) =>
    !expanded
      ? `
      margin-bottom: ${isMobileOrTablet ? '-18px' : '-24px'};
    `
      : ''}

  /* === SCROLLBAR ADJUSTING START === */
  overflow-y: scroll;
  overflow-x: hidden;

  @supports (scrollbar-width: thin) {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.border} transparent;
    padding-right: 12px;
    margin-right: -12px;
  }

  @supports (selector(-webkit-scrollbar)) {
    padding-right: 6px;
    margin-right: -16px;

    &::-webkit-scrollbar-track {
      border-radius: 30px;
      background-color: transparent;
    }

    &::-webkit-scrollbar {
      width: 10px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-style: solid;
      border-color: transparent;
      border-width: 2px;
      border-radius: 30px;
      background-clip: content-box;
      background-color: ${({ theme }) => theme.colors.border};

      &:hover {
        border-width: 0;
      }
    }
    /* === SCROLLBAR ADJUSTING END === */
  }
`;

const Sticky = styled.div`
  position: sticky;
  z-index: 1;
  background: ${({ theme }) => theme.colors.foreground};
`;

export const StickySection = styled(Sticky)`
  bottom: 0;
  top: -1px;
`;
