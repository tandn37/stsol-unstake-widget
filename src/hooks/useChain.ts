import { getConfig } from '@/contexts/config';

const useChain = () => {
  const { activeSolanaChain } = getConfig();

  return activeSolanaChain;
};

export default useChain;
