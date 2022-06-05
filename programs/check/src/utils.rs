use anchor_lang::{
    prelude::*,
    solana_program::{ed25519_program, instruction::Instruction},
};

use crate::CheckError;

#[derive(Clone)]
pub struct Ed25519VerificationResult {
    pub message: Vec<u8>,
    pub signer: Pubkey,
}

pub fn verify_ed25519_instruction(ix: &Instruction) -> Result<Ed25519VerificationResult> {
    if ix.program_id != ed25519_program::ID || !ix.accounts.is_empty() {
        return err!(CheckError::Ed25519VerificationFailed);
    }

    Ok(Ed25519VerificationResult {
        message: get_ed25519_message(&ix.data),
        signer: get_ed25519_signer(&ix.data)?,
    })
}

pub fn get_ed25519_message(data: &[u8]) -> Vec<u8> {
    data[112..].to_vec()
}

pub fn get_ed25519_signer(data: &[u8]) -> Result<Pubkey> {
    Pubkey::try_from_slice(&data[16..16 + 32])
        .map_err(|_| error!(CheckError::Ed25519InvalidPublicKey))
}
