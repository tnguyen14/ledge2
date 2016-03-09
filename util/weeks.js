'use strict';

var moment = require('moment-timezone');

function weeksInBetween (beginning, end) {
	if (!beginning || !end) {
		throw new Error('Beginning and end dates are needed to calculate the number of weeks.');
	}
	var beginningWeek = moment(beginning).week();
	var beginningYear = moment(beginning).year();
	var endWeek = moment(end).week();
	var endYear = moment(end).year();
	return (52 - beginningWeek) + endWeek + (endYear - beginningYear - 1) * 52;
}

/**
 * calculate the number of weeks a transactions collection span
 * @param transactions {collection} the collection of transactions
 */
export function getTotalWeeks (transactions) {
	if (!transactions || !Array.isArray(transactions)) {
		throw new Error('transactions needs to be an array.');
	}
	if (transactions.length === 0 || transactions.length === 1) {
		return transactions.length;
	}
	var beginning = transactions[0].date;
	var end = transactions[transactions.length - 1].date;
	return weeksInBetween(beginning, end);
}
