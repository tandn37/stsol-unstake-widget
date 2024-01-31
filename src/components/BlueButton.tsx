import styled from 'styled-components';
import Button from './base/Button';

const BlueButton = styled(Button)`
  height: 44px;
  background-color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 800;
  line-height: 24px;
  color: #ffffff;
  padding: 16px 20px;
  border-radius: 6px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  /* TODO: Swap colors */

  :hover {
    background-color: #009bf2;
  }
`;

export default BlueButton;
