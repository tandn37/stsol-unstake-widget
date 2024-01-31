import styled from 'styled-components';

const ButtonStyled = styled.button`
  border: none;
  outline: none;
  white-space: nowrap;
  overflow: hidden;
  line-height: inherit;
  background-color: inherit;
  font-size: inherit;
  color: inherit;
  padding: inherit;

  :hover {
    cursor: pointer;
  }

  :disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export default function Button({ ...props }) {
  return <ButtonStyled type="button" {...props} />;
}
