/*
  Update SDK withdraw function to include restake transaction if needed
*/

import { SolidoSDK, TX_STAGE } from '@lidofinance/solido-sdk';
import { StakeProgram, TransactionInstruction, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import {
  SignAndConfirmTransactionProps, WithdrawProps
} from '@lidofinance/solido-sdk/dist/esm/core/src/types';
import { getConfig } from '@/contexts/config';

const { nansenVotePubkey } = getConfig();

type WithdrawTransactionParams = Omit<SignAndConfirmTransactionProps, 'transaction'>
  & Pick<WithdrawProps, 'accounts'> & { amountToWithdraw: number, shouldRestake: boolean };

export async function customWithdraw(sdk: SolidoSDK, props: WithdrawTransactionParams) {
  const { wallet, setTxStage, accounts, amountToWithdraw, shouldRestake } = props;

  setTxStage?.({ txStage: TX_STAGE.PREPARE });

  if (wallet.publicKey === null) {
    throw { code: 302, codeDesc: 'SolidoSDK: publicKey is null in wallet' };
  }
  const payerAddress = wallet.publicKey;
  const withdrawInstructions = accounts.reduce((acc, { pubkey: stakePubkey, lamports }) => {
    const tx = StakeProgram.withdraw({
      stakePubkey,
      lamports,
      authorizedPubkey: payerAddress,
      toPubkey: payerAddress,
    });
    return [...acc, ...tx.instructions];
  }, [] as TransactionInstruction[]);
  let instructions = withdrawInstructions;
  let signers = [];
  if (shouldRestake) {
    const stakeAccount = Keypair.generate();
    const stakeInstructions = [
      ...StakeProgram.createAccount({
        fromPubkey: payerAddress,
        stakePubkey: stakeAccount.publicKey,
        authorized: {
          staker: payerAddress,
          withdrawer: payerAddress,
        },
        lamports: amountToWithdraw,
      }).instructions,
      ...StakeProgram.delegate({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: payerAddress,
        votePubkey: new PublicKey(nansenVotePubkey),
      }).instructions,
    ];
    instructions = [...instructions, ...stakeInstructions];
    signers = [stakeAccount];
  }
  const transaction = await sdk.createTransaction({ feePayer: payerAddress, instructions, signers });

  setTxStage?.({ txStage: TX_STAGE.AWAITING_SIGNING });
  const transactionHash = await sdk.signAndConfirmTransaction({
    transaction,
    wallet,
    setTxStage,
  });

  return { transactionHash };
}