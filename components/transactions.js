import {create as createWeek} from './week';
import EventEmitter from 'eventemitter3';

let transactions = Object.create(EventEmitter.prototype);
let transactionsData;

let weekOffsets = [0, -1, -2, -3];
let weeks = [];

function startListeningOnWeek (week) {
	week.on('transaction:edit', (tx) => {
		transactions.emit('transaction:edit', tx);
	});
}

function renderWeek (offset) {
	let week = createWeek(offset);
	weeks.push(week);
	transactions.rootEl.appendChild(week.render());
	startListeningOnWeek(week);
	return week;
}

export function render () {
	if (!transactions.rootEl) {
		transactions.rootEl = document.createElement('div');
		transactions.rootEl.className = 'transactions';
		weekOffsets.forEach(renderWeek);
	}
	return transactions;
}

export function updateWithTransactions (transactions) {
	transactionsData = transactions;
	weeks.forEach((week) => {
		week.updateWithTransactions(transactions);
	});
}

export function addTransaction (transaction) {
	weeks.forEach((week) => {
		week.addTransaction(transaction);
	});
}

export function updateTransaction (oldId, transaction) {
	weeks.forEach((week) => {
		week.updateTransaction(oldId, transaction);
	});
}

export function addWeek () {
	let offset = weekOffsets[weekOffsets.length - 1] - 1;
	weekOffsets.push(offset);
	let week = renderWeek(offset);
	week.updateWithTransactions(transactionsData);
}
