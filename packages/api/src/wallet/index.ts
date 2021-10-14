import { Wallet } from '@getcheck/types'
import { web3 } from '@project-serum/anchor'
import nacl from 'tweetnacl'

export class SeedWallet implements Wallet {
  constructor(readonly payer: web3.Keypair) {}

  get publicKey(): web3.PublicKey {
    return this.payer.publicKey
  }

  async signTransaction(tx: web3.Transaction): Promise<web3.Transaction> {
    tx.partialSign(this.payer)
    return tx
  }

  async signAllTransactions(txs: web3.Transaction[]): Promise<web3.Transaction[]> {
    return txs.map((tx) => {
      tx.partialSign(this.payer)
      return tx
    })
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    return nacl.sign.detached(message, this.payer.secretKey)
  }
}
