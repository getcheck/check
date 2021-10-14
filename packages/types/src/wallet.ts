import { web3 } from '@project-serum/anchor'

export interface Wallet {
  publicKey: web3.PublicKey
  signTransaction(tx: web3.Transaction): Promise<web3.Transaction>
  signAllTransactions(txs: web3.Transaction[]): Promise<web3.Transaction[]>
  signMessage(message: Uint8Array): Promise<Uint8Array>
}
