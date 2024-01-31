import React from 'react';
import styled, { css } from 'styled-components';

const TooltipWrapper = styled.div`
  line-height: 0;
  &:hover {
    cursor: pointer;
    & > div {
      display: block;
    }
  }
  position: relative;
`;

const TooltipStyled = styled.div<{ mobileLeft: boolean; minWidth?: number }>`
  position: absolute;
  background-color: #2b3036;
  padding: 12px;
  display: none;
  left: calc(100% + 5px);
  top: 50%;
  transform: translate(0, -50%);
  color: #ffffff;
  z-index: 9;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  font-size: 12px;
  line-height: 18px;
  max-width: 280px;

  ${({ theme }) => theme.mediaQueries.lg} {
    ${({ mobileLeft }) =>
      mobileLeft &&
      css`
        left: auto;
        right: calc(100% + 5px);
      `}
  }

  ${({ minWidth = 240 }) =>
    minWidth &&
    css`
      min-width: ${minWidth}px;
    `}
`;

export default function Tooltip({ children, text, minWidth = undefined, mobileLeft = false }) {
  return (
    <TooltipWrapper>
      {children}
      <TooltipStyled minWidth={minWidth} mobileLeft={mobileLeft}>
        {text}
      </TooltipStyled>
    </TooltipWrapper>
  );
}
