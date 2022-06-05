use anchor_lang::prelude::*;

#[account]
pub struct ClaimType {
    pub owner: Pubkey,
    pub hash: [u8; 32],
    pub bump: u8,
}

impl ClaimType {
    pub const LEN: usize = 8 + (32 + 32 + 1);
}
