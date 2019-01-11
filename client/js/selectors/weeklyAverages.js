import { createSelector } from 'reselect';

const getWeeks = state => state.weeks;

export const getLoadedWeeks = createSelector(getWeeks, weeks => {
	let loadedWeeks = [];
	// need to get consecutive loaded weeks
	for (let i = 0; i < Object.keys(weeks).length; i++) {
		if (weeks[-i].hasLoaded) {
			loadedWeeks.push(weeks[-i]);
		} else {
			break;
		}
	}
	return loadedWeeks;
});

const getAverageGroups = createSelector(getLoadedWeeks, loadedWeeks => {
	const averageGroups = [4, 12, 24];
	const numLoadedWeeks = loadedWeeks.length;
	return averageGroups.map((numWeeksInGroup, index) => {
		const group = {
			numWeeks: numWeeksInGroup,
			weeks: []
		};
		// only assign weeks array for calculation if all weeks
		// of the group has already been loaded
		if (numLoadedWeeks > numWeeksInGroup) {
			group.weeks = loadedWeeks.slice(1, numWeeksInGroup + 1);
		}
		return group;
	});
});

export const calculateWeeklyAverages = createSelector(
	getAverageGroups,
	averageGroups => {
		return averageGroups.map(group => {
			return {
				...group,
				weeklyAverage: calculateWeeklyAverage(group.weeks)
			};
		});
	}
);

const calculateWeeklyAverage = weeks => {
	return (
		weeks.reduce((subtotal, week) => {
			return subtotal + calculateWeeklyTotal(week);
		}, 0) / weeks.length
	);
};

const calculateWeeklyTotal = week => {
	return week.transactions
		.filter(txn => !txn.carriedOver)
		.reduce((subtotal, transaction) => {
			return subtotal + transaction.amount;
		}, 0);
};
