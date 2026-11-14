use anchor_lang::prelude::*;

pub mod math;

// Development placeholder, NOT a deployment address. Replace and synchronize
// with the generated local program identity before any future deployment.
declare_id!("Fg6PaFpoGXkYsidMpWxTWqkZq9p3qY3r1E5hJ1tqU2W");

#[program]
pub mod commitment_stakes {
    use super::*;

    /// Account foundation only. Version 0 has no enrollment or money movement.
    pub fn initialize(ctx: Context<Initialize>, args: InitializeArgs) -> Result<()> {
        require!(args.alpha_bps <= math::BPS && args.rake_bps <= math::BPS, StakesError::InvalidBps);
        require!(args.target > 0, StakesError::InvalidTarget);
        require_keys_neq!(args.oracle, Pubkey::default(), StakesError::InvalidOracle);

        let challenge = &mut ctx.accounts.challenge;
        challenge.creator = ctx.accounts.creator.key();
        challenge.oracle = args.oracle;
        challenge.group = ctx.accounts.pot.key();
        challenge.id = args.id;
        challenge.alpha_bps = args.alpha_bps;
        challenge.rake_bps = args.rake_bps;
        challenge.target = args.target;
        challenge.rules_version = 0; // Explicitly unfundable draft schema.
        challenge.settled = false;
        challenge.bump = ctx.bumps.challenge;

        ctx.accounts.vault.challenge = challenge.key();
        ctx.accounts.vault.bump = ctx.bumps.vault;
        ctx.accounts.treasury.challenge = challenge.key();
        ctx.accounts.treasury.bump = ctx.bumps.treasury;
        Ok(())
    }

    /// A separate group pot can be shared by later challenges of this creator.
    pub fn initialize_group(ctx: Context<InitializeGroup>, group_id: u64) -> Result<()> {
        ctx.accounts.pot.creator = ctx.accounts.creator.key();
        ctx.accounts.pot.id = group_id;
        ctx.accounts.pot.bump = ctx.bumps.pot;
        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct InitializeArgs {
    pub id: u64,
    pub oracle: Pubkey,
    pub alpha_bps: u16,
    pub rake_bps: u16,
    pub target: u32,
}

#[derive(Accounts)]
#[instruction(args: InitializeArgs)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(init, payer = creator, space = 8 + Challenge::INIT_SPACE,
        seeds = [b"challenge", creator.key().as_ref(), &args.id.to_le_bytes()], bump)]
    pub challenge: Account<'info, Challenge>,
    #[account(init, payer = creator, space = 8 + Vault::INIT_SPACE,
        seeds = [b"vault", challenge.key().as_ref()], bump)]
    pub vault: Account<'info, Vault>,
    #[account(init, payer = creator, space = 8 + Treasury::INIT_SPACE,
        seeds = [b"treasury", challenge.key().as_ref()], bump)]
    pub treasury: Account<'info, Treasury>,
    #[account(seeds = [b"pot", creator.key().as_ref(), &pot.id.to_le_bytes()],
        bump = pot.bump, has_one = creator)]
    pub pot: Account<'info, Pot>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(group_id: u64)]
pub struct InitializeGroup<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(init, payer = creator, space = 8 + Pot::INIT_SPACE,
        seeds = [b"pot", creator.key().as_ref(), &group_id.to_le_bytes()], bump)]
    pub pot: Account<'info, Pot>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Challenge {
    pub creator: Pubkey,
    pub oracle: Pubkey,
    pub group: Pubkey,
    pub id: u64,
    pub alpha_bps: u16,
    pub rake_bps: u16,
    pub target: u32,
    pub rules_version: u16,
    pub settled: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub challenge: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Treasury {
    pub challenge: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Pot {
    pub creator: Pubkey,
    pub id: u64,
    pub bump: u8,
}

#[error_code]
pub enum StakesError {
    #[msg("Basis points must be between 0 and 10000 inclusive")]
    InvalidBps,
    #[msg("Workout target must be positive")]
    InvalidTarget,
    #[msg("Oracle must be a nonzero public key")]
    InvalidOracle,
}
