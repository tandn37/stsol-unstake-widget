import { isMobileOrTablet } from '@/utils/userAgent';
import { Tooltip } from '@lidofinance/lido-ui';
import { forwardRef } from 'react';

import StatusInfo from '@/assets/icons/status-info.svg?react';
import StatusPending from '@/assets/icons/status-pending.svg?react';
import StatusReady from '@/assets/icons/status-ready.svg?react';

import { WithdrawStatusStyled, StatusTextStyled } from './styles';

export const WithdrawStatus: React.FC<{ isReady: boolean }> = ({ isReady }) => {
  if (!isReady)
    return (
      <Tooltip title="Stake deactivation period is 2-3 days.">
        <WithdrawStatusBody isReady={false} />
      </Tooltip>
    );

  return <WithdrawStatusBody isReady />;
};

const WithdrawStatusBody = forwardRef<HTMLDivElement, { isReady: boolean } & React.ComponentProps<'div'>>(
  ({ isReady, ...props }, ref) => {
    const statusText = isReady ? 'Ready to withdraw' : 'Pending';

    return (
      <WithdrawStatusStyled {...props} isReady={isReady} ref={ref}>
        {isMobileOrTablet ? (
          isReady ? (
            <StatusReady width={16} />
          ) : (
            <StatusPending />
          )
        ) : (
          <StatusTextStyled>{statusText}</StatusTextStyled>
        )}
        {!isReady && <StatusInfo />}
      </WithdrawStatusStyled>
    );
  },
);
WithdrawStatusBody.displayName = 'WithdrawStatusBody';
