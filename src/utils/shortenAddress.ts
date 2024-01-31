import { PublicKey } from '@solana/web3.js';

export const shortenAddress = (address: string | PublicKey, isMobile = false) => {
  const parsedAddress = address.toString();
  const len = parsedAddress.length;
  const sliceUpTo = isMobile ? 3 : 6;

  return `${parsedAddress.slice(0, sliceUpTo)}...${parsedAddress.slice(len - sliceUpTo, len)}`;
};
