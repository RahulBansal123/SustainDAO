import axios from "axios";
import { NFTStorage, File } from "nft.storage";

export function getWalletIcon(wallet: string) {
  switch (wallet) {
    case "metamask":
      return "/assets/images/metamask.png";
    case "walletconnect":
      return "/assets/images/walletConnectIcon.svg";
    case "walletlink":
      return "/assets/images/coinbaseWalletIcon.svg";
    case "coinbaselink":
      return "/assets/images/coinbaseWalletIcon.svg";
    case "fortmatic":
      return "/assets/images/fortmaticIcon.png";
    case "portis":
      return "/assets/images/portisIcon.png";
    case "injected":
    default:
      return "/assets/images/arrow-right.svg";
  }
}

export async function fetchTransactions(wallet: string, size: number) {
  const res = await axios.get(
    `https://api.covalenthq.com/v1/80001/address/${wallet}/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=true&page-size=${size}&key=ckey_0558d0ad7c714d8b894c426821e`
  );

  return res.data.data.items;
}

export async function store(file: File, title: string, description: string) {
  const token = process.env.NEXT_PUBLIC_STORAGE;

  const client = new NFTStorage({ token });

  const metadata = await client.store({
    name: title,
    description,
    image: file,
  });
  return metadata?.ipnft;
}

export async function get(cid: string) {
  const fetchUrl = `https://${cid}.ipfs.dweb.link/${encodeURIComponent(
    "metadata.json"
  )}`;
  const res = await fetch(fetchUrl);
  if (!res.ok) {
    console.error(
      `error fetching post metadata: [${res.status}] ${res.statusText}`
    );
    return null;
  }
  const metadata = await res.json();

  const extractImageCID = metadata.image?.split("/")[2];
  const extractImage = metadata.image?.split("/").splice(3)?.join("/");
  const url = `https://${extractImageCID}.ipfs.dweb.link/${encodeURIComponent(
    extractImage
  )}`;
  return { ...metadata, url };
}
