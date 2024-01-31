import styled, { keyframes } from 'styled-components';

const DotWrapper = styled.span``;

export const glimmer = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  60% { opacity: 1; }
  100% { opacity: 0; }
`;

const Dot = styled.span`
  display: inline;
  opacity: 0;
  animation: ${glimmer} 2.5s ease-in-out infinite;

  &.one {
    animation-delay: 0.2s;
  }
  &.two {
    animation-delay: 0.4s;
  }
  &.three {
    animation-delay: 0.6s;
  }
`;

export default function InlineLoader() {
  return (
    <DotWrapper>
      <Dot className="one"> . </Dot>
      <Dot className="two"> . </Dot>
      <Dot className="three"> . </Dot>
    </DotWrapper>
  );
}
