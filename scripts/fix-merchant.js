require('dotenv').config();

// specifically set merchant count and values
const user = process.env.AUTH0_USER;
const argv = require('yargs').argv;

const { accounts } = require('../server/db');

const acctRef = accounts.doc(`${user}!daily`);

acctRef
	.get()
	.then((acctSnapshot) => {
		const acct = acctSnapshot.data();
		const counts = acct.merchants_count;
		let merchant = counts[argv.merchant];
		if (argv.count) {
			merchant.count = argv.count;
		}
		if (argv.name) {
			merchant.values = argv.name;
		}
		return acctRef.set(
			{
				merchants_count: counts
			},
			{
				merge: true
			}
		);
	})
	.then(console.log)
	.then(null, console.error);
