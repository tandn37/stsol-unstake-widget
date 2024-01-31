# stSOL unstake widget

A frontend widget for [solido](https://github.com/lidofinance/solido), the Lido DAO-governed liquid staking protocol for the Solana blockchain.

### Prerequisites

- Node.js v18+
- Yarn package manager

This project requires an `.env` file which is distributed via private communication channels.
A sample can be found in [`sample.env`](./sample.env).

## Development

Step 1. Copy the contents of `sample.env` to `.env.local`
```bash
cp sample.env .env.local
```

Step 2. Change the value of variables as needed in `.env.local.`

Step 3. Install dependencies
```bash
yarn install
```

Step 4. Start the development server
```bash
yarn dev
```

Step 5. Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Environment variables

| **Name**                       | **Purpose**                                                                                                      | **Example value**                   | **Required** |
| :----------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------ |
| VITE_ACTIVE_SOLANA_CHAIN       | Need to specify in which solana chain service should be started                                                  | mainnet-beta                        | Yes          |
| VITE_SOLANA_RPC_ENDPOINT       | Main rpc endpoint where widget sends JSON RPC requests and gets onchain data (f.e. marketcap, stake transaction) | https://api.mainnet-beta.solana.com | Yes          |
| VITE_WALLET_CONNECT_PROJECT_ID | Key for WalletConnect integration                                                                                |                                     | No           |
