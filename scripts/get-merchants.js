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
		// if an argument is passed to the script, it means
		// searching for a specific merchant
		if (argv._.length) {
			console.log(data.merchants_count[argv._[0]]);
			process.exit();
		}
		const possibleDuplicates = data.merchants.filter(merch => {
			return merch.values.length > 1;
		});
		console.log(`There are ${data.merchants.length} merchants.`);
		if (possibleDuplicates.length) {
			console.log('Possible Duplicates:');
			console.log(possibleDuplicates);
		} else {
			console.log('Top 10 merchants:');
			console.log(data.merchants.slice(0, 10));
		}
	}
);
