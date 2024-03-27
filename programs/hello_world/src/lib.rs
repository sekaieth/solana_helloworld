use anchor_lang::prelude::*;

declare_id!("GTrR1SKWeA3pPJkQHhKr4Ebxs8B35UDRNzkyocCSs9Nb");

#[program]
pub mod hello_world {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut _ctx.accounts.counter;
        counter.hello_num = 0;
        msg!(
            "Hello, World Initialized. Current count: {}",
            counter.hello_num
        );
        Ok(())
    }

    pub fn wave_hello(ctx: Context<WaveHello>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.hello_num += 1;
        msg!("Hello, World!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub counter: Account<'info, WaveCounter>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WaveHello<'info> {
    #[account(mut)]
    pub counter: Account<'info, WaveCounter>,
    pub waver: Signer<'info>,
}

#[account]
pub struct WaveCounter {
    hello_num: u64,
}
