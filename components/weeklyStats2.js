import stats from './stats2';
import config from 'config';
import {getTotal, getCategoryTotal} from '../util/total';

function calculateStats (transactions) {
	const totals = config.categories.map((cat) => {
		return {
			amount: getCategoryTotal(transactions, cat),
			label: cat.value,
			slug: cat.slug
		};
	}).filter((stat) => {
		return stat.amount > 0;
	});
	return {
		stats: totals,
		total: getTotal(transactions)
	};
}

const weeklyStats = Object.assign({}, stats, {
	updateWithTransactions (transactions) {
		this.updateWithData(calculateStats(transactions, this.offset));
		this.render();
	}
});

export function create (opts) {
	return Object.assign(Object.create(weeklyStats), opts, {
		stats: calculateStats(opts.transactions),
		className: 'summary',
		id: 'week-' + opts.offset
	});
}
