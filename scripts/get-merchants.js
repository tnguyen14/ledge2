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
		if (argv._) {
			merchants = merchants[argv._];
		}
		console.log(merchants);
	}
);
