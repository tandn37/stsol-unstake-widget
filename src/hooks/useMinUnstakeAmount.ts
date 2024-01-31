import { useSDK } from '@/contexts/sdk';
import { useEffect, useState } from 'react';

export const useMinUnstakeAmount = () => {
  const [minAmount, setMinAmount] = useState<number>();
  const sdk = useSDK();

  useEffect(() => {
    void (async function getMinimumBalance() {
      const amount = await sdk?.calculateMinUnStakeAmount();
      setMinAmount(amount);
    })();
  }, [sdk]);

  return minAmount;
};
