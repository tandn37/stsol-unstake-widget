import { NOOP } from '@/utils/noop';
import styled from 'styled-components';

const SwitchWrapper = styled.div<{ disabled?: boolean }>`
  width: 268px;
  height: 44px;
  background-color: #e2e6eb;
  border-radius: 20px;
  position: relative;
  :hover {
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  }
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0;
  margin-bottom: 24px;
`;

const Handle = styled.div<{ checked?: boolean }>`
  width: 132px;
  height: 40px;
  background-color: white;
  border-radius: 20px;
  position: absolute;
  left: ${(props) => (props.checked ? 'calc(100% - 134px)' : '2px')};
  transition: left 0.3s ease;
  top: 2px;
  z-index: 1;
`;

const Label = styled.p<{ checked?: boolean }>`
  font-size: 14px;
  z-index: 2;
  margin: 0;
  opacity: ${(props) => (props.checked ? 0.5 : 1)};
  transition: opacity 0.3s ease;
`;

const Switch = ({ checked, onClick, checkedLabel, uncheckedLabel, disabled = false, ...rest }) => (
  <SwitchWrapper onClick={disabled ? NOOP : onClick} disabled={disabled} {...rest}>
    <Handle checked={checked} />
    <Label checked={checked}>{checkedLabel}</Label>
    <Label checked={!checked}>{uncheckedLabel}</Label>
  </SwitchWrapper>
);

export default Switch;
