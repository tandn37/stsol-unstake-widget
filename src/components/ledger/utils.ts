import type Transport from '@ledgerhq/hw-transport';
import type TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { WalletConnectionError, WalletLoadError } from '@solana/wallet-adapter-base';
import { getDerivationPath } from '@solana/wallet-adapter-wallets';
import { PublicKey } from '@solana/web3.js';
import { DerivationPath, GeneratePathsParams } from './types';

const INS_GET_PUBKEY = 0x05;
const P1_NON_CONFIRM = 0x00;
const P2_EXTEND = 0x01;
const P2_MORE = 0x02;
const MAX_PAYLOAD = 255;
const LEDGER_CLA = 0xe0;

async function ledgerSend(transport: Transport, instruction: number, p1: number, payload: Buffer) {
  let p2 = 0;
  let payloadOffset = 0;

  if (payload.length > MAX_PAYLOAD) {
    while (payload.length - payloadOffset > MAX_PAYLOAD) {
      const chunk = payload.slice(payloadOffset, payloadOffset + MAX_PAYLOAD);
      payloadOffset += MAX_PAYLOAD;
      // eslint-disable-next-line no-await-in-loop
      const reply = await transport.send(LEDGER_CLA, instruction, p1, p2 | P2_MORE, chunk);
      if (reply.length !== 2) {
        throw new Error('Received unexpected reply payload');
      }
      p2 |= P2_EXTEND;
    }
  }

  const chunk = payload.slice(payloadOffset);
  const reply = await transport.send(LEDGER_CLA, instruction, p1, p2, chunk);

  return reply.slice(0, reply.length - 2);
}

export async function getPublicKey(transport: Transport, derivationPath: Buffer): Promise<PublicKey> {
  const publicKeyBytes = await ledgerSend(transport, INS_GET_PUBKEY, P1_NON_CONFIRM, derivationPath);

  return new PublicKey(publicKeyBytes);
}

export async function getTransport() {
  let TransportWebHIDClass: typeof TransportWebHID;
  try {
    TransportWebHIDClass = (await import('@ledgerhq/hw-transport-webhid')).default;
  } catch (error: any) {
    throw new WalletLoadError(error?.message, error);
  }

  let transport: Transport;
  try {
    transport = await TransportWebHIDClass.create();
  } catch (error: any) {
    throw new WalletConnectionError(error?.message, error);
  }
  return transport;
}

export function getPathPublicKey(transport: Transport, path: DerivationPath) {
  const derivationPath = getDerivationPath(...path);
  return getPublicKey(transport, derivationPath);
}

export function generatePaths({
  derivationLength,
  perPage = 20,
  page = 1,
}: GeneratePathsParams): DerivationPath[] {
  switch (derivationLength) {
    case 0:
      return [[]];
    case 1:
      return Array.from({ length: perPage }).map((_, i) => [i + perPage * (page - 1)]);
    case 2:
      return Array.from({ length: perPage }).map((_, i) => [i + perPage * (page - 1), 0]);
    default:
      throw new Error('Invalid variant');
  }
}
