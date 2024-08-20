import { web3 } from '@coral-xyz/anchor'
import { EncryptedAsymmetric, CryptoInput, EncryptedAsymmetricStr } from './crypto'

export interface Wallet {
  publicKey: web3.PublicKey
  boxPublicKey: Uint8Array

  // Signing
  signTransaction<T extends web3.Transaction | web3.VersionedTransaction>(tx: T): Promise<T>
  signAllTransactions<T extends web3.Transaction | web3.VersionedTransaction>(
    txs: T[],
  ): Promise<T[]>
  signMessage(message: Uint8Array): Promise<Uint8Array>

  // Encrypting
  encryptAsymmetric(message: CryptoInput, boxPublicKey: Uint8Array): Promise<EncryptedAsymmetric>
  encryptAsymmetricAsStr(
    message: CryptoInput,
    boxPublicKey: Uint8Array,
  ): Promise<EncryptedAsymmetricStr>
  decryptAsymmetric(
    data: EncryptedAsymmetric | EncryptedAsymmetricStr,
    boxPublicKey: Uint8Array,
  ): Promise<Uint8Array | false>
  decryptAsymmetricAsStr(
    data: EncryptedAsymmetric | EncryptedAsymmetricStr,
    boxPublicKey: Uint8Array,
  ): Promise<string | false>
}
