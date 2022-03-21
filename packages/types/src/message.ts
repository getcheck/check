import { web3 } from '@project-serum/anchor'
import { Hash } from './crypto'
import { IAttestation } from './attestation'
import { IRequestAttestation } from './requestAttestation'
import { IClaimType } from './claimType'
import { ICredential } from '.'

export enum MessageBodyType {
  REQUEST_ATTESTATION = 'request-attestation',
  SUBMIT_ATTESTATION = 'submit-attestation',
  REJECT_ATTESTATION = 'reject-attestation',

  REQUEST_CREDENTIAL = 'request-credential',
  SUBMIT_CREDENTIAL = 'submit-credential',
  ACCEPT_CREDENTIAL = 'accept-credential',
  REJECT_CREDENTIAL = 'reject-credential',
}

interface IMessageBodyBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  type: MessageBodyType
}

export interface IRequestAttestationBody extends IMessageBodyBase {
  content: IRequestAttestationBodyContent
  type: MessageBodyType.REQUEST_ATTESTATION
}

export interface ISubmitAttestationBody extends IMessageBodyBase {
  content: ISubmitAttestationBodyContent
  type: MessageBodyType.SUBMIT_ATTESTATION
}

export interface IRejectAttestationBody extends IMessageBodyBase {
  content: IRequestAttestation['rootHash']
  type: MessageBodyType.REJECT_ATTESTATION
}

export interface IRequestCredentialBody extends IMessageBodyBase {
  content: IRequestCredentialBodyContent[]
  type: MessageBodyType.REQUEST_CREDENTIAL
}

export interface ISubmitCredentialBody extends IMessageBodyBase {
  content: ICredential[]
  type: MessageBodyType.SUBMIT_CREDENTIAL
}

export interface IAcceptCredentialBody extends IMessageBodyBase {
  content: Array<IClaimType['hash']>
  type: MessageBodyType.ACCEPT_CREDENTIAL
}
export interface IRejectCredentialBody extends IMessageBodyBase {
  content: Array<IClaimType['hash']>
  type: MessageBodyType.REJECT_CREDENTIAL
}

export interface IRequestAttestationBodyContent {
  request: IRequestAttestation
}

export interface ISubmitAttestationBodyContent {
  attestation: IAttestation
}

export interface IRequestCredentialBodyContent {
  claimTypeHash: IClaimType['hash']
  trustedIssuers?: Array<web3.PublicKey>
  requiredClaimProperties?: string[]
}

export type MessageBody =
  | IRequestAttestationBody
  | ISubmitAttestationBody
  | IRejectAttestationBody
  | IRequestCredentialBody
  | ISubmitCredentialBody
  | IAcceptCredentialBody
  | IRejectCredentialBody

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
