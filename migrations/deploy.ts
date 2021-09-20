import * as anchor from '@project-serum/anchor'

export default (provider) => {
  anchor.setProvider(provider)
}
