import { CryptoInput, EncryptedAsymmetric, EncryptedAsymmetricStr, Wallet } from '@getcheck/types'
import { web3 } from '@project-serum/anchor'
import { Crypto } from '../utils'

export class SeedWallet implements Wallet {
  private readonly boxKeyPair: nacl.BoxKeyPair

  constructor(readonly payer: web3.Keypair) {
    this.boxKeyPair = Crypto.createBoxKeyPair(payer.secretKey)
  }

  get publicKey(): web3.PublicKey {
    return this.payer.publicKey
  }

  get boxPublicKey(): Uint8Array {
    return this.boxKeyPair.publicKey
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
    return Crypto.sign(message, this.payer)
  }

  async encryptAsymmetric(
    message: CryptoInput,
    boxPubkey: Uint8Array,
  ): Promise<EncryptedAsymmetric> {
    return Crypto.encryptAsymmetric(message, boxPubkey, this.boxKeyPair.secretKey)
  }

  async encryptAsymmetricAsStr(
    message: CryptoInput,
    boxPubkey: Uint8Array,
  ): Promise<EncryptedAsymmetricStr> {
    return Crypto.encryptAsymmetricAsStr(message, boxPubkey, this.boxKeyPair.secretKey)
  }

  async decryptAsymmetric(
    data: EncryptedAsymmetric | EncryptedAsymmetricStr,
    boxPubkey: Uint8Array,
  ): Promise<Uint8Array | false> {
    return Crypto.decryptAsymmetric(data, boxPubkey, this.boxKeyPair.secretKey)
  }

  async decryptAsymmetricAsStr(
    data: EncryptedAsymmetric | EncryptedAsymmetricStr,
    boxPubkey: Uint8Array,
  ): Promise<string | false> {
    return Crypto.decryptAsymmetricAsStr(data, boxPubkey, this.boxKeyPair.secretKey)
  }
}
