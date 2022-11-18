import { useState } from 'react';

const Image = ({ symbol }) => {
  const [src, setSrc] = useState(
    `https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/${symbol?.toLowerCase()}.webp`
  );
  const onError = () => {
    setSrc('/assets/images/default_coin.png');
  };
  return (
    <img
      src={src}
      alt={symbol}
      onError={onError}
      width={64}
      className="rounded-full"
    />
  );
};

export default Image;
