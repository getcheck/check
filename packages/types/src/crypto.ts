export type Hash = string

export type CryptoInput = string | number[] | ArrayBuffer | Uint8Array

export type EncryptedSymmetric = { encrypted: Uint8Array; nonce: Uint8Array }
export type EncryptedAsymmetric = { box: Uint8Array; nonce: Uint8Array }
export type EncryptedSymmetricStr = { encrypted: string; nonce: string }
export type EncryptedAsymmetricStr = { box: string; nonce: string }
