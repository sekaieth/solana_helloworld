import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { HelloWorld } from '../target/types/hello_world';
import * as fs from 'fs';
import { BN } from 'bn.js';
import { expect } from 'chai';

describe('Test Hello World', () => {
	// Configure the client to use the local cluster.
	anchor.setProvider(anchor.AnchorProvider.env());
	let signer = anchor.web3.Keypair.fromSecretKey(
		new Uint8Array(
			JSON.parse(
				fs.readFileSync('/home/sekai/.config/solana/id.json').toString()
			)
		)
	);

	const program = anchor.workspace.HelloWorld as Program<HelloWorld>;

	it('Initialize the waver account', async () => {
		const counter = anchor.web3.Keypair.generate();
		let count = new anchor.BN(0).toNumber();
		await program.methods
			.initialize()
			.accounts({ counter: counter.publicKey })
			.signers([counter])
			.rpc();

		count = (
			await program.account.waveCounter.fetch(counter.publicKey)
		).helloNum.toNumber();
		expect(count).to.be.equal(0);
	});

	it('Say hello from Solana', async () => {
		const counter = anchor.web3.Keypair.generate();
		const waver = anchor.web3.Keypair.generate();
		await program.provider.connection.requestAirdrop(
			waver.publicKey,
			1000000000
		);
		let count = 0;

		await program.methods
			.initialize()
			.accounts({ counter: counter.publicKey })
			.signers([counter])
			.rpc();

		await program.methods
			.waveHello()
			.accounts({ counter: counter.publicKey, waver: waver.publicKey })
			.signers([waver])
			.rpc();

		count = (
			await program.account.waveCounter.fetch(counter.publicKey)
		).helloNum.toNumber();
		expect(count).to.be.equal(1);
	});

	it('Say Hello From Multiple Accounts', async () => {
		const counter = anchor.web3.Keypair.generate();
		const waver1 = anchor.web3.Keypair.generate();
		const waver2 = anchor.web3.Keypair.generate();
		let count = 0;

		await program.methods
			.initialize()
			.accounts({ counter: counter.publicKey })
			.signers([counter])
			.rpc();

		count = (
			await program.account.waveCounter.fetch(counter.publicKey)
		).helloNum.toNumber();
		expect(count).to.be.equal(0);

		await program.methods
			.waveHello()
			.accounts({ counter: counter.publicKey, waver: waver1.publicKey })
			.signers([waver1])
			.rpc();

		count = (
			await program.account.waveCounter.fetch(counter.publicKey)
		).helloNum.toNumber();
		expect(count).to.be.equal(1);

		await program.methods
			.waveHello()
			.accounts({ counter: counter.publicKey, waver: waver2.publicKey })
			.signers([waver2])
			.rpc();

		count = (
			await program.account.waveCounter.fetch(counter.publicKey)
		).helloNum.toNumber();
		expect(count).to.be.equal(2);
	});
});
