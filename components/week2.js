import weekTemplate from '../templates/week.hbs';
import {create as createTransaction} from './transaction2';
import {create as createStats} from './weeklyStats2';
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
		this.stats = createStats({
			transactions: [],
			offset: this.offset
		});
		this.rootEl.appendChild(this.stats.render());
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
		this.stats.updateWithTransactions(this.transactions);
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
			if (tx.date < transaction.date) {
				earlierTransaction = tx;
			} else {
				earlierIndex += 1;
			}
		}
		this.transactions.splice(earlierIndex, 0, tx);
		this.tbodyEl.insertBefore(tx.render(), earlierTransaction ? earlierTransaction.rootEl : null);
		tx.on('edit', this.editTransaction.bind(this));
	},
	updateTransaction (transaction) {
		let IDs = this.transactions.map((t) => {
			return t.id;
		});
		// week does not have the old transaction
		if (!IDs.includes(transaction.oldId)) {
			if (this.isWithinWeek(transaction)) {
				this.addTransaction(transaction);
				return;
			} else {
				return;
			}
		}
		let index = IDs.indexOf(transaction.oldId);
		// week has the old transaction, but not the new one
		// remove the old one
		if (!this.isWithinWeek(transaction)) {
			this.transactions[index].remove();
			this.transactions.splice(index, 1);
		} else {
			this.transactions[index].update(transaction);
		}
	}
});

export function create (offset) {
	return Object.assign(Object.create(week), getStartEnd(offset), {
		offset: offset,
		transactions: [],
		transactionsEls: []
	});
}
