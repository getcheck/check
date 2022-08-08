use anchor_lang::prelude::*;

use crate::CheckError;

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
    pub fn verify(&self, signer: &Pubkey) -> Result<bool> {
        if !self.claimer.eq(signer) {
            return err!(CheckError::VerificationInvalidClaimer);
        }

        Ok(true)
    }
}
