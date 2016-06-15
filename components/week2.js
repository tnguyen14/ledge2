import weekTemplate from '../templates/week.hbs';
import {create as createTransaction} from './transaction2';
import moment from 'moment-timezone';

function getStartEnd (offset) {
	const start = moment().isoWeekday(1 + offset * 7).startOf('isoWeek');
	const end = moment().isoWeekday(7 + offset * 7).endOf('isoWeek');
	return {
		start,
		end
	};
}

const week = {
	render () {
		if (this.offset === undefined) {
			this.offset = 0;
		}
		if (!this.rootEl) {
			this.rootEl = document.createElement('div');
			this.rootEl.className = 'weekly';
			this.rootEl.innerHTML = weekTemplate(this);
		}
		return this.rootEl;
	},
	filterTransactions (transactions) {
		const self = this;
		return transactions.filter((t) => {
			return t.date >= self.start.toISOString() && t.date <= self.end.toISOString();
		}).sort((a, b) => {
			// sort by id
			return Number(b.id) - Number(a.id);
		});
	},
	renderTransactions () {
		this.transactionsEls = this.transactions.map((transactionData) => {
			let tx = createTransaction(transactionData);
			this.rootEl.querySelector('.weekly-transactions tbody')
				.appendChild(tx.render());
			return tx;
		});
	},
	updateWithTransactions (transactions) {
		this.transactions = this.filterTransactions(transactions);
		this.renderTransactions();
	}
};

export function create (offset) {
	return Object.assign(Object.create(week), getStartEnd(offset), {
		offset: offset,
		transactions: [],
		transactionsEls: []
	});
}
