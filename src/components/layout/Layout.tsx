import styled from 'styled-components';
import Header from './Header';
import { PropsWithChildren } from 'react';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-width: 320px;

  max-width: 536px;
  margin: 0 auto 200px;
  padding: 0 20px;
`;

const LayoutTitleStyle = styled.h1`
  font-size: 26px;
  line-height: 38px;
  font-weight: 800;
  color: #273852;
  margin-bottom: 4px;
`;

const LayoutSubTitleStyle = styled.h4`
  font-size: 12px;
  font-weight: 500;
  color: #7a8aa0;
  margin-bottom: 16px;
`;

type LayoutProps = {
  title: string;
  subtitle: string;
  wide?: boolean;
};

export default function Layout({ children, title, subtitle }: PropsWithChildren<LayoutProps>) {
  return (
    <>
      <Header />
      <Content>
        <LayoutTitleStyle>{title}</LayoutTitleStyle>
        <LayoutSubTitleStyle>{subtitle}</LayoutSubTitleStyle>
        {children}
      </Content>
    </>
  );
}
