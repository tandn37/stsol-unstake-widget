import { InlineLoader, Link, Text } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const WITHDRAW_LIST_ITEM_SIZE = 57;
export const WITHDRAW_LIST_LOADERS_COUNT = 3;
export const WITHDRAW_LIST_MIN_HEIGHT = 3 * WITHDRAW_LIST_ITEM_SIZE;

export const CounterStyled = styled.span`
  margin-right: 16px;

  svg {
    margin-right: 8px;
    line-height: 0;
    vertical-align: middle;
    margin-top: -2px;
    border: 0;
    padding: 0;
  }

  &:not(:last-of-type) {
    padding-right: 16px;
    border-right: 1px solid rgba(255, 255, 255, 0.3);
  }

  &:last-of-type {
    margin-right: 0;
  }
`;

export const ListWrapper = styled.div`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
  border: 1px solid #2b3540;
  border-bottom: none;
  overflow: hidden;
`;

export const WithdrawRowStyled = styled.div<{
  $disabled?: boolean;
  $loading?: boolean;
}>`
  padding: ${({ theme }) => theme.spaceMap.md}px ${({ theme }) => theme.spaceMap.lg}px;
  padding-right: 12px;
  border-bottom: 1px solid #2b3540;
  background-color: #2b3540;
  color: #ffffff;
  display: flex;
  align-items: center;
  height: ${WITHDRAW_LIST_ITEM_SIZE}px;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  &:last-child {
    border-bottom-color: #2b3540;
  }

  user-select: none;

  ${({ $loading }) => $loading && `cursor: progress;`}

  a:visited {
    color: var(--lido-color-primary);
  }
`;

export const WithdrawStatusStyled = styled.div<{ isReady: boolean }>`
  height: 24px;
  margin-left: auto;
  margin-right: 8px;
  padding: 2px ${({ theme }) => theme.spaceMap.sm}px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 4px;
    min-width: 24px;
    justify-content: center;
  }
  gap: 8px;
  border-radius: 48px;
  display: flex;
  align-items: center;

  background-color: ${({ isReady }) => (isReady ? 'rgba(83, 186, 149, 0.16)' : 'rgba(236, 134, 0, 0.16)')};

  ${({ isReady }) =>
    !isReady &&
    `&:hover {
        background-color: rgba(236, 134, 0, 0.26);
      }`}

  color: ${({ isReady }) => (isReady ? '#53BA95' : '#EC8600')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StatusTextStyled = styled.span`
  font-size: 12px;
  font-weight: 600;
`;

export const LinkStyled = styled(Link)`
  display: flex;
  width: 24px;
  height: 24px;

  background: rgba(0, 163, 255, 0.1);
  border-radius: 4px;

  &:hover {
    background: rgba(0, 163, 255, 0.2);
  }
`;

export const Loader = styled(InlineLoader)`
  width: 40px;
`;

export const InlineLoaderStyled = styled(InlineLoader)`
  margin-left: ${({ theme }) => theme.spaceMap.lg}px;
`;

export const WrapperEmpty = styled(ListWrapper)`
  display: flex;
  height: ${WITHDRAW_LIST_MIN_HEIGHT}px;
`;

export const EmptyText = styled(Text)`
  margin: 0 auto;
  justify-self: center;
  align-self: center;
`;
