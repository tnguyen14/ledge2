import {create as createWeek} from './week2';

let rootEl;

const weekOffsets = [0, -1, -2, -3];
let weeks = [];

export function render () {
	if (!rootEl) {
		rootEl = document.createElement('div');
		rootEl.className = 'transactions';
		weekOffsets.forEach((offset) => {
			let week = createWeek(offset);
			weeks.push(week);
			rootEl.appendChild(week.render());
		});
	}
	return rootEl;
}

export function updateWithTransactions (transactions) {
	weeks.forEach((week) => {
		week.updateWithTransactions(transactions);
	});
}
