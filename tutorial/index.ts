import { Provider, web3 } from '@project-serum/anchor'
import Check, {
  Claim,
  ClaimType,
  RequestForAttestation,
  SeedWallet,
  Identity,
  Attestation,
  Credential,
} from '@getcheck/api'
import {
  ClaimContents,
  ClaimTypeSchemaWithoutId,
  IEncryptedMessage,
  IRequestForAttestation,
  IRequestForAttestationBody,
  IRequestForAttestationBodyContent,
  ISubmitAttestationBody,
  ISubmitAttestationBodyContent,
  MessageBodyType,
} from '@getcheck/types'
import { Message } from '@getcheck/messages'

export const schema: ClaimTypeSchemaWithoutId = {
  $schema: 'http://getcheck.dev/draft-01/claim-type#',
  title: 'Covid-19 Vaccine',
  properties: {
    name: { type: 'string' },
    date: { type: 'integer' },
  },
  type: 'object',
}

// Dont't forgot airdrop
const claimerKeypair = web3.Keypair.fromSecretKey(
  new Uint8Array([
    225, 60, 117, 68, 123, 252, 1, 200, 41, 251, 54, 121, 6, 167, 204, 18, 140, 168, 206, 74, 254,
    156, 230, 10, 212, 124, 162, 85, 120, 78, 122, 106, 187, 209, 148, 182, 34, 149, 175, 173, 192,
    85, 175, 252, 231, 130, 76, 40, 175, 177, 44, 111, 250, 168, 3, 236, 149, 34, 236, 19, 46, 9,
    66, 138,
  ]),
)
const issuerKeypair = web3.Keypair.fromSecretKey(
  new Uint8Array([
    52, 26, 219, 222, 171, 169, 170, 248, 210, 100, 252, 80, 187, 33, 185, 122, 225, 41, 68, 20,
    165, 241, 237, 229, 89, 78, 32, 240, 41, 83, 201, 85, 4, 252, 205, 133, 68, 61, 89, 209, 165,
    214, 193, 121, 187, 202, 237, 121, 0, 31, 128, 39, 137, 229, 135, 83, 102, 196, 79, 138, 52,
    142, 150, 30,
  ]),
)

const options = Provider.defaultOptions()
const connection = new web3.Connection('http://localhost:8899', options.preflightCommitment)

const claimer = Identity.fromKeypair(claimerKeypair)
const claimerWallet = new SeedWallet(claimerKeypair)

const issuer = Identity.fromKeypair(issuerKeypair)
const issuerWallet = new SeedWallet(issuerKeypair)

const claimerSteps0 = async () => {
  const provider = new Provider(connection, claimerWallet, options)
  Check.init(provider, claimerWallet)
  //
  // Step 0: Create claim type & record it
  //
  const claimType = ClaimType.fromSchema(
    { ...schema, title: Math.random().toString() },
    claimerWallet.publicKey,
  )
  console.log(claimType)

  const { pubkey, signature } = await claimType.record()
  console.log(signature, pubkey.toString())

  //
  // Step 1: Build claim from contents
  //
  const claimContents: ClaimContents = { name: 'Pfizer', date: Date.now() }
  const claim = Claim.fromContents(claimType, claimContents, claimerWallet.publicKey)
  console.log(claim)

  //
  // Step 2: Request for attestation from the issuer
  //
  const request = await RequestForAttestation.fromClaim(claim)
  console.log(request)

  //
  // Step 3: Send message to issuer
  //
  const body: IRequestForAttestationBody = {
    content: { request },
    type: MessageBodyType.REQUEST_FOR_ATTESTATION,
  }
  const message = new Message({
    body,
    senderPubkey: claimerWallet.publicKey,
    senderBoxPubkey: claimerWallet.boxPublicKey,
    receiverPubkey: issuer.pubkey,
  })
  const encrypted = await message.encrypt(claimerWallet, issuer)
  console.log(message, encrypted)

  return { request, encrypted }
}

const issuerSteps = async (encryptedRequestForAttestation: IEncryptedMessage) => {
  const provider = new Provider(connection, issuerWallet, options)
  Check.init(provider, issuerWallet)
  //
  // Step 0: Fetch message, record & submit attestation
  //
  const decrypted = await Message.decrypt(encryptedRequestForAttestation, issuerWallet)
  const content = decrypted.body.content as IRequestForAttestationBodyContent

  const attestation = Attestation.fromRequestAndIssuer(content.request, issuer.pubkey)
  console.log(attestation)

  const { pubkey, signature } = await attestation.record()
  console.log(signature, pubkey.toString())

  //
  // Step 1: Send message to claimer
  //
  const body: ISubmitAttestationBody = {
    content: { attestation },
    type: MessageBodyType.SUBMIT_ATTESTATION,
  }
  const message = new Message({
    body,
    senderPubkey: issuerWallet.publicKey,
    senderBoxPubkey: issuerWallet.boxPublicKey,
    receiverPubkey: claimer.pubkey,
  })
  const encrypted = await message.encrypt(issuerWallet, claimer)
  console.log(message, encrypted)

  return { encrypted }
}

const claimerSteps1 = async (
  request: IRequestForAttestation,
  encryptedSubmitAttestation: IEncryptedMessage,
) => {
  const provider = new Provider(connection, claimerWallet, options)
  Check.init(provider, claimerWallet)
  //
  // Step 0: Fetch message, create credential
  //
  const decrypted = await Message.decrypt(encryptedSubmitAttestation, claimerWallet)
  const content = decrypted.body.content as ISubmitAttestationBodyContent

  const credential = Credential.fromRequestAndAttestation(request, content.attestation)
  console.log(credential)
}

const run = async () => {
  const { request, encrypted: encryptedRequestForAttestation } = await claimerSteps0()

  // ... Send the message decentralized or centralized. or via a raven :)

  const { encrypted: encryptedSubmitAttestation } = await issuerSteps(
    encryptedRequestForAttestation,
  )

  // ...

  await claimerSteps1(request, encryptedSubmitAttestation)
}

run()