import {create as createWeek} from './week2';
import EventEmitter from 'eventemitter3';

let transactions = Object.create(EventEmitter.prototype);

const weekOffsets = [0, -1, -2, -3];
let weeks = [];

function startListening () {
	weeks.forEach((week) => {
		week.on('transaction:edit', (tx) => {
			transactions.emit('transaction:edit', tx);
		});
	});
}
export function render () {
	if (!transactions.rootEl) {
		transactions.rootEl = document.createElement('div');
		transactions.rootEl.className = 'transactions';
		weekOffsets.forEach((offset) => {
			let week = createWeek(offset);
			weeks.push(week);
			transactions.rootEl.appendChild(week.render());
		});
		startListening();
	}
	return transactions;
}

export function updateWithTransactions (transactions) {
	weeks.forEach((week) => {
		week.updateWithTransactions(transactions);
	});
}

export function addTransaction (transaction) {
	weeks.forEach((week) => {
		week.addTransaction(transaction);
	});
}
