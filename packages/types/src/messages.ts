import { web3 } from '@project-serum/anchor'
import { Hash } from './crypto'
import { IAttestation } from './attestation'
import { IRequestForAttestation } from './requestForAttestation'
import { IClaimType } from './claimType'
import { ICredential } from '.'

export enum MessageBodyType {
  REQUEST_FOR_ATTESTATION = 'request-for-attestation',
  SUBMIT_ATTESTATION = 'submit-attestation',
  REJECT_ATTESTATION = 'reject-attestation',

  REQUEST_CLAIMS = 'request-claims',
  SUBMIT_CLAIMS = 'submit-claims',
  ACCEPT_CLAIMS = 'accept-claims',
  REJECT_CLAIMS = 'reject-claims',
}

interface IMessageBodyBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  type: MessageBodyType
}

export interface IRequestForAttestationBody extends IMessageBodyBase {
  content: IRequestForAttestationBodyContent
  type: MessageBodyType.REQUEST_FOR_ATTESTATION
}

export interface ISubmitAttestationBody extends IMessageBodyBase {
  content: ISubmitAttestationBodyContent
  type: MessageBodyType.SUBMIT_ATTESTATION
}

export interface IRejectAttestationBody extends IMessageBodyBase {
  content: IRequestForAttestation['rootHash']
  type: MessageBodyType.REJECT_ATTESTATION
}

export interface IRequestClaimsBody extends IMessageBodyBase {
  content: IRequestClaimsBodyContent[]
  type: MessageBodyType.REQUEST_CLAIMS
}

export interface ISubmitClaimsBody extends IMessageBodyBase {
  content: ICredential[]
  type: MessageBodyType.SUBMIT_CLAIMS
}

export interface IAcceptClaimsBody extends IMessageBodyBase {
  content: Array<IClaimType['hash']>
  type: MessageBodyType.ACCEPT_CLAIMS
}
export interface IRejectClaimsBody extends IMessageBodyBase {
  content: Array<IClaimType['hash']>
  type: MessageBodyType.REJECT_CLAIMS
}

export interface IRequestForAttestationBodyContent {
  request: IRequestForAttestation
}

export interface ISubmitAttestationBodyContent {
  attestation: IAttestation
}

export interface IRequestClaimsBodyContent {
  claimTypeHash: IClaimType['hash']
  trustedIssuers?: Array<web3.PublicKey>
  requiredClaimProperties?: string[]
}

export type MessageBody =
  | IRequestForAttestationBody
  | ISubmitAttestationBody
  | IRejectAttestationBody
  | IRequestClaimsBody
  | ISubmitClaimsBody
  | IAcceptClaimsBody
  | IRejectClaimsBody

export interface IMessage {
  body: MessageBody
  createdAt: number
  receiverPublicKey: web3.PublicKey
  senderPublicKey: web3.PublicKey
  senderBoxPublicKey: Uint8Array
}

export type IEncryptedMessage = Pick<
  IMessage,
  'createdAt' | 'receiverPublicKey' | 'senderPublicKey' | 'senderBoxPublicKey'
> & {
  ciphertext: string
  nonce: string
  hash: Hash
  signature: string
}
