import styled, { css } from 'styled-components';
import { Button } from '@lidofinance/lido-ui';

export const ConnectButtonContainer = styled(Button).attrs({
  variant: 'ghost',
  square: true,
})`
  ${({ theme: { fontSizesMap, spaceMap, colors } }) => css`
    height: 100%;
    text-align: center;
    font-weight: 400;
    font-size: ${fontSizesMap.xxs}px;
    padding: 0;
    margin-bottom: ${spaceMap.md}px;
    background: ${colors.background};
  `}

  ${({ flat }: any) =>
    flat
      ? css`
          color: white;
          background: none;
        `
      : null}
`;

export const ConnectButtonContent = styled.span`
  ${({ theme: { colors } }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: ${colors.text};
    height: 100%;
    padding: 16px 2px 12px;
  `}
`;

export const ConnectButtonTitle = styled.p`
  ${({ theme: { colors } }) => css`
    color: ${colors.text};
    line-height: 16px;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    white-space: break-spaces;
  `}
`;

export const ConnectButtonIcon = styled.span`
  display: flex;
  position: relative;
  margin-bottom: 8px;

  svg,
  img {
    width: 40px;
  }

  img {
    max-width: 40px;
    max-height: 40px;
  }
`;

export const ConnectButtonViaIcon = styled.span`
  position: absolute;
  zoom: 50%;
  bottom: -10px;
  right: -20px;
  border-radius: 100%;
`;
