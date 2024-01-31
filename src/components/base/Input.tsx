import { ReactNode } from 'react';
import styled from 'styled-components';
import { Label, LabelWrapper } from './InputElements';

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 32px;
  min-width: 200px;
`;

const InputStyled = styled.input<{
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  error?: string;
  warning?: string;
}>`
  padding: 16px;
  padding-left: ${(props) => (props.startIcon ? '52px' : '16px')};
  padding-right: ${(props) => (props.endIcon ? '88px' : '16px')};
  margin: 0;
  outline: none;
  border: none;
  width: 100%;
  font-size: 14px;
  line-height: 24px;
  background: #ffffff;
  border: 1px solid
    ${(props) =>
      props.error
        ? `${props.theme.colors.error} !important`
        : props.warning
        ? `${props.theme.colors.warningHover} !important`
        : '#d1d8df'};
  border-radius: 10px;

  &:hover:enabled {
    cursor: pointer;
    border: 1px solid #b1b7bd;
  }

  &:focus {
    outline: none;
    cursor: text;
    border: 1px solid #00a3ff;
  }

  &::placeholder {
    color: #b5b7b9;
  }
`;

const Error = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
  height: 40px;
  display: flex;
  align-items: center;
  position: absolute;
  top: 100%;
`;

const Warning = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.warning};
  background: ${({ theme }) => theme.colors.warningBackground};
  margin-top: 4px;
  padding: 6px 12px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  position: absolute;
  top: 100%;
`;

const StartIconWrapper = styled.span`
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translate(0, -50%);
  height: 22px;
`;

const EndIconWrapper = styled.span`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translate(0, -50%);
`;

export default function Input(props) {
  const { label, startIcon, endIcon, error, warning } = props;
  return (
    <>
      <LabelWrapper>{label && <Label>{label}</Label>}</LabelWrapper>
      <InputWrapper>
        {startIcon && <StartIconWrapper>{startIcon}</StartIconWrapper>}
        <InputStyled {...props} />
        {endIcon && <EndIconWrapper>{endIcon}</EndIconWrapper>}
        {error && <Error>{error}</Error>}
        {!error && warning && <Warning>{warning}</Warning>}
      </InputWrapper>
    </>
  );
}
