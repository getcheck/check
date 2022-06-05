use anchor_lang::{prelude::*, solana_program::instruction::Instruction};

use crate::{utils::*, CheckError};

#[account]
pub struct Attestation {
    pub issuer: Pubkey,
    pub claimer: Pubkey,
    pub claim_type: Pubkey,
    pub claim_hash: [u8; 32],
    pub revoked: bool,
    pub bump: u8,
}

impl Attestation {
    pub const LEN: usize = 8 + (32 + 32 + 32 + 32 + 1 + 1);

    /// Check if the claimer is the same as the signer,
    /// and the claim hash is the same as the message from Ed25519 instruction
    ///
    /// Arguments:
    ///
    /// * `ix`: The instruction to verify
    /// * `claimer`: The claimer public key.
    ///
    /// Returns:
    ///
    /// A Result<()>
    pub fn verify(&self, ix: Instruction, claimer: &Pubkey) -> Result<bool> {
        let Ed25519VerificationResult { message, signer } = verify_ed25519_instruction(&ix)?;

        if !self.claimer.eq(claimer) || !signer.eq(claimer) {
            return err!(CheckError::VerificationInvalidClaimer);
        }

        if self.claim_hash != message.as_ref() {
            return err!(CheckError::VerificationInvalidClaimHash);
        }

        Ok(true)
    }
}
