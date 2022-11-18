import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import { useSpeechSynthesis } from 'react-speech-kit';

const Header = () => {
  const router = useRouter();
  const { account } = useWeb3React();

  const { speak } = useSpeechSynthesis();

  return (
    <div className="items-center w-full">
      <div className="flex mx-auto flex-col md:flex-row items-center md:justify-between py-5 px-5 md:px-10 shadow">
        <div className="flex flex-row space-x-2 items-center">
          <h4
            className="text-2xl font-bold text-green-300 cursor-pointer"
            onClick={() => router.push('/')}
          >
            SustainDAO
          </h4>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <button
            className={`${
              router.pathname === '/' ? 'text-green-300' : ''
            } hover:text-green-300`}
            onClick={() => {
              speak({
                text: 'Redirecting to dashboard',
              });
              router.push('/');
            }}
          >
            Dashboard
          </button>
          <button
            className={`${
              router.pathname === '/mint' ? 'text-green-300' : ''
            } !ml-5 !mr-4 hover:text-green-300`}
            onClick={() => {
              speak({
                text: 'Redirecting to NFT minting page',
              });
              router.push('/mint');
            }}
          >
            Mint NFT
          </button>
          <span className="overflow-ellipsis overflow-hidden">
            {account?.slice(0, 12)}...
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
