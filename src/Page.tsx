import { useCallback, useState } from 'react';

import Switch from '@/components/base/Switch';
import { UnstakeCard } from '@/components/cards/UnstakeCard';
import { WithdrawCard } from '@/components/cards/WithdrawCard';
import Layout from '@/components/layout/Layout';

export default function IndexPage() {
  const [isSecondTabChecked, setSecondTabChecked] = useState(false);
  const toggleSecondTab = useCallback(() => {
    setSecondTabChecked((prev) => !prev);
  }, []);

  return (
    <Layout title="Unstake stSOL" subtitle="Unstake stSOL and withdraw SOL">
      <Switch
        checked={isSecondTabChecked}
        onClick={toggleSecondTab}
        checkedLabel="Unstake"
        uncheckedLabel="Withdraw"
      />

      {!isSecondTabChecked ? <UnstakeCard /> : <WithdrawCard />}
    </Layout>
  );
}
