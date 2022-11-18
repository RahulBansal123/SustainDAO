import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Web3 from "web3";

import Header from "../../components/layout/Header";
import CoinImage from "../../utils/CoinImage";
import { fetchTransactions } from "../../utils";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { fetchCryptoPrices, setCurrentInflation } from "./actions";
import {
  getBTCPrice,
  getETHPrice,
  getLINKPrice,
  getMATICPrice,
  getUSDCPrice,
  fetchInflation,
  fetchInflationAgain,
} from "../../utils/getPrice";

const Card = ({ name, price }) => (
  <div class="max-w-sm m-5 rounded-xl overflow-hidden shadow-lg p-6 flex items-center">
    <CoinImage symbol={name} />
    <div class="px-6 py-4">
      <h4 class="font-bold text-xl mb-2">{name.toUpperCase()}</h4>
      <p class="text-gray-700 text-base">PRICE: ${price}</p>
    </div>
  </div>
);

const Main = () => {
  const router = useRouter();
  const { account, library } = useWeb3React();
  const web3 = new Web3(library.provider);
  const [txs, setTxs] = useState(null);
  const [inflation, setInflation] = useState(0);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState({
    btc: 0,
    eth: 0,
    matic: 0,
    usdc: 0,
    link: 0,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPrices = async () => {
      const networkId = await web3.eth.net.getId();
      if (networkId !== 80001) {
        await speak({
          text: "Please switch to the mumbai testnet and refresh the page",
        });
        return;
      }

      const btc = await getBTCPrice();
      const eth = await getETHPrice();
      const matic = await getMATICPrice();
      const usdc = await getUSDCPrice();
      const link = await getLINKPrice();

      setPrices({
        btc,
        eth,
        matic,
        usdc,
        link,
      });
      dispatch(fetchCryptoPrices({ btc, eth, matic, usdc, link }));
    };

    const fetchTxs = async () => {
      const txs = await fetchTransactions(account, 5);
      console.log(txs);
      setTxs(txs);
    };

    const findInflation = async () => {
      const inflation = await fetchInflation();
      setInflation(inflation);
      dispatch(setCurrentInflation(inflation));
    };

    fetchTxs();
    fetchPrices();
    findInflation();
  }, []);

  const commands = [
    {
      command: ["go to dashboard", "redirect to dashboard"],
      callback: () => {
        resetTranscript();
        setIsListening(false);
        speak({ text: "Redirecting to dashboard" });
        router.push("/");
      },
    },
    {
      command: [
        "go to mint page",
        "go to mint nft page",
        "go to nft minting page",
        "redirect to mint page",
        "redirect to nft minting page",
        "redirect to mint nft page",
      ],
      callback: () => {
        resetTranscript();
        setIsListening(false);
        speak({ text: "Redirecting to nft minting page" });
        router.push("/mint");
      },
    },
    {
      command: [
        "get my wallet balance",
        "get balance",
        "get latest balance",
        "what is my current balance",
        "what is my balance",
        "what is my ethereum balance",
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
        "tell the price of *",
        "get the price of *",
        "what is the price of *",
      ],
      callback: (token) => {
        const coin = token.toLowerCase();
        if (coin === "btc" || coin === "bitcoin") {
          speak({ text: `price of ${coin} is $${prices.btc.toString()}` });
        } else if (coin === "eth" || coin === "ethereum") {
          speak({ text: `price of ${coin} is $${prices.eth.toString()}` });
        } else if (coin === "matic" || coin === "matic token") {
          speak({ text: `price of ${coin} is $${prices.matic.toString()}` });
        } else if (coin === "usdc" || coin === "usdc token") {
          speak({ text: `price of ${coin} is $${prices.usdc.toString()}` });
        } else if (coin === "link" || coin === "chainlink") {
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
        "get last * transactions",
        "get last * transaction",
        "get my last * transaction",
        "get my last * transactions",
        "fetch last * transactions",
        "fetch last * transaction",
        "fetch my last * transaction",
        "fetch my last * transactions",
        "check my last * transaction",
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
        "get current year inflation rate",
        "get current inflation rate",
        "get current year inflation",
        "get current inflation",
        "what is the current year inflation rate",
        "what is the current inflation rate",
      ],
      callback: async () => {
        speak({ text: `The current year inflation rate is ${inflation} %` });
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
  const { speak, cancel, speaking } = useSpeechSynthesis();

  const [isListening, setIsListening] = useState(false);

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
        text: "Please allow access to microphone",
      });
      setIsListening(false);
      return;
    }
    setIsListening(true);
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const fetchAgain = async () => {
    setLoading(true);
    const networkId = await web3.eth.net.getId();
    if (networkId !== 80001) {
      speak({ text: "Please switch to the mumbai testnet" });
      return;
    }

    try {
      const inflation = await fetchInflationAgain(account);
      setInflation(inflation);
      dispatch(setCurrentInflation(inflation));
      setLoading(false);
    } catch (error) {
      speak({ text: "Something went wrong. Please try again" });
      console.log(error);
      setLoading(false);
    }
  };

  console.log("transcript: ", transcript);

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen py-2">
      <Head>
        <title>SustainDAO</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="container py-4">
        <form className="w-full flex justify-center mt-5 mb-16">
          <div className="mx-auto flex items-center border-b border-green-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder={isListening ? "Listening..." : "What's on your mind"}
              aria-label="Search here"
            />
            <button
              className="ml-2 flex-shrink-0 text-sm py-2 px-2 rounded-full shadow bg-green-500 hover:shadow-lg transition-all"
              type="button"
              aria-label="search"
            >
              <img src="/assets/search.svg" alt="search" className="w-6 h-6" />
            </button>
            <button
              className="ml-2 flex-shrink-0 text-sm py-2 px-2 rounded-full shadow bg-white hover:shadow-lg transition-all"
              type="button"
              aria-label="speak"
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
              {speaking ? (
                <img
                  src="/assets/stop.png"
                  alt="SustainDAO"
                  className="w-6 h-6"
                />
              ) : (
                <img
                  src="/assets/microphone.png"
                  alt="SustainDAO"
                  className="w-6 h-6"
                />
              )}
            </button>
          </div>
        </form>

        <h1 className="text-2xl font-bold text-black/90">Price Feed</h1>
        <div className="w-full flex flex-wrap">
          {Object.keys(prices).map((price) => (
            <Card name={price} price={prices[price]} />
          ))}
        </div>

        <h1 className="mt-24 text-2xl font-bold text-black/90">
          Your last transactions
        </h1>
        <div className="w-full flex flex-col">
          {txs?.map((item) => (
            <div className="w-full m-5 rounded-xl overflow-hidden shadow-lg p-6 flex items-center">
              <p className="bg-gray-100 rounded-full p-3 font-semibold">Tx</p>

              <div className="w-full grid grid-cols-3">
                <div className="flex flex-col mx-5 text-base">
                  <Link href={`https://etherscan.io/tx/${item.tx_hash}`}>
                    <a className="text-blue-600 hover:text-blue-500">
                      {item.tx_hash?.slice(0, 20)}...
                    </a>
                  </Link>
                  <p className="text-sm">
                    {new Date(item.block_signed_at).toDateString()}
                  </p>
                </div>

                <Link
                  href={`https://etherscan.io/address/${item.from_address}`}
                >
                  <a className="ml-1 text-blue-600 hover:text-blue-500">
                    <span className="text-black">From: </span>
                    {item.from_address?.slice(0, 20)}...
                  </a>
                </Link>

                <Link href={`https://etherscan.io/address/${item.to_address}`}>
                  <a className="ml-1 text-blue-600 hover:text-blue-500">
                    <span className="text-black">To: </span>
                    {item.to_address?.slice(0, 20)}...
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 flex items-center">
          <h1 className="text-2xl font-bold text-black/90">
            YoY Inflation Rate
          </h1>
          <button
            className="ml-5 flex-shrink-0 text-sm py-2 px-4 rounded shadow bg-green-500 hover:shadow-lg transition-all disabled:bg-green-200"
            type="button"
            aria-label="fetch"
            onClick={fetchAgain}
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch Again"}
          </button>
        </div>

        <div className="w-full flex flex-wrap">
          <div class="max-w-sm m-5 rounded-xl overflow-hidden shadow-lg p-6 flex items-center">
            <div class="px-6 py-4">
              <h4 class="font-bold text-xl mb-2">INFLATION</h4>
              <p class="text-gray-700 text-base">{inflation}%</p>
            </div>
          </div>
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
