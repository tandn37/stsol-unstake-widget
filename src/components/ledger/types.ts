import type { DerivationPath } from '@/utils/getLedgerDerivation';

export type { DerivationPath } from '@/utils/getLedgerDerivation';

export type DerivationPathLength = 0 | 1 | 2;

export type GeneratePathsParams = {
  derivationLength: DerivationPathLength;
  perPage?: number;
  page?: number;
};

export type AccountRecord = { path: DerivationPath; address: string; balance: number };
