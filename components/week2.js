import weekTemplate from '../templates/week.hbs';
import {create as createTransaction} from './transaction2';
import moment from 'moment-timezone';
import EventEmitter from 'eventemitter3';

function getStartEnd (offset) {
	const start = moment().isoWeekday(1 + offset * 7).startOf('isoWeek');
	const end = moment().isoWeekday(7 + offset * 7).endOf('isoWeek');
	return {
		start,
		end
	};
}

const week = Object.assign(Object.create(EventEmitter.prototype), {
	render () {
		if (this.offset === undefined) {
			this.offset = 0;
		}
		if (!this.rootEl) {
			this.rootEl = document.createElement('div');
			this.rootEl.className = 'weekly';
			this.rootEl.innerHTML = weekTemplate(this);
		}
		this.tbodyEl = this.rootEl.querySelector('.weekly-transactions tbody');
		return this.rootEl;
	},
	filterTransactions (transactions) {
		return transactions.filter(this.isWithinWeek.bind(this)).sort((a, b) => {
			// sort by id
			return Number(b.id) - Number(a.id);
		});
	},
	startListening () {
		this.transactions.forEach((tx) => {
			tx.on('edit', this.editTransaction.bind(this));
		});
	},
	editTransaction (tx) {
		this.emit('transaction:edit', tx);
	},
	renderTransactions (transactions) {
		this.transactions = transactions.map((transactionData) => {
			let tx = createTransaction(transactionData);
			this.tbodyEl.appendChild(tx.render());
			return tx;
		});
		this.startListening();
	},
	updateWithTransactions (transactions) {
		this.renderTransactions(this.filterTransactions(transactions));
	},
	isWithinWeek (t) {
		return t.date >= this.start.toISOString() && t.date <= this.end.toISOString();
	},
	addTransaction (transaction) {
		if (!this.isWithinWeek(transaction)) {
			return;
		}
		let tx = createTransaction(transaction);
		// find where to insert the new transaction
		let earlierIndex = 0;
		let earlierTransaction;
		while (earlierIndex < this.transactions.length && !earlierTransaction) {
			let tx = this.transactions[earlierIndex];
			if (tx.id < transaction.id) {
				earlierTransaction = tx;
			} else {
				earlierIndex += 1;
			}
		}
		this.transactions.splice(earlierIndex, 0, tx);
		this.tbodyEl.insertBefore(tx.render(), earlierTransaction ? earlierTransaction.rootEl : null);
	}
});

export function create (offset) {
	return Object.assign(Object.create(week), getStartEnd(offset), {
		offset: offset,
		transactions: [],
		transactionsEls: []
	});
}
