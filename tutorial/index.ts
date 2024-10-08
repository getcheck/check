import { AnchorProvider, web3 } from '@coral-xyz/anchor'
import Check, {
  Claim,
  ClaimType,
  RequestAttestation,
  SeedWallet,
  Identity,
  Attestation,
  Credential,
} from '@getcheck/core'
import {
  ClaimContents,
  ClaimTypeSchemaWithoutId,
  IEncryptedMessage,
  IRequestAttestation,
  IRequestAttestationBody,
  IRequestAttestationBodyContent,
  ISubmitAttestationBody,
  ISubmitAttestationBodyContent,
  MessageBodyType,
} from '@getcheck/types'
import { Message } from '@getcheck/messages'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

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
// DeAbSs8MdyNbVCfGiF9cNEEJYQRXwU7ijwmZZvqXPyAH
const claimerKeypair = web3.Keypair.fromSecretKey(
  new Uint8Array([
    225, 60, 117, 68, 123, 252, 1, 200, 41, 251, 54, 121, 6, 167, 204, 18, 140, 168, 206, 74, 254,
    156, 230, 10, 212, 124, 162, 85, 120, 78, 122, 106, 187, 209, 148, 182, 34, 149, 175, 173, 192,
    85, 175, 252, 231, 130, 76, 40, 175, 177, 44, 111, 250, 168, 3, 236, 149, 34, 236, 19, 46, 9,
    66, 138,
  ]),
)

// LUDEQbkzpjgtBVzMtzYZGKQ7pcyFsSajbeXNm4KJXtq
const issuerKeypair = web3.Keypair.fromSecretKey(
  new Uint8Array([
    52, 26, 219, 222, 171, 169, 170, 248, 210, 100, 252, 80, 187, 33, 185, 122, 225, 41, 68, 20,
    165, 241, 237, 229, 89, 78, 32, 240, 41, 83, 201, 85, 4, 252, 205, 133, 68, 61, 89, 209, 165,
    214, 193, 121, 187, 202, 237, 121, 0, 31, 128, 39, 137, 229, 135, 83, 102, 196, 79, 138, 52,
    142, 150, 30,
  ]),
)

const argv = yargs(hideBin(process.argv))
  .options({
    rpc: { type: 'string', default: 'https://api.devnet.solana.com' },
  })
  .parseSync()

const rpc = argv.rpc

const options = AnchorProvider.defaultOptions()
const connection = new web3.Connection(rpc, options.preflightCommitment)

const claimer = Identity.fromKeypair(claimerKeypair)
const claimerWallet = new SeedWallet(claimerKeypair)

const issuer = Identity.fromKeypair(issuerKeypair)
const issuerWallet = new SeedWallet(issuerKeypair)

const run = async () => {
  let request: IRequestAttestation
  let encryptedRequestAttestation: IEncryptedMessage
  let encryptedSubmitAttestation: IEncryptedMessage

  console.log(claimer.publicKey.toString())
  console.log(issuer.publicKey.toString())

  // Claimer steps
  {
    Check.init(new AnchorProvider(connection, claimerWallet, options), claimerWallet)

    /**
     * Step 0: Create claim type & record it
     */

    const claimType = ClaimType.fromSchema(
      { ...schema, title: Math.random().toString() },
      claimerWallet.publicKey,
    )
    console.log(claimType)
    const { publicKey, signature } = await claimType.record()
    console.log(signature, publicKey.toString())

    /**
     * Step 1: Build claim from contents
     */

    const claimContents: ClaimContents = { name: 'Pfizer', date: Date.now() }
    const claim = Claim.fromContents(claimType, claimContents, claimerWallet.publicKey)
    console.log(claim)

    /**
     * Step 2: Request attestation from the issuer
     */

    request = await RequestAttestation.fromClaim(claim)
    console.log(request)

    /**
     * Step 3: Send message to issuer
     */

    const body: IRequestAttestationBody = {
      content: { request },
      type: MessageBodyType.REQUEST_ATTESTATION,
    }
    const message = new Message({
      body,
      senderPublicKey: claimerWallet.publicKey,
      senderBoxPublicKey: claimerWallet.boxPublicKey,
      receiverPublicKey: issuer.publicKey,
    })
    encryptedRequestAttestation = await message.encrypt(claimerWallet, issuer)
    console.log(message, encryptedRequestAttestation)
  }

  // ... Send the message decentralized or centralized. or via a raven :)

  // Issuer steps
  {
    Check.init(new AnchorProvider(connection, issuerWallet, options), issuerWallet)

    /**
     * Step 4: Fetch message, record & submit attestation
     */

    const decrypted = await Message.decrypt(encryptedRequestAttestation, issuerWallet)
    const content = decrypted.body.content as IRequestAttestationBodyContent
    // ... Check claimer properties
    const attestation = Attestation.fromRequestAndIssuer(content.request, issuer.publicKey)
    console.log(attestation)

    const { publicKey, signature } = await attestation.record()
    console.log(signature, publicKey.toString())

    /**
     * Step 5: Send message to claimer
     */

    const body: ISubmitAttestationBody = {
      content: { attestation },
      type: MessageBodyType.SUBMIT_ATTESTATION,
    }
    const message = new Message({
      body,
      senderPublicKey: issuerWallet.publicKey,
      senderBoxPublicKey: issuerWallet.boxPublicKey,
      receiverPublicKey: claimer.publicKey,
    })
    encryptedSubmitAttestation = await message.encrypt(issuerWallet, claimer)
    console.log(message, encryptedSubmitAttestation)
  }

  // Claimer steps again
  {
    Check.init(new AnchorProvider(connection, claimerWallet, options), claimerWallet)

    /**
     * Step 6: Fetch message, create credential
     */

    const decrypted = await Message.decrypt(encryptedSubmitAttestation, claimerWallet)
    const content = decrypted.body.content as ISubmitAttestationBodyContent
    const credential = Credential.fromRequestAndAttestation(request, content.attestation)
    console.log(credential)
  }
}

run()
