import { useEffect, useState } from 'react';

import { useAccount } from '@/contexts/account';
import { useSDK } from '@/contexts/sdk';

type MaxAmountValue = {
  value: number;
  isReady: boolean;
};

export default function useMaxUnstakeAmount() {
  const [maxAmount, setMaxAmount] = useState<MaxAmountValue>({ value: 0, isReady: false });
  const { active, stSol } = useAccount();

  const sdk = useSDK();

  useEffect(() => {
    const calculateMaxUnstakeAmount = async () => {
      if (active && stSol.balanceInLamports) {
        const maxUnStakeAmount = await sdk?.calculateMaxUnStakeAmount();

        setMaxAmount({ value: maxUnStakeAmount ?? 0, isReady: true });
      } else {
        setMaxAmount({ value: 0, isReady: false });
      }
    };

    void calculateMaxUnstakeAmount();
  }, [active, stSol.balanceInLamports, sdk]);

  return maxAmount;
}
