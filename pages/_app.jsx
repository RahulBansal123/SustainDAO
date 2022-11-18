import 'regenerator-runtime/runtime';
import 'tailwindcss/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';
import '../global.css';

import { useStore } from '../store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Web3ReactProvider } from '@web3-react/core';
import dynamic from 'next/dynamic';

import getLibrary from '../utils/getLibrary';

const Web3ReactProviderDefault = dynamic(
  () => import('../components/defaultprovider'),
  { ssr: false }
);

const AuthWrapper = dynamic(() => import('../containers/auth/authWrapper'), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <>
      <Provider store={store}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ReactProviderDefault getLibrary={getLibrary}>
            <AuthWrapper>
              <Component {...pageProps} />
            </AuthWrapper>
          </Web3ReactProviderDefault>
        </Web3ReactProvider>
      </Provider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        draggable={true}
        pauseOnVisibilityChange
        closeOnClick
        pauseOnHover
      />
    </>
  );
}

export default MyApp;
