import {render as renderForm, editTransaction} from './components/form';
import {render as renderTransactions, updateWithTransactions, addTransaction, updateTransaction} from './components/transactions2';
import {render as renderStats, updateWithTransactions as updateStatsWithTransactions} from './components/accountStats2';
import {getJson} from 'simple-fetch';
import config from 'config';
import './util/handlebars';

const root = document.querySelector('.main');
const transactions = renderTransactions();
const form = renderForm();
root.appendChild(form.rootEl);
root.appendChild(renderStats());
root.appendChild(transactions.rootEl);

transactions.on('transaction:edit', editTransaction);
form.on('transaction:add', addTransaction);
form.on('transaction:update', updateTransaction);

getJson(config.server_url + '/accounts/' + config.account_name)
	.then((json) => {
		console.log(json);
		updateWithTransactions(json.transactions);
		updateStatsWithTransactions(json.transactions);
	});
