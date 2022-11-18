import React, { useState } from "react";
import Modal from "../../utils/modal";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { useSpeechSynthesis } from "react-speech-kit";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import dynamic from "next/dynamic";
const WalletModal = dynamic(() => import("./walletModal"), {
  ssr: false,
});

const ModalContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 1.6rem 0 1.6rem;
`;

const Auth = () => {
  const [isOpen, toggle] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const { speak, cancel, speaking } = useSpeechSynthesis();

  const commands = [
    {
      command: ["go to dashboard", "redirect to dashboard"],
      callback: () => {
        speak({ text: "Please connect your wallet first" });
        resetTranscript();
        setIsListening(false);
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
        speak({ text: "Please connect your wallet first" });
        resetTranscript();
        setIsListening(false);
      },
    },
    {
      command: [
        "connect wallet",
        "connect my wallet",
        "connect metamask",
        "connect metamask wallet",
        "connect to a wallet",
      ],
      callback: () => {
        handleClick();
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

  const handleClick = () => {
    speak({
      text: "Connecting to your wallet. Please choose a provider. Make sure you are on the polygon testnet.",
    });
    toggle(true);
  };

  const config = {
    supportedChainIds: [137, 80001], //  137 - polygon mainnet, 80001 - polygon testnet
    connectors: {
      walletconnect: {
        qrcode: true,
      },
      walletlink: {
        qrcode: true,
      },
    },
  };

  console.log("transcript: ", transcript);
  return (
    <div>
      <div className="flex flex-wrap md:justify-center w-full">
        <div className="relative flex flex-col bg-white rounded-2xl border-0 shadow-md top-1/2 translate-y-3/4 md:translate-y-1/2 w-11/12 mx-auto md:w-1/3 text-center">
          <div className="flex-1 p-10">
            <div className="text-center">
              <img
                src="/assets/logo.png"
                alt="SustainDAO"
                width="90%"
                className="mx-auto hover:scale-125 transition-all duration-500"
              />
            </div>
            <div className="text-center my-5 text-base">
              <p>Please connect your wallet</p>
            </div>
            <div className="flex">
              <button
                className="btn border border-green-400 text-green-400 w-full hover:text-green-500 hover:shadow-md"
                onClick={handleClick}
              >
                Connect to a wallet
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        handleClose={() => toggle(false)}
        width={isMobile ? 85 : 35}
        height={isMobile ? 60 : 80}
        title="Connect to a wallet"
      >
        <ModalContent className="flex-column">
          <WalletModal
            isOpen={isOpen}
            onClose={() => toggle(false)}
            config={config}
          />
        </ModalContent>
      </Modal>

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
          <img
            src="/assets/microphone.png"
            alt="SustainDAO"
            className="w-full h-full"
          />
        )}
      </button>
    </div>
  );
};

export default Auth;
