import { useEffect, useState } from 'react';

import { useSDK } from '@/contexts/sdk';

type TransactionParams = Partial<{
  exchangeRate: number;
  unstakeExchangeRate: number;
}>;

export default function useTransactionParams() {
  const [params, setParams] = useState<TransactionParams>({});

  const sdk = useSDK();

  useEffect(() => {
    const fetchTransactionParams = async () => {
      const exchangeRate = await sdk?.getExchangeRate(10);

      setParams({
        ...params,
        exchangeRate: exchangeRate?.SOLToStSOL || 1,
        unstakeExchangeRate: exchangeRate?.stSOLToSOL || 1,
      });
    };
    void fetchTransactionParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdk]);

  return params;
}
