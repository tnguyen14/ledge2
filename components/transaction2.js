import transactionTemplate from '../templates/transaction.hbs';
import {date} from '../util/helpers';

const transaction = {
	render () {
		if (!this.rootEl) {
			this.rootEl = document.createElement('tr');
			this.rootEl.className = 'transaction';
			this.rootEl.innerHTML = transactionTemplate(this);
		}
		this.rootEl.setAttribute('data-day', date('ddd', this.date));
		return this.rootEl;
	}
};

export function create (data) {
	return Object.assign(Object.create(transaction), data);
}
