import { IEncryptedMessage, IIdentity, IMessage, MessageBody, Wallet } from '@getcheck/types'
import { Crypto } from '@getcheck/core'
import { web3 } from '@project-serum/anchor'

export class Message implements IMessage {
  body: IMessage['body']
  senderPublicKey: IMessage['senderPublicKey']
  senderBoxPublicKey: IMessage['senderBoxPublicKey']
  receiverPublicKey: IMessage['receiverPublicKey']
  createdAt: number

  constructor(
    args: Pick<IMessage, 'body' | 'receiverPublicKey' | 'senderPublicKey' | 'senderBoxPublicKey'>,
  ) {
    Object.assign(this, args)

    this.createdAt = Date.now()
  }

  static ensureHashAndSignature(
    { ciphertext, nonce, signature, createdAt, hash }: IEncryptedMessage,
    senderPublicKey: web3.PublicKey,
  ) {
    if (Crypto.hashAsStr(ciphertext + nonce + createdAt) !== hash) {
      throw new Error('Nonce hash invalid')
    }

    if (!Crypto.verify(hash, signature, senderPublicKey)) {
      throw new Error('Signature unverifiable')
    }
  }

  static async decrypt(encrypted: IEncryptedMessage, wallet: Wallet): Promise<IMessage> {
    Message.ensureHashAndSignature(encrypted, encrypted.senderPublicKey)

    const decoded = await wallet.decryptAsymmetricAsStr(
      { box: encrypted.ciphertext, nonce: encrypted.nonce },
      encrypted.senderBoxPublicKey,
    )

    if (!decoded) {
      throw new Error('Decoding message')
    }

    try {
      const body: MessageBody = JSON.parse(decoded)
      const decrypted: IMessage = { ...encrypted, body }

      // TODO: additional message checks

      return decrypted
    } catch (err) {
      throw new Error('Error parsing message')
    }
  }

  async encrypt(wallet: Wallet, receiver: IIdentity): Promise<IEncryptedMessage> {
    const encrypted = await wallet.encryptAsymmetricAsStr(
      JSON.stringify(this.body),
      receiver.boxPublicKey,
    )
    const ciphertext = encrypted.box
    const { nonce } = encrypted

    const hash = Crypto.hashAsStr(ciphertext + nonce + this.createdAt)
    const signature = await wallet.signMessage(Crypto.ciToU8a(hash))

    return {
      ciphertext,
      nonce,
      hash,
      signature,
      createdAt: this.createdAt,
      receiverPublicKey: this.receiverPublicKey,
      senderPublicKey: this.senderPublicKey,
      senderBoxPublicKey: this.senderBoxPublicKey,
    }
  }
}
