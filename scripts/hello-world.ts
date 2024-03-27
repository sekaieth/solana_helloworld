import * as Web3 from '@solana/web3.js';
import * as fs from 'fs';
import { serialize } from 'borsh';
import { sha256 } from '@coral-xyz/anchor/dist/cjs/utils';

async function main() {
	// Connect to the cluster
	const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'));
	const payer = Web3.Keypair.fromSecretKey(
		Uint8Array.from(
			JSON.parse(
				fs.readFileSync('/home/sekai/.config/solana/id.json').toString()
			)
		)
	);

	console.log('Payer:', payer.publicKey.toBase58());

	// Load program keypair from the anchor IDL
	const programKeypairRaw = JSON.parse(
		fs
			.readFileSync('./target/deploy/logan_hello_world-keypair.json')
			.toString()
	);

	const programId = Web3.Keypair.fromSecretKey(
		Uint8Array.from(programKeypairRaw)
	).publicKey;

	console.log('Program ID:', programId.toBase58());

	// Create a new transaction
	const transaction = new Web3.Transaction();

	// Create an instruction
	const instruction = new Web3.TransactionInstruction({
		keys: [],
		programId: programId,
		data: Buffer.from(sha256.hash('global:hello_world').slice(0, 8)),
	});

	const sig = await Web3.sendAndConfirmTransaction(
		connection,
		transaction.add(instruction),
		[payer]
	);

	console.log(
		`Transaction Successful!  https://explorer.solana.com/tx/${sig}?cluster=devnet`
	);
}

main().catch((err) => {
	console.error(err);
});
