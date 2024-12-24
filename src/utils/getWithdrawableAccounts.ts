import { Connection, StakeProgram, PublicKey, AccountInfo, ParsedAccountData } from '@solana/web3.js';
import type { StakeAccountDelegation } from '@lidofinance/solido-sdk/dist/esm/core/src/types';
import BN from 'bn.js';

const DEACTIVATION_GAP = 3; // 3 epochs to deactivate
enum StakeAccountState {
  activating,
  active,
  deactivating,
  inactive,
}
type AccountWithPubkey<T = Buffer | ParsedAccountData> = { pubkey: PublicKey; account: AccountInfo<T> };
const DEACTIVATED_STATES = [StakeAccountState.inactive, StakeAccountState.deactivating];

export const calcStakeAccountState = (epoch: number, delegation: StakeAccountDelegation) => {
  const activationEpoch = new BN(delegation.activationEpoch);
  const deactivationEpoch = new BN(delegation.deactivationEpoch);

  if (activationEpoch.gten(epoch)) return StakeAccountState.activating;
  if (deactivationEpoch.ltn(epoch)) return StakeAccountState.inactive;
  if (deactivationEpoch.ltn(epoch + DEACTIVATION_GAP)) return StakeAccountState.deactivating;

  return StakeAccountState.active;
};

function isParsedAccount(account: AccountWithPubkey): account is AccountWithPubkey<ParsedAccountData> {
  return (account.account.data as ParsedAccountData).parsed !== undefined;
}

export const getWithdrawableAccounts = async (connection: Connection, publicKey: PublicKey) => {
  const stakeAccounts = await connection.getParsedProgramAccounts(StakeProgram.programId, {
    commitment: 'confirmed',
    filters: [
      {
        memcmp: {
          offset: 44,
          bytes: publicKey.toBase58(),
        },
      },
    ],
  });
  const { epoch } = await connection.getEpochInfo('confirmed');

  const stakeAccountsWithStatus = stakeAccounts
    .filter(isParsedAccount)
    // filter out active accounts
    .reduce((memo, { pubkey, account: { data, lamports } }) => {
      const state = calcStakeAccountState(epoch, data.parsed.info.stake.delegation);
      return DEACTIVATED_STATES.includes(state)
        ? [...memo, { pubkey, lamports, isReady: state === StakeAccountState.inactive }]
        : memo;
    }, [])
    // filter out Non-Lido accounts
    // .reduce(
    //   async (memo, account) => [
    //     ...(await memo),
    //     ...((await this.isSolidoStakeAccount(account.pubkey)) ? [account] : []),
    //   ],
    //   [],
    // );
  return stakeAccountsWithStatus.sort(
    (a, b) => Number(b.isReady) - Number(a.isReady) || b.lamports - a.lamports,
  );
}
