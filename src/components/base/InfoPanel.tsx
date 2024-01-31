import React from 'react';
import styled from 'styled-components';

import QuestionIcon from '@/assets/icons/question.svg?react';

export default function InfoPanel({ children }) {
  return (
    <Container>
      <QuestionIcon />
      <span>{children}</span>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  margin-top: 0.8rem;
  background-color: ${({ theme }) => theme.colors.primary}10;
  color: ${({ theme }) => theme.colors.primary};
  padding: 1rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;

  svg {
    min-width: 16px; // svg size
    margin-right: 0.6rem;
    margin-top: 0.3rem;
    color: red;
  }
`;
