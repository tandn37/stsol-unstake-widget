import styled from 'styled-components';
import Button from './base/Button';

const BlueButton = styled(Button)`
  margin-top: 10px;
  height: 44px;
  background-color: #00ffa7;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  color: #061019;
  padding: 16px 20px;
  border-radius: 6px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  /* TODO: Swap colors */

  :hover {
    background: rgba(0, 255, 167, 0.85);
  }
`;

export default BlueButton;
