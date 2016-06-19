import transactionTemplate from '../templates/transaction.hbs';
import {render as renderDialog, show as showDialog} from './deleteDialog';
import {date} from '../util/helpers';
import EventEmitter from 'eventemitter3';
import {deleteJson} from 'simple-fetch';
import config from 'config';

const transaction = Object.assign(Object.create(EventEmitter.prototype), {
	edit () {
		this.emit('edit', this);
	},
	close () {
		const dialog = renderDialog();
		this.rootEl.appendChild(dialog.rootEl);
		showDialog();
		dialog.on('confirm', () => {
			deleteJson(config.server_url + '/accounts/' + config.account_name + '/transactions/' + this.id)
				.then((json) => {
					this.rootEl.parentNode.removeChild(this.rootEl);
					delete this.rootEl;
				});
		});
	},
	startListening () {
		this.rootEl.querySelector('.action .edit').addEventListener('click', this.edit.bind(this)); // note: binding to this means cannot remove the listener
		this.rootEl.querySelector('.action .remove').addEventListener('click', this.close.bind(this));
	},
	render () {
		if (!this.rootEl) {
			this.rootEl = document.createElement('tr');
			this.rootEl.className = 'transaction';
			this.rootEl.innerHTML = transactionTemplate(this);
		}
		this.rootEl.setAttribute('data-day', date('ddd', this.date));
		this.startListening();
		return this.rootEl;
	}
});

export function create (data) {
	return Object.assign(Object.create(transaction), data);
}
