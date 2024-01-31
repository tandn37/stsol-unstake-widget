import { useSDK } from '@/contexts/sdk';
import { useWithdrawData } from '@/contexts/withdraw';
import { ExplorerLinkEntity } from '@/hooks/useSolanaExplorerLink';
import { TX_STAGE } from '@lidofinance/solido-sdk';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useState } from 'react';

export const useWithdrawForm = () => {
  const { selection, accounts, updateAccounts } = useWithdrawData();
  const { isSelected } = selection;

  const sdk = useSDK();
  const { wallet } = useWallet();
  const [txStage, setTxStage] = useState(TX_STAGE.IDLE);
  const [explorerLinkParams, setExplorerLinkParams] = useState<{
    value: string;
    entity: ExplorerLinkEntity;
  }>();
  const [txError, setTxError] = useState(null);
  const closeTxModal = useCallback(() => setTxStage(TX_STAGE.IDLE), []);

  const withdraw = useCallback(async () => {
    try {
      setExplorerLinkParams({ value: null, entity: null });

      const setTxStageCallback = ({ txStage: newTxStage, transactionHash }) => {
        if (transactionHash) {
          setExplorerLinkParams({ value: transactionHash, entity: 'tx' });
        }
        setTxStage(newTxStage);
      };

      await sdk.withdraw({
        accounts: accounts.filter((a) => isSelected(a.pubkey)),
        wallet: wallet?.adapter as SignerWalletAdapter,
        setTxStage: setTxStageCallback,
      });

      updateAccounts();
    } catch (e) {
      console.error(e);

      setTxError(e.message || e.error?.message);
      setTxStage(TX_STAGE.ERROR);
    }
  }, [sdk, accounts, wallet?.adapter, updateAccounts, isSelected]);

  return {
    txStage,
    txError,
    closeTxModal,
    withdraw,
    explorerLinkParams,
  };
};
