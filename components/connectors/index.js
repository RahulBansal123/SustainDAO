import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { PortisConnector } from '@web3-react/portis-connector';

import { FortmaticConnector } from './fortmatic';

import { SUPPORTED_WALLETS } from '../../constants';

const connectors = {
  injected: InjectedConnector,
  walletconnect: WalletConnectConnector,
  walletlink: WalletLinkConnector,
  fortmatic: FortmaticConnector,
  portis: PortisConnector,
};

export const injected = new InjectedConnector({
  supportedNetworks: [137, 80001],
});

export function getSupportedWallets(config) {
  const supportedWallets = {
    injected: {
      connector: injected,
      ...SUPPORTED_WALLETS['injected'],
    },
    metamask: {
      connector: injected,
      ...SUPPORTED_WALLETS['metamask'],
    },
  };
  Object.keys(config.connectors).forEach((key) => {
    supportedWallets[key] = {
      connector: new connectors[key](config.connectors[key]),
      ...SUPPORTED_WALLETS[key],
    };
  });
  return supportedWallets;
}
