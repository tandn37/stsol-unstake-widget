import styled from 'styled-components';
import Button from './base/Button';

const MaxButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary}10;
  color: ${({ theme }) => theme.colors.primary};
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
`;

export default MaxButton;
