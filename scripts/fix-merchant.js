require('dotenv').config();

// there's an issue where the merchant slug wasn't generated correctly.
// For example, 'a-m-c': { values: [ 'AMC' ], count: 1 }
// it should be 'amc', not 'a-m-c'

const user = process.env.AUTH0_USER;
const argv = require('yargs').argv;

const { accounts } = require('../server/db');

const acctRef = accounts.doc(`${user}!daily`);

acctRef
	.get()
	.then(acctSnapshot => {
		const acct = acctSnapshot.data();
		const counts = acct.merchants_count;
		const oldCount = counts[argv.bad].count;
		counts[argv.bad] = null;
		counts[argv.correct] = {
			...counts[argv.correct],
			count: counts[argv.correct].count + oldCount
		};
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
