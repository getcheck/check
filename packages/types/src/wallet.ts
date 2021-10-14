import { web3 } from '@project-serum/anchor'
import { EncryptedAsymmetric, CryptoInput, EncryptedAsymmetricStr } from './crypto'

export interface Wallet {
  publicKey: web3.PublicKey
  boxPublicKey: Uint8Array

  // Signing
  signTransaction(tx: web3.Transaction): Promise<web3.Transaction>
  signAllTransactions(txs: web3.Transaction[]): Promise<web3.Transaction[]>
  signMessage(message: Uint8Array): Promise<Uint8Array>

  // Encrypting
  encryptAsymmetric(message: CryptoInput, boxPubkey: Uint8Array): Promise<EncryptedAsymmetric>
  encryptAsymmetricAsStr(
    message: CryptoInput,
    boxPubkey: Uint8Array,
  ): Promise<EncryptedAsymmetricStr>
  decryptAsymmetric(
    data: EncryptedAsymmetric | EncryptedAsymmetricStr,
    boxPubkey: Uint8Array,
  ): Promise<Uint8Array | false>
  decryptAsymmetricAsStr(
    data: EncryptedAsymmetric | EncryptedAsymmetricStr,
    boxPubkey: Uint8Array,
  ): Promise<string | false>
}
