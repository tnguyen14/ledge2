import transactionTemplate from '../templates/transaction.hbs';
import {render as renderDialog, show as showDialog} from './deleteDialog';
import {date} from '../util/helpers';
import EventEmitter from 'eventemitter3';
import {deleteJson} from 'simple-fetch';
import config from 'config';
import events from 'events-mixin';

const transaction = Object.assign(Object.create(EventEmitter.prototype), {
	edit () {
		window.scroll(0, 0);
		this.emit('transaction:edit', this);
	},
	delete () {
		const dialog = renderDialog();
		this.rootEl.appendChild(dialog.rootEl);
		showDialog();
		dialog.on('confirm', () => {
			deleteJson(config.server_url + '/accounts/' + config.account_name +
				'/transactions/' + this.id)
				.then((json) => {
					this.remove();
				});
		});
	},
	remove () {
		this.rootEl.parentNode.removeChild(this.rootEl);
		delete this.rootEl;
		this.emit('transaction:remove', this.id);
	},
	toggleActive () {
		if (this.rootEl.classList.contains('active')) {
			this.rootEl.classList.remove('active');
		} else {
			this.rootEl.classList.add('active');
		}
	},
	startListening () {
		this.events.bind({
			'click .action .edit': 'edit',
			'click .action .remove': 'delete',
			'click': 'toggleActive'
		});
	},
	stopListening () {
		this.events.unbind();
	},
	render () {
		if (!this.rootEl) {
			this.rootEl = document.createElement('tr');
			this.rootEl.className = 'transaction';
			this.events = events(this.rootEl, this);
		} else {
			this.stopListening();
		}
		this.rootEl.innerHTML = transactionTemplate(this);
		this.rootEl.setAttribute('data-day', date('ddd', this.date));
		this.startListening();
		return this.rootEl;
	}
});

export function create (data) {
	return Object.assign(Object.create(transaction), data);
}
