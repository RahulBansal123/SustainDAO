import React from 'react';
import styled from 'styled-components';

const CloseButton = styled.svg`
  width: 15px;
  height: 15px;
  position: absolute;
  right: 25px;
  top: 21px;
  cursor: pointer;
`;

const H5 = styled.h5`
  margin: 0 2rem 0 2rem;
  font-weight: 500;
  font-size: 1.2rem;
`;

const Container = styled.div`
  position: fixed;
  z-index: 12;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
const Overlay = styled.div`
  position: fixed;
  z-index: 12;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
`;

const ModalContainer = styled.div`
  padding: 18px 0;
  width: ${(props) => props.width}%;
  max-height: ${(props) => props.height}%;
  z-index: 13;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  overflow-x: hidden;
  overflow-y: scroll;
`;
const Modal = ({
  title,
  width = 50,
  height = 50,
  handleClose,
  children,
  isOpen,
}) => {
  if (width <= 0 || width > 100 || height <= 0 || height > 100) {
    console.error('Modal height and width should be in range of [0,100]');
  }

  return (
    <>
      {isOpen && (
        <Container>
          <Overlay onClick={handleClose}></Overlay>
          <ModalContainer width={width} height={height}>
            <CloseButton
              onClick={handleClose}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20.39 20.39"
              id="modal-close-button"
            >
              <title>close</title>
              <line
                x1="19.39"
                y1="19.39"
                x2="1"
                y2="1"
                fill="none"
                stroke={'currentcolor'}
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="3"
              />
              <line
                x1="1"
                y1="19.39"
                x2="19.39"
                y2="1"
                fill="none"
                stroke={'currentcolor'}
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="3"
              />
            </CloseButton>
            <H5>{title}</H5>
            {children}
          </ModalContainer>
        </Container>
      )}
    </>
  );
};

export default Modal;
