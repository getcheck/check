import { web3 } from '@project-serum/anchor'
import { Hash } from './crypto'
import { IAttestation } from './attestation'
import { IRequestForAttestation } from './requestForAttestation'

export enum MessageBodyType {
  REQUEST_FOR_ATTESTATION = 'request-for-attestation',
  SUBMIT_ATTESTATION = 'submit-attestation',
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

export interface IRequestForAttestationBodyContent {
  request: IRequestForAttestation
}

export interface ISubmitAttestationBodyContent {
  attestation: IAttestation
}

export type MessageBody = IRequestForAttestationBody | ISubmitAttestationBody

export interface IMessage {
  body: MessageBody
  createdAt: number
  receiverPubkey: web3.PublicKey
  senderPubkey: web3.PublicKey
  senderBoxPubkey: Uint8Array
}

export type IEncryptedMessage = Pick<
  IMessage,
  'createdAt' | 'receiverPubkey' | 'senderPubkey' | 'senderBoxPubkey'
> & {
  ciphertext: string
  nonce: string
  hash: Hash
  signature: string
}
