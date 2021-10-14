import Check, { Claim, ClaimType, RequestForAttestation } from '@getcheck/api'
import {
  IEncryptedMessage,
  IRequestForAttestation,
  IRequestForAttestationBody,
  IRequestForAttestationBodyContent,
  MessageBodyType,
} from '@getcheck/types'
import { Message } from '../src'
import { claimContents, receiver, receiverIdentity, receiverWallet, schema } from './mocks'
import { payer, provider, wallet } from './utils'

describe('message', () => {
  const claimType = ClaimType.fromSchema(schema, payer.publicKey)
  const claim = Claim.fromContents(claimType, claimContents, payer.publicKey)
  let request: IRequestForAttestation
  let encrypted: IEncryptedMessage

  beforeAll(async () => {
    Check.init(provider, wallet)

    request = await RequestForAttestation.fromClaim(claim)
  })

  test('encrypt', async () => {
    const body: IRequestForAttestationBody = {
      content: { request },
      type: MessageBodyType.REQUEST_FOR_ATTESTATION,
    }
    const message = new Message({
      body,
      senderPubkey: wallet.publicKey,
      senderBoxPubkey: wallet.boxPublicKey,
      receiverPubkey: receiver.publicKey,
    })

    encrypted = await message.encrypt(wallet, receiverIdentity)
    expect(encrypted.senderBoxPubkey).toBe(wallet.boxPublicKey)
  })

  test('decrypt', async () => {
    const decrypted = await Message.decrypt(encrypted, receiverWallet)
    const { request } = decrypted.body.content as IRequestForAttestationBodyContent
    expect(request.claim.contents.foo).toBe(claimContents.foo)
  })
})
