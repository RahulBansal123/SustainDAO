import { useLayoutEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

import getContract from "./getContract";
import APIConsumerABI from "../abis/APIConsumer.json";
import MintNFTABI from "../abis/MintNFT.json";
import PriceDataFeedABI from "../abis/PriceDataFeed.json";
import { useRouter } from "next/router";
import { useSpeechSynthesis } from "react-speech-kit";

const Web3Container = (props) => {
  const [state, setState] = useState({
    web3: null,
    contract: { price: null, mint: null, api: null },
  });

  const router = useRouter();
  const { account, library } = useWeb3React();
  const { speak } = useSpeechSynthesis();

  useLayoutEffect(() => {
    const init = async () => {
      try {
        const web3 = new Web3(library.provider);

        const networkId = await web3.eth.net.getId();
        if (networkId !== 80001) {
          await speak({
            text: "Please switch to the mumbai testnet and refresh the page",
          });
        }

        const PriceDataFeed = await getContract(web3, PriceDataFeedABI);
        const MintNFT = await getContract(web3, MintNFTABI);
        const APIConsumer = await getContract(web3, APIConsumerABI);

        setState({
          web3,
          contract: {
            price: PriceDataFeed,
            mint: MintNFT,
            api: APIConsumer,
          },
        });

        speak({
          text: "Welcome to the SustainDAO",
        });
      } catch (error) {
        speak({
          text: "Failed to connect, Please try again.",
        });
        console.error(error);
      }
    };
    if (account) init();
  }, [account]);

  if (router.pathname === "/auth") {
    return props.render({ web3: null, account: null, contract: null });
  }

  if (!account) {
    router.push("/auth");
    return null;
  }

  return props.render({ web3: state.web3, account, contract: state.contract });
};

export default Web3Container;
