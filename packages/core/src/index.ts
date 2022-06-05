import { web3 } from '@project-serum/anchor'
import { init } from './check'
import { config } from './config'
import context from './context'

export * from './claimType'
export * from './claim'
export * from './requestAttestation'
export * from './attestation'
export * from './credential'
export * from './wallet'
export * from './identity'
export * from './utils'
export * from './check'
export * as Idl from './idl'

export const CHECK_ID = new web3.PublicKey(config.programs.check)

export default {
  init,
  context,
}
