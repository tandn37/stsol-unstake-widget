import { ButtonProps } from '@lidofinance/lido-ui';
import React, { FC } from 'react';
import {
  ConnectButtonContainer,
  ConnectButtonContent,
  ConnectButtonIcon,
  ConnectButtonTitle,
  ConnectButtonViaIcon,
} from './ConnectButtonStyles';

export type ConnectButtonProps = {
  icon: React.ReactElement;
  viaIcon?: React.ReactElement;
  flat?: boolean;
} & ButtonProps;

const ConnectButton: FC<ConnectButtonProps> = (props: ConnectButtonProps) => {
  const { icon, viaIcon, children, ...rest } = props;

  return (
    <ConnectButtonContainer {...rest}>
      <ConnectButtonContent>
        <ConnectButtonIcon>
          {icon}
          {viaIcon && <ConnectButtonViaIcon>{viaIcon}</ConnectButtonViaIcon>}
        </ConnectButtonIcon>
        <ConnectButtonTitle>{children}</ConnectButtonTitle>
      </ConnectButtonContent>
    </ConnectButtonContainer>
  );
};

export default ConnectButton;
