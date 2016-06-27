import {render as renderForm, editTransaction, updateMerchantList} from './components/form';
import {render as renderAccount, updateWithTransactions, addTransaction, updateTransaction, addWeek, renderAccountStats} from './components/account';
import {render as renderLoadMore} from './components/loadMore.js';
import {getJson} from 'simple-fetch';
import config from 'config';
import './util/handlebars';

const root = document.querySelector('.main');
const account = renderAccount();
const form = renderForm();
const loadMore = renderLoadMore();
root.appendChild(form.rootEl);
root.appendChild(account.rootEl);
renderAccountStats();
root.appendChild(loadMore.rootEl);

account.on('account:transaction:edit', editTransaction);
form.on('transaction:add', addTransaction);
form.on('transaction:update', updateTransaction);
loadMore.on('weeks:add', addWeek);

getJson(config.server_url + '/accounts/' + config.account_name)
	.then((json) => {
		updateWithTransactions(json.transactions);
		updateMerchantList(json.merchants_count);
	});
