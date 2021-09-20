use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash::*;

declare_id!("DYL7EWPpyCfiJ4zisaeHghWYdo5EJPjdcQJ8YQJo6vbF");

const CLAIM_TYPE_PREFIX: &str = "claim_type";
const ATTESTATION_PREFIX: &str = "attestation";

#[program]
pub mod check {
    use super::*;

    pub fn add_claim_type(ctx: Context<AddClaimType>, hash: [u8; 32], bump: u8) -> ProgramResult {
        let claim_type = &mut ctx.accounts.claim_type;
        let hash = Hash::new_from_array(hash);

        claim_type.owner = *ctx.accounts.payer.key;
        claim_type.hash = hash.to_bytes();
        claim_type.bump = bump;

        Ok(())
    }

    pub fn add_attestation(
        ctx: Context<AddAttestation>,
        claim_hash: [u8; 32],
        bump: u8,
    ) -> ProgramResult {
        let attestation = &mut ctx.accounts.attestation;
        let claim_hash = Hash::new_from_array(claim_hash);

        attestation.issuer = *ctx.accounts.issuer.key;
        attestation.claim_type = *ctx.accounts.claim_type.to_account_info().key;
        attestation.claim_hash = claim_hash.to_bytes();
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
            CLAIM_TYPE_PREFIX.as_bytes(),
            &hash
        ],
        bump = bump,
        payer = payer,
        space = 8 + (32 + 32 + 1)
    )]
    pub claim_type: Account<'info, ClaimType>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(claim_hash: [u8; 32], bump: u8)]
pub struct AddAttestation<'info> {
    #[account(
        init,
        seeds = [
            ATTESTATION_PREFIX.as_bytes(),
            issuer.key.as_ref(),
            &claim_hash
        ],
        bump = bump,
        payer = issuer,
        space = 8 + (32 + 32 + 32 + 1 + 1)
    )]
    pub attestation: Account<'info, Attestation>,

    #[account(
        seeds = [
            CLAIM_TYPE_PREFIX.as_bytes(),
            &claim_type.hash
        ],
        bump = claim_type.bump,
    )]
    pub claim_type: Account<'info, ClaimType>,

    #[account(mut)]
    pub issuer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct ClaimType {
    pub owner: Pubkey,
    pub hash: [u8; 32],
    pub bump: u8,
}

#[account]
pub struct Attestation {
    pub issuer: Pubkey,
    pub claim_type: Pubkey,
    pub claim_hash: [u8; 32],
    pub revoked: bool,
    pub bump: u8,
}

#[error]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Already attested")]
    AlreadyAttested,
}
