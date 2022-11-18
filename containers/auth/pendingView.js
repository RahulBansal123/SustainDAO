import React from 'react';
import styled from 'styled-components';
import Option from './option';
import { getWalletIcon } from '../../utils';

const PendingSection = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  & > * {
    width: 100%;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: flex-start;
  border-radius: 12px;
  margin-bottom: 20px;
  font-weight: 500;
  & > * {
    width: 100%;
  }
  height: 50px;
`;

const ErrorGroup = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
`;

const ErrorButton = styled.button`
  margin: 8px;
  border-radius: 12px;
  padding: 10px 15px;
  width: 100%;
  color: #f75d6fd8;
  background-color: #fad7dd98;
  border: 0.1px solid #fad7dd;
  :hover {
    cursor: pointer;
    background-color: #fad7dd80;
    border: 0.1px solid #fad7dd;
  }
`;

export default function PendingView({
  connector,
  error = false,
  setPendingError,
  tryActivation,
  supportedWallets,
}) {
  const isMetamask = window?.ethereum?.isMetaMask;

  return (
    <PendingSection>
      <LoadingMessage>
        <LoadingWrapper>
          {error ? (
            <ErrorGroup>
              <p>Error in connecting with the wallet</p>
              {connector && (
                <ErrorButton
                  onClick={() => {
                    setPendingError(false);
                    tryActivation(connector);
                  }}
                >
                  Try again
                </ErrorButton>
              )}
            </ErrorGroup>
          ) : (
            <p className="text-muted">Initializing...</p>
          )}
        </LoadingWrapper>
      </LoadingMessage>
      {error &&
        Object.keys(supportedWallets).map((key) => {
          const option = supportedWallets[key];
          if (option.connector === connector) {
            if (option.connector === supportedWallets['injected'].connector) {
              if (
                (isMetamask && option.name !== 'MetaMask') ||
                (!isMetamask && option.name === 'Metamask')
              ) {
                return null;
              }
            }
            return (
              <div className="mt-5">
                <Option
                  id={`connect-${key}`}
                  key={key}
                  clickable={false}
                  color={option.color}
                  header={option.name}
                  subheader={option.description}
                  icon={getWalletIcon(key)}
                  size={28}
                />
              </div>
            );
          }
          return null;
        })}
    </PendingSection>
  );
}
