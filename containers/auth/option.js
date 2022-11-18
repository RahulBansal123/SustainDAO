import React from 'react';
import styled from 'styled-components';

const InfoCard = styled.button`
  background-color: ${({ active }) => (active ? '#F7F8FA' : '#fff')};
  outline: none;
  border: 1px solid rgb(206, 208, 217);
  border-radius: 12px;
  width: 100% !important;
`;

const OptionCard = styled(InfoCard)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
`;

const OptionCardLeft = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  height: 100%;
`;

const OptionCardClickable = styled(OptionCard)`
  background-color: rgba(237, 238, 242, 0.4);
  &:hover {
    cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
    border: ${({ clickable }) => (clickable ? '1px solid #4287f5' : ``)};
  }
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
`;

const GreenCircle = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  &:first-child {
    height: 8px;
    width: 8px;
    margin-right: 8px;
    background-color: green;
    border-radius: 50%;
  }
`;

const CircleWrapper = styled.div`
  color: green;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderText = styled.div`
  display: flex;
  flex-flow: column nowrap;
  color: black;
  text-align: left;
  font-size: 1.15rem;
  font-weight: 400;
  margin-top: 0.2rem;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '24px')};
    width: ${({ size }) => (size ? size + 'px' : '24px')};
  }
  align-items: flex-end;
`;

export default function Option({
  link = null,
  clickable = true,
  size,
  onClick = null,
  color,
  header,
  subheader = null,
  active = false,
  id,
  icon,
}) {
  const content = (
    <OptionCardClickable
      id={id}
      onClick={onClick}
      clickable={clickable && !active}
      active={active}
    >
      <OptionCardLeft>
        <HeaderText color={color}>
          {active ? (
            <CircleWrapper>
              <GreenCircle>
                <div />
              </GreenCircle>
            </CircleWrapper>
          ) : (
            ''
          )}
          <p className="text-black">{header}</p>
        </HeaderText>
        {subheader && (
          <p className="text-dark" style={{ marginTop: -5, fontSize: 12 }}>
            {subheader}
          </p>
        )}
      </OptionCardLeft>
      <IconWrapper size={size}>
        <img src={icon} alt={'Icon'} />
      </IconWrapper>
    </OptionCardClickable>
  );

  if (link) {
    return <a href={link}>{content}</a>;
  }

  return content;
}
