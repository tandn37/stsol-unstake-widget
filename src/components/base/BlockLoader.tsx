import styled, { keyframes } from 'styled-components';

export default function BlockLoader({ dark = false }) {
  return <Wrapper dark={dark} />;
}

export const glimmer = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  60% { opacity: 1; }
  100% { opacity: 0; }
`;

const shine = keyframes`
  from {
    background-position-x: 200%;
  }
  to {
    background-position-x: -200%;
  }
`;

const Wrapper = styled.p<{ dark: boolean }>`
  /* position: relative; */
  height: 1em;
  width: 150px;
  z-index: 0;
  border-radius: 20px;
  overflow: hidden;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 130px;
  }
  background: linear-gradient(
    270deg,
    ${(props) =>
      props.dark
        ? 'rgba(250, 250, 250, 0.1), rgba(250, 250, 250, 0.05), rgba(250, 250, 250, 0.1)'
        : '#F2F4F6, #FFFFFF, #F2F4F6'}
  );
  background-size: 200%;
  animation: ${shine} 2.5s infinite linear;
`;
