import { FC, useCallback, useState } from 'react';
import Collapsible, { CollapsibleProps } from 'react-collapsible';
import styled, { css } from 'styled-components';

import Chevron from '@/assets/icons/chevron.svg?react';

const AccordionWrapper = styled.div`
  user-select: none;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 8px;
`;

const expandedCss = css`
  border-radius: 10px 10px 0px 0px;
  svg {
    transform: translate(0, -50%) rotate(-180deg);
  }
`;

const AccordionSummary = styled.p<{ expanded: boolean }>`
  display: flex;
  justify-content: center;
  grid-template-columns: auto 24px;
  grid-gap: 16px;
  padding: 16px;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.primary};
  &:hover {
    cursor: pointer;
  }

  position: relative;

  svg {
    margin-top: 10px;
    transform: translate(0, -50%);
    transition: transform 0.3s ease;
    & > path {
      stroke: ${({ theme }) => theme.colors.primary};
    }
  }

  ${(props) => (props.expanded ? expandedCss : '')}
`;

export default function Accordion({ defaultExpanded, summary, children, onExpand }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const handleClick = useCallback(() => {
    setExpanded(!expanded);
    onExpand(!expanded);
  }, [expanded, onExpand]);

  return (
    <AccordionWrapper onClick={handleClick}>
      <AccordionContent
        expanded={expanded}
        trigger={<AccordionHeader expanded={expanded}>{summary}</AccordionHeader>}
      >
        {children}
      </AccordionContent>
    </AccordionWrapper>
  );
}

export const AccordionHeader: FC<{ expanded?: boolean }> = ({ children, expanded }) => (
  <AccordionSummary expanded={expanded}>
    <span>{children}</span>
    <Chevron />
  </AccordionSummary>
);

export const AccordionContent: FC<{ expanded?: boolean; trigger?: CollapsibleProps['trigger'] }> = ({
  children,
  expanded,
  trigger = null,
}) => (
  <Collapsible trigger={trigger} transitionTime={200} open={expanded} easing="ease-out">
    {children}
  </Collapsible>
);
