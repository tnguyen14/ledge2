import {render as renderForm, editTransaction, updateMerchantList} from './components/form';
import {render as renderTransactions, updateWithTransactions, addTransaction, updateTransaction, addWeek} from './components/transactions';
import {render as renderStats, updateWithTransactions as updateStatsWithTransactions} from './components/accountStats';
import {render as renderLoadMore} from './components/loadMore.js';
import {getJson} from 'simple-fetch';
import config from 'config';
import './util/handlebars';

const root = document.querySelector('.main');
const transactions = renderTransactions();
const form = renderForm();
const loadMore = renderLoadMore();
root.appendChild(form.rootEl);
root.appendChild(renderStats());
root.appendChild(transactions.rootEl);
root.appendChild(loadMore.rootEl);

transactions.on('transaction:edit', editTransaction);
form.on('transaction:add', addTransaction);
form.on('transaction:update', updateTransaction);
loadMore.on('weeks:add', addWeek);

getJson(config.server_url + '/accounts/' + config.account_name)
	.then((json) => {
		updateWithTransactions(json.transactions);
		updateStatsWithTransactions(json.transactions);
		updateMerchantList(json.merchants_count);
	});
