require('dotenv').config();
const transactions = require('../server/controllers/transactions');

const user = process.env.AUTH0_USER;
const argv = require('yargs').argv;

const newTransaction = { ...argv };

// remove irrelevant args
delete newTransaction._;
delete newTransaction.$0;

transactions.updateTransaction(
	{
		userId: user,
		name: 'daily',
		...newTransaction,
		id: String(newTransaction.id) // stringify ID
	},
	(err, data) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		console.log(data);
	}
);
