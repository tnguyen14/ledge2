require('dotenv').config();

const accounts = require('../server/controllers/accounts');

const user = process.env.AUTH0_USER;
const argv = require('yargs').argv;

accounts.showOne(
	{
		userId: user,
		name: 'daily'
	},
	(err, data) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		let merchants = data.merchants_count;
		// if an argument is passed to the script, it means
		// searching for a specific merchant
		if (argv._.length) {
			console.log(merchants[argv._[0]]);
			process.exit();
		}
		const possibleDuplicates = Object.keys(merchants)
			.filter(merch => {
				return merchants[merch].values.length > 1;
			})
			.map(merch => merchants[merch]);
		console.log(`There are ${Object.keys(merchants).length} merchants.`);
		if (possibleDuplicates.length) {
			console.log('Possible Duplicates:');
			console.log(possibleDuplicates);
		}
	}
);
