require('dotenv').config();
const transactions = require('../server/controllers/transactions');

const user = process.env.AUTH0_USER;
const argv = require('yargs').argv;

const queries = Object.keys(argv).filter(key => !['_', '$0'].includes(key));

transactions
	.queryTransaction(
		user,
		'daily',
		queries.map(q => ({
			fieldPath: q,
			opStr: '==',
			value: argv[q]
		}))
	)
	.then(data => {
		console.log(`Found ${data.length} results`);
		console.log(data);
	})
	.then(null, err => {
		console.error(err);
	});
