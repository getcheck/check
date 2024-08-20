import { CryptoInput, EncryptedAsymmetric, EncryptedAsymmetricStr, Wallet } from '@getcheck/types'
import { web3 } from '@coral-xyz/anchor'
import { Crypto, isVersionedTransaction } from '../utils'

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

  async signTransaction<T extends web3.Transaction | web3.VersionedTransaction>(tx: T): Promise<T> {
    if (isVersionedTransaction(tx)) {
      tx.sign([this.payer])
    } else {
      tx.partialSign(this.payer)
    }
    return tx
  }

  async signAllTransactions<T extends web3.Transaction | web3.VersionedTransaction>(
    txs: T[],
  ): Promise<T[]> {
    return txs.map((tx) => {
      if (isVersionedTransaction(tx)) {
        tx.sign([this.payer])
      } else {
        tx.partialSign(this.payer)
      }
      return tx
    })
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    return Crypto.sign(message, this.payer)
  }

  async encryptAsymmetric(
    message: CryptoInput,
    boxPublicKey: Uint8Array,
  ): Promise<EncryptedAsymmetric> {
    return Crypto.encryptAsymmetric(message, boxPublicKey, this.boxKeyPair.secretKey)
  }

  async encryptAsymmetricAsStr(
    message: CryptoInput,
    boxPublicKey: Uint8Array,
  ): Promise<EncryptedAsymmetricStr> {
    return Crypto.encryptAsymmetricAsStr(message, boxPublicKey, this.boxKeyPair.secretKey)
  }

  async decryptAsymmetric(
    data: EncryptedAsymmetric | EncryptedAsymmetricStr,
    boxPublicKey: Uint8Array,
  ): Promise<Uint8Array | false> {
    return Crypto.decryptAsymmetric(data, boxPublicKey, this.boxKeyPair.secretKey)
  }

  async decryptAsymmetricAsStr(
    data: EncryptedAsymmetric | EncryptedAsymmetricStr,
    boxPublicKey: Uint8Array,
  ): Promise<string | false> {
    return Crypto.decryptAsymmetricAsStr(data, boxPublicKey, this.boxKeyPair.secretKey)
  }
}
