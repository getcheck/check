export type Check = {
  version: '0.1.0'
  name: 'check'
  instructions: [
    {
      name: 'addClaimType'
      accounts: [
        {
          name: 'claimType'
          isMut: true
          isSigner: false
        },
        {
          name: 'payer'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'hash'
          type: {
            array: ['u8', 32]
          }
        },
      ]
    },
    {
      name: 'addAttestation'
      accounts: [
        {
          name: 'attestation'
          isMut: true
          isSigner: false
        },
        {
          name: 'claimType'
          isMut: false
          isSigner: false
        },
        {
          name: 'claimer'
          isMut: false
          isSigner: false
        },
        {
          name: 'issuer'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'claimHash'
          type: {
            array: ['u8', 32]
          }
        },
      ]
    },
  ]
  accounts: [
    {
      name: 'attestation'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'issuer'
            type: 'publicKey'
          },
          {
            name: 'claimer'
            type: 'publicKey'
          },
          {
            name: 'claimType'
            type: 'publicKey'
          },
          {
            name: 'claimHash'
            type: {
              array: ['u8', 32]
            }
          },
          {
            name: 'revoked'
            type: 'bool'
          },
          {
            name: 'bump'
            type: 'u8'
          },
        ]
      }
    },
    {
      name: 'claimType'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'owner'
            type: 'publicKey'
          },
          {
            name: 'hash'
            type: {
              array: ['u8', 32]
            }
          },
          {
            name: 'bump'
            type: 'u8'
          },
        ]
      }
    },
  ]
  errors: [
    {
      code: 6000
      name: 'Unauthorized'
      msg: 'You are not authorized to perform this action'
    },
    {
      code: 6001
      name: 'Ed25519InvalidPublicKey'
      msg: 'Ed25519: Invalid public key'
    },
    {
      code: 6002
      name: 'Ed25519VerificationFailed'
      msg: 'Ed25519: Verification failed'
    },
    {
      code: 6003
      name: 'VerificationInvalidClaimer'
      msg: 'Verification: Invalid claimer'
    },
    {
      code: 6004
      name: 'VerificationInvalidIssuer'
      msg: 'Verification: Invalid issuer'
    },
    {
      code: 6005
      name: 'VerificationInvalidClaimHash'
      msg: 'Verification: Invalid claim hash'
    },
  ]
}

export const IDL: Check = {
  version: '0.1.0',
  name: 'check',
  instructions: [
    {
      name: 'addClaimType',
      accounts: [
        {
          name: 'claimType',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'hash',
          type: {
            array: ['u8', 32],
          },
        },
      ],
    },
    {
      name: 'addAttestation',
      accounts: [
        {
          name: 'attestation',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'claimType',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'claimer',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'issuer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'claimHash',
          type: {
            array: ['u8', 32],
          },
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'attestation',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'issuer',
            type: 'publicKey',
          },
          {
            name: 'claimer',
            type: 'publicKey',
          },
          {
            name: 'claimType',
            type: 'publicKey',
          },
          {
            name: 'claimHash',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'revoked',
            type: 'bool',
          },
          {
            name: 'bump',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'claimType',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'hash',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'bump',
            type: 'u8',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'Unauthorized',
      msg: 'You are not authorized to perform this action',
    },
    {
      code: 6001,
      name: 'Ed25519InvalidPublicKey',
      msg: 'Ed25519: Invalid public key',
    },
    {
      code: 6002,
      name: 'Ed25519VerificationFailed',
      msg: 'Ed25519: Verification failed',
    },
    {
      code: 6003,
      name: 'VerificationInvalidClaimer',
      msg: 'Verification: Invalid claimer',
    },
    {
      code: 6004,
      name: 'VerificationInvalidIssuer',
      msg: 'Verification: Invalid issuer',
    },
    {
      code: 6005,
      name: 'VerificationInvalidClaimHash',
      msg: 'Verification: Invalid claim hash',
    },
  ],
}
