import styled from 'styled-components';

const CardStyled = styled.div<{ mode: string }>`
  background-image: url('/img/bg_pattern.png');
  background-color: ${(props) => (props.mode === 'light' ? '#161f29' : '#27272E')};
  background-blend-mode: color-dodge;
  color: white !important;
  padding: 32px;
  width: 100%;
  border-radius: 20px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 20px 20px;
  }
  min-width: 260px;
`;

export default function Card({ children, mode = 'light', ...rest }) {
  return (
    <CardStyled mode={mode} {...rest}>
      {children}
    </CardStyled>
  );
}
