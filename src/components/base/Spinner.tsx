import styled from 'styled-components';
import { rotate } from './rotate';

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-radius: 50%;
  animation: ${rotate} 2s linear infinite;
`;

export default Spinner;
