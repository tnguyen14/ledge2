import {create as createWeek} from './week';
import EventEmitter from 'eventemitter3';
import {render as renderStats, updateWithTransactions as updateStatsWithTransactions} from './accountStats';
import {findPositionToInsert, findIndexByID} from '../util/transactions';
import {updateMerchantList} from './form';
import {getJson} from 'simple-fetch';
import config from 'config';

let account = Object.create(EventEmitter.prototype);
let data;

let weekOffsets = [0, -1, -2, -3];
let weeks = [];

function startListeningOnWeek (week) {
	week.on('week:transaction:edit', (tx) => {
		account.emit('account:transaction:edit', tx);
	});
	week.on('week:transaction:add', addTransactionToData);
	week.on('week:transaction:remove', removeTransactionFromData);
}

function renderWeek (offset) {
	let week = createWeek(offset);
	weeks.push(week);
	account.rootEl.appendChild(week.render());
	startListeningOnWeek(week);
	return week;
}

export function render () {
	if (!account.rootEl) {
		account.rootEl = document.createElement('div');
		account.rootEl.className = 'transactions';
		weekOffsets.forEach(renderWeek);
	}
	loadAccount();
	return account;
}

export function renderAccountStats () {
	account.rootEl.parentNode.insertBefore(renderStats(),
		account.rootEl
	);
}

function loadAccount () {
	getJson(config.server_url + '/accounts/' + config.account_name)
		.then((account) => {
			updateMerchantList(account.merchants_count);
		});
}

function addTransactionToData (transaction) {
	const earlierIndex = findPositionToInsert(data,
		transaction.date);
	data.splice(earlierIndex, 0, transaction);
	updateStatsWithTransactions(data);
}

function removeTransactionFromData (id) {
	let index = findIndexByID(data, id);
	if (index === -1) {
		throw new Error('Transaction with ID ' + id + ' is not found.');
	}
	data.splice(index, 1);
	updateStatsWithTransactions(data);
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
	renderWeek(offset);
}
