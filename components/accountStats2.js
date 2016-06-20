import {create as createStats} from './stats2';
import config from 'config';
import slug from 'slug';
import {getTotalWeeks} from '../util/weeks';
import {getTotal, getCategoryTotal} from '../util/total';

let label = 'Weekly Averages';

// initialize with empty array
let stats = createStats(Object.assign({
	label: label,
	className: 'account-stats',
	id: slug(label)
}, calculateStats([])));

function calculateStats (transactions) {
	const numWeeks = getTotalWeeks(transactions);
	const averages = config.categories.map((cat) => {
		return {
			amount: getCategoryTotal(transactions, cat) / numWeeks,
			label: cat.value,
			slug: cat.slug
		};
	});
	return {
		stats: averages,
		total: getTotal(transactions) / numWeeks
	};
}

export function render () {
	return stats.render();
}

export function updateWithTransactions (transactions) {
	stats.updateWithData(calculateStats(transactions));
	stats.render();
}
