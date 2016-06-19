import {render as renderForm, updateTransaction} from './components/form';
import {render as renderTransactions, updateWithTransactions, addTransaction} from './components/transactions2';
import {getJson} from 'simple-fetch';
import config from 'config';
import './util/handlebars';

const root = document.querySelector('.main');
const transactions = renderTransactions();
const form = renderForm();
root.appendChild(form.rootEl);
root.appendChild(transactions.rootEl);

transactions.on('transaction:edit', updateTransaction);
form.on('transaction:add', addTransaction);

getJson(config.server_url + '/accounts/' + config.account_name)
	.then((json) => {
		console.log(json);
		updateWithTransactions(json.transactions);
	});
