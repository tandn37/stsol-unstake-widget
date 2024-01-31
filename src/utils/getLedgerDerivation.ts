import { getDerivationPath } from '@solana/wallet-adapter-wallets';

export type DerivationPath = [] | [number] | [number, number];

const PATH_KEY = 'ledgerAccountPath';
const DEFAULT_PATH: DerivationPath = [];

export const getLedgerDerivation = (path?: DerivationPath) => {
  if (path) {
    savePath(path);
  }
  const _path = path || loadPath();
  return getDerivationPath(..._path);
};

export const savePath = (path: DerivationPath) => {
  window?.localStorage?.setItem(PATH_KEY, JSON.stringify(path));
};

const loadPath = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_PATH;
  }
  try {
    const jsonPath = window?.localStorage?.getItem(PATH_KEY);
    const path = JSON.parse(jsonPath) as DerivationPath;
    if (Array.isArray(path)) {
      return path;
    }
  } catch {
    /* noop */
  }
  return DEFAULT_PATH;
};
