import styled from 'styled-components';
import QuestionIcon from '@/assets/icons/question.svg?react';
import Tooltip from './base/Tooltip';

const Wrapper = styled.div``;

const RowWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  :not(:last-of-type) {
    margin-bottom: 16px;
  }
`;

const Label = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #505a7a;
  display: flex;
  justify-content: center;
  align-items: center;
  & > p {
    margin-right: 4px;
    word-wrap: nowrap;
  }
`;

const Data = styled.div<{ highlighted: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 32px;
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => (props.highlighted ? '#61B75F' : 'inherit')};
`;

function Row({ label, title, value = '', highlighted = false, tooltip = '' }) {
  return (
    <RowWrapper>
      <Label>
        <p>{label}</p>
        {tooltip && (
          <Tooltip text={tooltip}>
            <QuestionIcon />
          </Tooltip>
        )}
      </Label>
      <Data highlighted={highlighted} title={title}>
        {value}
      </Data>
    </RowWrapper>
  );
}

export default function DataTable({ data, ...rest }) {
  return (
    <Wrapper {...rest}>
      {data.map((datum) => (
        <Row key={datum.label} {...datum} />
      ))}
    </Wrapper>
  );
}
