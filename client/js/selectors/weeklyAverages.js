import { createSelector } from 'reselect';

const getWeeks = state => state.weeks;

export const getLoadedWeeks = createSelector([getWeeks], weeks => {
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

const getAverageGroups = createSelector([getLoadedWeeks], loadedWeeks => {
	const averageGroups = [[], [], []];
	const numLoadedWeeks = loadedWeeks.length;
	if (numLoadedWeeks >= 5) {
		averageGroups[0] = loadedWeeks.slice(1, 5);
	}
	if (numLoadedWeeks >= 13) {
		averageGroups[1] = loadedWeeks.slice(1, 13);
	}
	if (numLoadedWeeks >= 25) {
		averageGroups[2] = loadedWeeks.slice(1, 25);
	}
	return averageGroups;
});

export const calculateWeeklyAverages = createSelector(
	[getAverageGroups],
	averageGroups => {
		return averageGroups.map(group => {
			return {
				numWeeks: group.length,
				weeklyAverage: calculateWeeklyAverage(group)
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
	return week.transactions.reduce((subtotal, transaction) => {
		return subtotal + transaction.amount;
	}, 0);
};
