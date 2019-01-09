require('dotenv').config();
const transactions = require('../server/controllers/transactions');

const user = process.env.AUTH0_USER;
const transaction = process.argv.slice(2)[0];

transactions.showOne(
	{
		userId: user,
		name: 'daily',
		id: transaction
	},
	(err, data) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		console.log(data);
	}
);
