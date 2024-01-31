import styled from 'styled-components';

const CardDataWrapper = styled.div`
  margin-top: 32px;

  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 24px;
  }
`;

export default CardDataWrapper;
