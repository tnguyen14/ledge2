import transactionTemplate from '../templates/transaction.hbs';
import {date} from '../util/helpers';
import EventEmitter from 'eventemitter3';

const transaction = Object.assign(Object.create(EventEmitter.prototype), {
	edit (e) {
		this.emit('edit', this);
	},
	startListening () {
		this.rootEl.querySelector('.action .edit').addEventListener('click', this.edit.bind(this)); // note: binding to this means cannot remove the listener
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
