import {render as renderForm} from './components/form';
import {render as renderTransactions} from './components/transactions2';
import {getJson} from 'simple-fetch';
import config from 'config';
import './util/handlebars';

const root = document.querySelector('.main');
root.appendChild(renderForm());
root.appendChild(renderTransactions());

getJson(config.server_url + '/accounts/' + config.account_name)
	.then((json) => {
		console.log(json);
	});
