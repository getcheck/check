import * as anchor from '@project-serum/anchor'
import fs from 'fs'

// Configure the local cluster.
anchor.setProvider(anchor.Provider.local())

const run = async () => {
  // Read the generated IDL.
  const idl = JSON.parse(fs.readFileSync('../target/idl/check.json', 'utf8'))

  // Address of the deployed program.
  const programId = new anchor.web3.PublicKey('DYL7EWPpyCfiJ4zisaeHghWYdo5EJPjdcQJ8YQJo6vbF')

  // Generate the program client from IDL.
  const program = new anchor.Program(idl, programId)

  // Execute the RPC.
  await program.rpc.initialize()
}

console.log('Running client.')
run().then(() => console.log('Success'))
