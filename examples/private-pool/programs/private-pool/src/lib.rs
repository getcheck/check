use anchor_lang::{prelude::*, solana_program::sysvar::instructions};
use check::{program::Check, state::Attestation};
use solana_program::pubkey;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod private_pool {
    use super::*;

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let attestation = &ctx.accounts.attestation;
        msg!("Claim type: {}", attestation.claim_type);
        msg!("Successful deposit: {}", amount);

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct Deposit<'info> {
    #[account(
        owner = *check_program.key,
        // Verify attestation
        constraint = attestation.verify(
            instructions::load_instruction_at_checked(0, &instructions_sysvar)?,
            &user.key(),
        )?,
        constraint = attestation.issuer == pubkey!("DeAbSs8MdyNbVCfGiF9cNEEJYQRXwU7ijwmZZvqXPyAH"),
        constraint = attestation.claim_type == pubkey!("HfMoaBz3mdxKiDpr4Cja5YBqWhSW53ET9FY31rCGHQf4"),
    )]
    pub attestation: Account<'info, Attestation>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub check_program: Program<'info, Check>,

    /// CHECK: Instructions sysvar
    #[account(address = instructions::ID)]
    pub instructions_sysvar: UncheckedAccount<'info>,
}
