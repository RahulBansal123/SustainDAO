import { useWeb3React } from '@web3-react/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useSpeechSynthesis } from 'react-speech-kit';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import Web3 from 'web3';
import MintNFTContract from '../../abis/MintNFT.json';

import Header from '../../components/layout/Header';
import { fetchTransactions, store } from '../../utils';

const Main = () => {
  const router = useRouter();
  const { account, library } = useWeb3React();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const prices = useSelector((state) => state.main.prices);
  const inflation = useSelector((state) => state.main.inflation);

  const web3 = new Web3(library.provider);
  const mintContract = new web3.eth.Contract(
    MintNFTContract.abi,
    MintNFTContract.networks[80001].address
  );

  const { speak, cancel, speaking } = useSpeechSynthesis();

  const commands = [
    {
      command: ['go to dashboard', 'redirect to dashboard'],
      callback: () => {
        resetTranscript();
        setIsListening(false);
        speak({ text: 'Redirecting to dashboard' });
        router.push('/');
      },
    },
    {
      command: [
        'go to mint page',
        'go to mint nft page',
        'go to nft minting page',
        'redirect to mint page',
        'redirect to nft minting page',
        'redirect to mint nft page',
      ],
      callback: () => {
        resetTranscript();
        setIsListening(false);
        speak({ text: 'Redirecting to nft minting page' });
        router.push('/mint');
      },
    },
    {
      command: [
        'get my wallet balance',
        'get balance',
        'get latest balance',
        'what is my current balance',
        'what is my balance',
        'what is my ethereum balance',
      ],
      callback: async () => {
        const balance = parseFloat(
          web3.utils.fromWei(await web3.eth.getBalance(account))
        ).toFixed(2);
        SpeechRecognition.stopListening();
        resetTranscript();
        setIsListening(false);
        speak({ text: `Your balance is ${balance} ether` });
      },
    },
    {
      command: [
        'tell the price of *',
        'get the price of *',
        'what is the price of *',
      ],
      callback: (token) => {
        const coin = token.toLowerCase();
        if (coin === 'btc' || coin === 'bitcoin') {
          speak({ text: `price of ${coin} is $${prices.btc.toString()}` });
        } else if (coin === 'eth' || coin === 'ethereum') {
          speak({ text: `price of ${coin} is $${prices.eth.toString()}` });
        } else if (coin === 'matic' || coin === 'matic token') {
          speak({ text: `price of ${coin} is $${prices.matic.toString()}` });
        } else if (coin === 'usdc' || coin === 'usdc token') {
          speak({ text: `price of ${coin} is $${prices.usdc.toString()}` });
        } else if (coin === 'link' || coin === 'chainlink') {
          speak({ text: `price of ${coin} is $${prices.link.toString()}` });
        } else {
          speak({ text: `I don't know the price of ${coin}` });
        }
        SpeechRecognition.stopListening();
        resetTranscript();
        setIsListening(false);
      },
    },
    {
      command: [
        'get last * transactions',
        'get last * transaction',
        'get my last * transaction',
        'get my last * transactions',
        'fetch last * transactions',
        'fetch last * transaction',
        'fetch my last * transaction',
        'fetch my last * transactions',
        'check my last * transaction',
      ],
      callback: async (total) => {
        const txs = await fetchTransactions(account, total);
        const myTxs = txs.slice(0, parseInt(total));
        const txsText = myTxs.map((tx) => {
          return `${tx.from_address} sent ${tx.value} ether to ${tx.to_address}`;
        });

        console.log(txsText);
        txsText.forEach((tx) => {
          speak({ text: tx });
        });
        SpeechRecognition.stopListening();
        resetTranscript();
        setIsListening(false);
      },
    },
    {
      command: [
        'set title to *',
        'set my title to *',
        'set my nft title to *',
        'set nft title to *',
      ],
      callback: async (title) => {
        setTitle(title);
        SpeechRecognition.stopListening();
        resetTranscript();
        setIsListening(false);
      },
    },
    {
      command: [
        'set description to *',
        'set my description to *',
        'set my nft description to *',
        'set nft description to *',
      ],
      callback: async (description) => {
        setDescription(description);
        SpeechRecognition.stopListening();
        resetTranscript();
        setIsListening(false);
      },
    },
    {
      command: ['mint it', 'mint NFT', 'mint my nft', 'mint my nft token'],
      isFuzzyMatch: true,
      callback: async () => {
        mint();
        SpeechRecognition.stopListening();
        resetTranscript();
        setIsListening(false);
      },
    },
    {
      command: [
        'get current year inflation rate',
        'get current inflation rate',
        'get current year inflation',
        'get current inflation',
        'what is the current year inflation rate',
        'what is the current inflation rate',
      ],
      callback: async () => {
        speak({ text: `The current year inflation rate is ${inflation}` });
        SpeechRecognition.stopListening();
        resetTranscript();
        setIsListening(false);
      },
    },
  ];
  const {
    transcript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    resetTranscript,
  } = useSpeechRecognition({ commands });

  const startListening = async () => {
    if (!browserSupportsSpeechRecognition) {
      speak({
        text: "Browser doesn't support speech recognition",
      });
      setIsListening(false);
      return;
    }
    if (!isMicrophoneAvailable) {
      speak({
        text: 'Please allow access to microphone',
      });
      setIsListening(false);
      return;
    }
    setIsListening(true);
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US',
    });
  };

  const mint = async () => {
    setLoading(true);
    try {
      const res = await store(file, title, description);
      console.log(res);

      const response = await mintContract.methods
        .mint(res)
        .send({ from: account });
      console.log(response);
      const tokenId = response.events.Transfer.returnValues.tokenId;

      speak({
        text: `NFT minted successfully with token id of ${tokenId}`,
      });
      setLoading(false);
      resetTranscript();
      setTitle('');
      setDescription('');
      setFile(null);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  console.log('transcript: ', transcript);

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen py-2">
      <Head>
        <title>SustainDAO</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="container max-w-4xl py-4 mt-5">
        <h1 className="text-3xl font-bold text-center my-5">Mint NFT</h1>
        <input
          className="w-full py-1 px-2 border rounded-xl my-4 outline-none"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full py-1 px-2 border rounded-xl my-4 outline-none"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          onChange={(e) => setFile(e.target.files[0])}
          className="my-3"
          type="file"
        />

        {file && (
          <div className="mt-2">
            <img src={URL.createObjectURL(file)} alt="preview" />
          </div>
        )}

        <div className="flex w-full justify-center">
          <button
            className="mx-auto my-5 flex-shrink-0 text-xl py-2 px-4 rounded shadow bg-green-500 text-white hover:shadow-lg transition-all disabled:bg-green-200"
            type="button"
            aria-label="mint"
            disabled={loading}
            onClick={mint}
          >
            {loading ? 'Loading' : 'Mint'}
          </button>
        </div>
      </div>

      <button
        className="fixed bottom-8 right-8 w-auto h-16 p-3 shadow-xl rounded-full cursor-pointer hover:scale-110 transition-all border"
        onClick={() => {
          if (isListening) {
            SpeechRecognition.stopListening();
            resetTranscript();
            setIsListening(false);
          } else if (speaking) {
            cancel();
          } else {
            startListening();
          }
        }}
      >
        {isListening ? (
          <span>Listening...</span>
        ) : (
          <>
            {speaking ? (
              <img
                src="/assets/stop.png"
                alt="SustainDAO"
                className="w-full h-full"
              />
            ) : (
              <img
                src="/assets/microphone.png"
                alt="SustainDAO"
                className="w-full h-full"
              />
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default Main;
