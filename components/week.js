import weekTemplate from '../templates/week.hbs';
import {create as createTransaction} from './transaction';
import {create as createStats} from './weeklyStats';
import {findPositionToInsert, findIndexByID} from '../util/transactions';
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
		return transactions.filter(this.isWithinWeek.bind(this))
			.sort((a, b) => {
				// sort by id
				return Number(b.id) - Number(a.id);
			});
	},
	startListening () {
		this.transactions.forEach(this.startListeningOnTransaction.bind(this));
	},
	startListeningOnTransaction (tx) {
		tx.on('transaction:edit', this.editTransaction.bind(this));
		tx.on('transaction:remove', this.removeTransaction.bind(this));
	},
	stopListeningOnTransaction (tx) {
		tx.off('edit');
		tx.off('remove');
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
		this.updateStats();
	},
	updateStats () {
		this.stats.updateWithTransactions(this.transactions);
	},
	isWithinWeek (t) {
		return t.date >= this.start.toISOString() &&
			t.date <= this.end.toISOString();
	},
	editTransaction (tx) {
		this.emit('week:transaction:edit', tx);
	},
	removeTransaction (id) {
		let index = findIndexByID(this.transactions, id);
		if (index === -1) {
			throw new Error('Transaction ' + id + ' is not in week.');
		}
		this.stopListeningOnTransaction(this.transactions[index]);
		this.transactions.splice(index, 1);
		this.updateStats();
		this.emit('week:transaction:remove', id);
	},
	addTransaction (transaction) {
		if (!this.isWithinWeek(transaction)) {
			return;
		}
		let tx = createTransaction(transaction);
		const earlierIndex = findPositionToInsert(this.transactions,
			transaction.date);
		const earlierTransaction = this.transactions[earlierIndex];
		this.transactions.splice(earlierIndex, 0, tx);
		this.tbodyEl.insertBefore(tx.render(),
			earlierTransaction ? earlierTransaction.rootEl : null);
		this.updateStats();
		this.startListeningOnTransaction(tx);
		this.emit('week:transaction:add', transaction);
	},
	updateTransaction (oldId, transaction) {
		let index = findIndexByID(this.transactions, oldId);
		// week has the old transaction -> remove
		if (index !== -1) {
			this.transactions[index].remove();
		}
		// week has the new transaction
		if (this.isWithinWeek(transaction)) {
			this.addTransaction(transaction);
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
