import { IEncryptedMessage, IIdentity, IMessage, MessageBody, Wallet } from '@getcheck/types'
import { Crypto } from '@getcheck/api'
import { web3 } from '@project-serum/anchor'

export class Message implements IMessage {
  body: IMessage['body']
  senderPubkey: IMessage['senderPubkey']
  senderBoxPubkey: IMessage['senderBoxPubkey']
  receiverPubkey: IMessage['receiverPubkey']
  createdAt: number

  constructor(
    args: Pick<IMessage, 'body' | 'receiverPubkey' | 'senderPubkey' | 'senderBoxPubkey'>,
  ) {
    Object.assign(this, args)

    this.createdAt = Date.now()
  }

  static ensureHashAndSignature(
    { ciphertext, nonce, signature, createdAt, hash }: IEncryptedMessage,
    senderPubkey: web3.PublicKey,
  ) {
    if (Crypto.hashAsStr(ciphertext + nonce + createdAt) !== hash) {
      throw new Error('Nonce hash invalid')
    }

    if (!Crypto.verify(hash, signature, senderPubkey)) {
      throw new Error('Signature unverifiable')
    }
  }

  static async decrypt(encrypted: IEncryptedMessage, wallet: Wallet): Promise<IMessage> {
    Message.ensureHashAndSignature(encrypted, encrypted.senderPubkey)

    const decoded = await wallet.decryptAsymmetricAsStr(
      { box: encrypted.ciphertext, nonce: encrypted.nonce },
      encrypted.senderBoxPubkey,
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
      receiver.boxPubkey,
    )
    const ciphertext = encrypted.box
    const { nonce } = encrypted

    const hash = Crypto.hashAsStr(ciphertext + nonce + this.createdAt)
    const signature = Crypto.u8aToHex(await wallet.signMessage(Crypto.ciToU8a(hash)))

    return {
      ciphertext,
      nonce,
      hash,
      signature,
      createdAt: this.createdAt,
      receiverPubkey: this.receiverPubkey,
      senderPubkey: this.senderPubkey,
      senderBoxPubkey: this.senderBoxPubkey,
    }
  }
}
