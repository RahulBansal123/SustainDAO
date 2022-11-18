import React, { useEffect, useState } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';

import { OVERLAY_READY } from '../../components/connectors/fortmatic';
import usePrevious from '../../hooks/usePrevious';
import { getSupportedWallets } from '../../components/connectors';
import { getWalletIcon } from '../../utils';

import Option from './option';
import PendingView from './pendingView';

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin: 0;
  padding: 0;
  width: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  flex-flow: column nowrap;
  font-weight: 500;
  padding: 1rem;
  font-size: 1.1rem;
`;

const ContentWrapper = styled.div`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;
const BackButtonWrapper = styled.p`
  color: #5b5b5b;
  &:hover {
    color: #7888fc;
  }
`;

const UpperSection = styled.div`
  position: relative;
  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }
  h5:last-child {
    margin-bottom: 0px;
  }
  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`;

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr;
  grid-gap: 10px;
`;

const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`;

const WALLET_VIEWS = {
  ACCOUNT: 'account',
  PENDING: 'pending',
};

export default function WalletModal({ config, isOpen, onClose }) {
  const { active, account, connector, activate, error, chainId } =
    useWeb3React();
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);
  const [pendingWallet, setPendingWallet] = useState();
  const [pendingError, setPendingError] = useState();
  const previousAccount = usePrevious(account);
  const [supportedWallets, setSupportedWallets] = useState({});
  const { fortmatic, portis, injected } = supportedWallets;

  useEffect(() => {
    const supportedWallets = getSupportedWallets(config);
    setSupportedWallets(supportedWallets);
  }, [config]);

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && isOpen) {
      onClose();
    }
  }, [account, previousAccount, onClose, isOpen]);

  // always reset to account view
  useEffect(() => {
    if (isOpen) {
      setPendingError(false);
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [isOpen]);

  // close modal when a connection is successful
  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);
  useEffect(() => {
    if (
      isOpen &&
      ((active && !activePrevious) ||
        (connector && connector !== connectorPrevious && !error))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [
    setWalletView,
    active,
    error,
    connector,
    isOpen,
    activePrevious,
    connectorPrevious,
  ]);

  // close wallet modal if fortmatic modal is active
  useEffect(() => {
    fortmatic?.connector.on(OVERLAY_READY, () => {
      onClose();
    });
  }, [onClose, fortmatic]);

  const tryActivation = async (connector) => {
    Object.keys(supportedWallets).map((key) => {
      if (connector === supportedWallets[key].connector) {
        return supportedWallets[key].name;
      }
      return true;
    });
    setPendingWallet(connector); // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING);

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (
      connector instanceof WalletConnectConnector &&
      connector.walletConnectProvider?.wc?.uri
    ) {
      connector.walletConnectProvider = undefined;
    }

    connector &&
      activate(connector, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector); // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true);
        }
      });
  };

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask;
    return Object.keys(supportedWallets).map((key) => {
      const option = supportedWallets[key];
      // check for mobile options
      if (isMobile) {
        //disable portis on mobile for now
        if (option.connector === portis?.connector) {
          return null;
        }

        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              onClick={() => {
                option.connector !== connector &&
                  !option.href &&
                  tryActivation(option.connector);
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={getWalletIcon(key)}
              size={28}
            />
          );
        }
        return null;
      }

      // overwrite injected when needed
      if (option.connector === injected?.connector) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={'Install Metamask'}
                subheader={null}
                link={'https://metamask.io/'}
                size={28}
              />
            );
          }
          return null; //dont want to return install twice
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null;
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null;
        }
      }
      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector);
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} //use option.descriptio to bring back multi-line
            icon={getWalletIcon(key)}
            size={28}
          />
        )
      );
    });
  }

  const getModalContent = () => {
    if (error) {
      return (
        <UpperSection>
          <HeaderRow>
            {error instanceof UnsupportedChainIdError
              ? 'Unsupported Network'
              : 'Error in connection'}
          </HeaderRow>
          <ContentWrapper className="text-muted">
            {error instanceof UnsupportedChainIdError
              ? 'Please connect either to Ethereum Mainnet or Binance Smart Chain'
              : 'There seems to be something wrong while connecting with the wallet. Try refreshing the page.'}
          </ContentWrapper>
        </UpperSection>
      );
    }
    if (account && chainId) {
      // dispatch(setAddress(account));
      // dispatch(setChainId(chainId || 0x1));
      return;
    }
    return (
      <UpperSection>
        {walletView !== WALLET_VIEWS.ACCOUNT && (
          <HeaderRow color="blue">
            <HoverText
              onClick={() => {
                setPendingError(false);
                setWalletView(WALLET_VIEWS.ACCOUNT);
              }}
            >
              <BackButtonWrapper>Back</BackButtonWrapper>
            </HoverText>
          </HeaderRow>
        )}
        <ContentWrapper>
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              connector={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
              supportedWallets={supportedWallets}
            />
          ) : (
            <OptionGrid>{getOptions()}</OptionGrid>
          )}
        </ContentWrapper>
      </UpperSection>
    );
  };

  return <Wrapper>{getModalContent()}</Wrapper>;
}
