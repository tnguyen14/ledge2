import {render as renderForm, updateTransaction} from './components/form';
import {render as renderTransactions, updateWithTransactions} from './components/transactions2';
import {getJson} from 'simple-fetch';
import config from 'config';
import './util/handlebars';

const root = document.querySelector('.main');
const transactions = renderTransactions();
root.appendChild(renderForm());
root.appendChild(transactions.rootEl);

transactions.on('transaction:edit', updateTransaction);

getJson(config.server_url + '/accounts/' + config.account_name)
	.then((json) => {
		console.log(json);
		updateWithTransactions(json.transactions);
	});
