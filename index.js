import {render as renderForm, editTransaction, updateMerchantList} from './components/form';
import {render as renderAccount, addTransaction, updateTransaction, addWeek} from './components/account';
import {render as renderLoadMore} from './components/loadMore.js';
import './util/handlebars';

const root = document.querySelector('.main');
const account = renderAccount();
const form = renderForm();
const loadMore = renderLoadMore();
root.appendChild(form.rootEl);
root.appendChild(account.rootEl);
root.appendChild(loadMore.rootEl);

account.on('account:transaction:edit', editTransaction);
form.on('form:transaction:add', addTransaction);
form.on('form:transaction:update', updateTransaction);
loadMore.on('loadmore:week:add', addWeek);
