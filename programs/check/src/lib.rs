use anchor_lang::prelude::*;

pub mod state;
pub mod utils;

use state::*;

declare_id!("98ZZksmcbtKXafBzaRLzSrVWgvWZgkVkppr4P8cGrAXm");

#[program]
pub mod check {
    use super::*;

    pub fn add_claim_type(ctx: Context<AddClaimType>, hash: [u8; 32], bump: u8) -> Result<()> {
        let claim_type = &mut ctx.accounts.claim_type;

        claim_type.owner = *ctx.accounts.payer.key;
        claim_type.hash = hash;
        claim_type.bump = bump;

        Ok(())
    }

    pub fn add_attestation(
        ctx: Context<AddAttestation>,
        claimer: Pubkey,
        claim_hash: [u8; 32],
        bump: u8,
    ) -> Result<()> {
        let attestation = &mut ctx.accounts.attestation;
        let claim_type = &ctx.accounts.claim_type;

        attestation.issuer = *ctx.accounts.issuer.key;
        attestation.claimer = claimer;
        attestation.claim_type = *claim_type.to_account_info().key;
        attestation.claim_hash = claim_hash;
        attestation.revoked = false;
        attestation.bump = bump;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(hash: [u8; 32], bump: u8)]
pub struct AddClaimType<'info> {
    #[account(
        init,
        seeds = [
            b"claim_type".as_ref(),
            &hash,
        ],
        bump,
        payer = payer,
        space = ClaimType::LEN,
    )]
    pub claim_type: Account<'info, ClaimType>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(claimer: Pubkey, claim_hash: [u8; 32], bump: u8)]
pub struct AddAttestation<'info> {
    #[account(
        init,
        seeds = [
            b"attestation".as_ref(),
            issuer.key.as_ref(),
            &claim_hash,
        ],
        bump,
        payer = issuer,
        space = Attestation::LEN,
    )]
    pub attestation: Account<'info, Attestation>,

    #[account(
        seeds = [
            b"claim_type".as_ref(),
            &claim_type.hash,
        ],
        bump = claim_type.bump,
    )]
    pub claim_type: Account<'info, ClaimType>,

    #[account(mut)]
    pub issuer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum CheckError {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,

    #[msg("Ed25519: Invalid public key")]
    Ed25519InvalidPublicKey,

    #[msg("Ed25519: Verification failed")]
    Ed25519VerificationFailed,

    #[msg("Verification: Invalid claimer")]
    VerificationInvalidClaimer,

    #[msg("Verification: Invalid issuer")]
    VerificationInvalidIssuer,

    #[msg("Verification: Invalid claim hash")]
    VerificationInvalidClaimHash,
}
