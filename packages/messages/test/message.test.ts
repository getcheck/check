import Check, { Claim, ClaimType, RequestAttestation } from '@getcheck/core'
import {
  IEncryptedMessage,
  IRequestAttestation,
  IRequestAttestationBody,
  IRequestAttestationBodyContent,
  MessageBodyType,
} from '@getcheck/types'
import { Message } from '../src'
import { claimContents, receiver, receiverIdentity, receiverWallet, schema } from './mocks'
import { payer, provider, wallet } from './utils'

describe('message', () => {
  const claimType = ClaimType.fromSchema(schema, payer.publicKey)
  const claim = Claim.fromContents(claimType, claimContents, payer.publicKey)
  let request: IRequestAttestation
  let encrypted: IEncryptedMessage

  beforeAll(async () => {
    Check.init(provider, wallet)

    request = await RequestAttestation.fromClaim(claim)
  })

  test('encrypt', async () => {
    const body: IRequestAttestationBody = {
      content: { request },
      type: MessageBodyType.REQUEST_ATTESTATION,
    }
    const message = new Message({
      body,
      senderPublicKey: wallet.publicKey,
      senderBoxPublicKey: wallet.boxPublicKey,
      receiverPublicKey: receiver.publicKey,
    })

    encrypted = await message.encrypt(wallet, receiverIdentity)
    expect(encrypted.senderBoxPublicKey).toBe(wallet.boxPublicKey)
  })

  test('decrypt', async () => {
    const decrypted = await Message.decrypt(encrypted, receiverWallet)
    const { request } = decrypted.body.content as IRequestAttestationBodyContent
    expect(request.claim.contents.foo).toBe(claimContents.foo)
  })
})
