import { combineReducers } from 'redux';
import { RECEIVE_ACCOUNT } from '../actions';
import moment from 'moment-timezone';
import config from 'config';
import statsUtil from '../util/stats';

function account (state, action) {
	switch (action.type) {
		case RECEIVE_ACCOUNT:
			return Object.assign({}, action.payload, {
				weeks: weeks(action.payload.transactions),
				stats: stats(action.payload.transactions)
			});
		default:
			return {
				weeks: [],
				stats: {
					averages: []
				}
			};
	}
}

function stats (transactions) {
	let averages = [];
	const numWeeks = statsUtil.totalWeeks(transactions);
	config.categories.forEach(function (cat) {
		const catTransactions = transactions.filter(function (t) {
			return t.category === cat.slug;
		});
		const catTotal = catTransactions.reduce(function (total, t) {
			return total + t.amount;
		}, 0);
		averages.push({
			amount: catTotal / numWeeks,
			label: cat.value,
			slug: cat.slug + '-avg'
		});
	});

	const allTotal = transactions.reduce(function (total, t) {
		return total + t.amount;
	}, 0);
	averages.push({
		amount: allTotal / numWeeks,
		label: 'Total',
		slug: 'total-avg'
	});

	return {
		averages: averages
	};
}

/**
 * @param {Array} transactions
 * @return {Object} weeks
 */
function weeks (transactions) {
	if (!transactions || !transactions.length) {
		return {};
	}
	return [
		getWeek(0, transactions),
		getWeek(-1, transactions),
		getWeek(-2, transactions),
		getWeek(-3, transactions)
	];

}

/**
 * @param {Number} offset
 * @param {Array} transactions
 * @return {Object} week
 */
function getWeek (offset, transactions) {
	const start = moment().isoWeekday(1 + offset * 7).startOf('isoWeek');
	const end = moment().isoWeekday(7 + offset * 7).endOf('isoWeek');
	const thisTransactions = transactions.filter(function (t) {
		return t.date >= start.toISOString() && t.date <= end.toISOString();
	});
	const thisTotal = thisTransactions.reduce(function (total, t) {
		return total + t.amount;
	}, 0);
	let categoryTotals = [];
	config.categories.forEach(function (cat) {
		const catTransactions = thisTransactions.filter(function (t) {
			return t.category === cat.slug;
		});
		if (catTransactions.length === 0) {
			return;
		}
		const catTotal = catTransactions.reduce(function (total, t) {
			return total + t.amount;
		}, 0);
		categoryTotals.push({
			amount: catTotal,
			label: cat.value,
			slug: cat.slug + '-cat-total'
		});
	});

	return {
		start: start,
		end: end,
		transactions: thisTransactions,
		stats: {
			total: thisTotal,
			categoryTotals: categoryTotals
		}
	};
}

const rootReducer = combineReducers({
	account: account
});

export default rootReducer;
