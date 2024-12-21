/*
  SDK unstake function is not working as expected,
  So we need to create a custom unstake function
  Most of the code is copied from the SDK unstake function
*/

import { SolidoSDK, TX_STAGE } from '@lidofinance/solido-sdk';
import { nu64, struct, u32, u8 } from '@solana/buffer-layout';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import BN from 'bn.js';

import type {
  UnstakeProps,
  ValidatorV2,
  WithdrawInstructionStruct,
  TransactionProps,
} from '@lidofinance/solido-sdk/dist/esm/core/src/types';
import {
  Keypair,
  PublicKey,
  TransactionInstruction,
  StakeProgram,
  SYSVAR_CLOCK_PUBKEY,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';

export type UnstakeTransactionParams = TransactionProps & Pick<UnstakeProps, 'allowMultipleTransactions'>;

export type TransactionParams = {
  feePayer: PublicKey;
  instructions?: TransactionInstruction[];
  signers?: Keypair[];
};
export type ValidatorWithBalance = ValidatorV2 & {
  balance: number;
  stakeAccount: PublicKey;
  index: number;
};
export type UnstakeStep = { amount: number; validator: ValidatorWithBalance };
export type WithdrawInstructionsParams = Pick<TransactionProps, 'payerAddress'> & { steps: UnstakeStep[] };
export type WithdrawInstructionParams = {
  amount: number; // in stSOL
  payerAddress: PublicKey;
  senderStSolAccountAddress: PublicKey;
  stakeAccount: PublicKey;
  validator?: Pick<ValidatorWithBalance, 'index' | 'stakeAccount' | 'vote_account_address'>;
};

const MAX_UNSTAKE_COUNT = 3; // Max count of unstake instruction in one transaction
const INSTRUCTION_UNSTAKE_V2 = 23;
const MAX_UNSTAKE_MERGE_CONT = 0; // 1 tx = 3 unstake + 0 merge + 3 deactivate
const INSTRUCTION_UPDATE_EXCHANGE_RATE = 22;

const withdrawDataLayout = struct<WithdrawInstructionStruct>([
  u8('instruction'),
  nu64('amount'),
  u32('validator_index'),
]);
const updateExchangeRateDataLayout = struct<{ instruction: number }>([
  u8('instruction'),
]);

async function getWithdrawInstruction(sdk: SolidoSDK, props: WithdrawInstructionParams) {
  const { senderStSolAccountAddress, payerAddress, amount, stakeAccount } = props;
  const { solidoProgramId, stSolMintAddress, solidoInstanceId, stakeAuthority, validatorList } =
    sdk.programAddresses;

  const validator = props.validator ?? (await sdk.getValidaror());
  const validatorStakeAccount = validator.stakeAccount;
  const validatorVoteAccount = new PublicKey(validator.vote_account_address);

  const data: Buffer = Buffer.alloc(withdrawDataLayout.span);
  withdrawDataLayout.encode(
    {
      instruction: INSTRUCTION_UNSTAKE_V2,
      amount: new BN(amount),
      validator_index: validator.index,
    },
    data,
  );
  // @ts-ignore
  const rentExemption = await sdk.connection.getMinimumBalanceForRentExemption(StakeProgram.space);
  const createStakeAccountInstruction = SystemProgram.transfer({
    fromPubkey: payerAddress,
    toPubkey: stakeAccount, 
    lamports: rentExemption,
  });

  const keys = [
    { pubkey: solidoInstanceId, isSigner: false, isWritable: true },
    { pubkey: payerAddress, isSigner: true, isWritable: false },
    { pubkey: senderStSolAccountAddress, isSigner: false, isWritable: true },
    { pubkey: stSolMintAddress, isSigner: false, isWritable: true },
    { pubkey: validatorVoteAccount, isSigner: false, isWritable: false },
    { pubkey: validatorStakeAccount, isSigner: false, isWritable: true },
    { pubkey: stakeAccount, isSigner: true, isWritable: true },
    { pubkey: stakeAuthority, isSigner: false, isWritable: false },
    { pubkey: validatorList, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: StakeProgram.programId, isSigner: false, isWritable: false },
  ];

  return [createStakeAccountInstruction, new TransactionInstruction({
    keys,
    programId: solidoProgramId,
    data,
  })];
}

async function getWithdrawInstructions(sdk: SolidoSDK, { payerAddress, steps }: WithdrawInstructionsParams) {
  const [stSolAccount] = await sdk.getStSolAccountsForUser(payerAddress);
  const senderStSolAccountAddress = stSolAccount.address;

  const instructions: TransactionInstruction[] = [];
  const signers: Keypair[] = [];
  const stakeAccounts: PublicKey[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const { amount, validator } of steps) {
    const keypair = Keypair.generate();
    const stakeAccount = keypair.publicKey;

    const instruction = await getWithdrawInstruction(sdk, {
      payerAddress,
      amount,
      validator,
      stakeAccount,
      senderStSolAccountAddress,
    });

    instructions.push(...instruction);
    signers.push(keypair);
    stakeAccounts.push(stakeAccount);

    if ((instructions.length / 2) >= MAX_UNSTAKE_COUNT) {
      break;
    }
  }

  return {
    instructions,
    signers,
    stakeAccounts,
  };
}

function getDeactivateInstructions(
  { stakeAccounts, payerAddress }: { stakeAccounts: PublicKey[]; payerAddress: PublicKey }
) {
  const instructions: TransactionInstruction[] = [];

  const headAccount = stakeAccounts[0];
  const deactivatingStakeAccounts = [
    ...stakeAccounts.slice(0, 1),
    ...stakeAccounts.slice(MAX_UNSTAKE_MERGE_CONT + 1),
  ];

  stakeAccounts.slice(1, MAX_UNSTAKE_MERGE_CONT + 1).forEach((stakeAccount) => {
    instructions.push(
      ...StakeProgram.merge({
        authorizedPubkey: payerAddress,
        stakePubkey: headAccount,
        sourceStakePubKey: stakeAccount,
      }).instructions,
    );
  });

  deactivatingStakeAccounts.forEach((stakeAccount) =>
    instructions.push(
      ...StakeProgram.deactivate({
        authorizedPubkey: payerAddress,
        stakePubkey: stakeAccount,
      }).instructions,
    ),
  );

  return { instructions, deactivatingStakeAccounts };
}

async function getUpdateExchangeRateInstructions(sdk: SolidoSDK): Promise<TransactionInstruction[]> {
  const [lidoState, epochInfo] = await Promise.all([
    // @ts-ignore
    sdk.getAccountInfo(), sdk.connection.getEpochInfo()
  ]);
  const needUpdate = lidoState.exchange_rate.computed_in_epoch < epochInfo.epoch;
  if (!needUpdate) return [];

  const { stSolMintAddress, reserveAccount, validatorList, solidoProgramId, solidoInstanceId } = sdk.programAddresses;
  const data = Buffer.alloc(updateExchangeRateDataLayout.span);
  updateExchangeRateDataLayout.encode({ instruction: INSTRUCTION_UPDATE_EXCHANGE_RATE }, data);

  const keys = [
    {
      pubkey: solidoInstanceId,
      isSigner: false,
      isWritable: true,
    },
    { 
      pubkey: reserveAccount, 
      isSigner: false, 
      isWritable: false 
    },
    { 
      pubkey: stSolMintAddress, 
      isSigner: false, 
      isWritable: false 
    },
    {
      pubkey: validatorList,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];
  return [new TransactionInstruction({
    keys,
    data,
    programId: solidoProgramId,
  })];
}

async function getUnStakeTransaction(sdk: SolidoSDK, props: UnstakeTransactionParams) {
  const updateExchangeRateInstructions = await getUpdateExchangeRateInstructions(sdk);
  const { steps, ...rest } = await sdk.prepareUnstake(props);

  const { instructions, signers, stakeAccounts } = await getWithdrawInstructions(sdk,{
    payerAddress: props.payerAddress,
    steps,
  });

  const { instructions: deactivateInstructions, deactivatingStakeAccounts } = getDeactivateInstructions({
    stakeAccounts,
    payerAddress: props.payerAddress,
  });

  const transaction = await sdk.createTransaction({
    feePayer: props.payerAddress,
    instructions: [...updateExchangeRateInstructions, ...instructions, ...deactivateInstructions],
    signers,
  });

  return { transaction, stakeAccounts: deactivatingStakeAccounts, ...rest };
}

export async function customUnstake(sdk: SolidoSDK, props: UnstakeProps) {
  const { amount, wallet, setTxStage, allowMultipleTransactions } = props;

  setTxStage?.({ txStage: TX_STAGE.PREPARE });

  if (wallet.publicKey === null) {
    throw { code: 302, codeDesc: 'SolidoSDK: publicKey is null in wallet' };
  }

  const { transaction, ...rest } = await getUnStakeTransaction(sdk, {
    amount: +amount,
    payerAddress: new PublicKey(wallet.publicKey),
    allowMultipleTransactions,
  });

  setTxStage?.({ txStage: TX_STAGE.AWAITING_SIGNING, ...rest });

  const transactionHash = await sdk.signAndConfirmTransaction({
    transaction,
    wallet,
    setTxStage,
  });

  return {
    transactionHash,
    ...rest,
  };
}