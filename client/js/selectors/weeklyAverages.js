import { createSelector } from 'reselect';

const getWeeks = (state) => state.weeks;

export const getTimeSpans = createSelector(getWeeks, (weeks) => {
	const timeSpans = [4, 12, 24];
	return timeSpans.map((numWeeksInSpan, index) => {
		const span = {
			numWeeks: numWeeksInSpan,
			loaded: false,
			weeks: []
		};
		const pastWeeks = Object.keys(weeks).filter((x) => x < 0);
		span.weeks = pastWeeks
			.filter((weekIndex) => {
				return (
					Math.abs(weekIndex) <= numWeeksInSpan &&
					weeks[weekIndex].hasLoaded
				);
			})
			.map((weekIndex) => weeks[weekIndex]);

		// only assign weeks array for calculation if all weeks
		// of the group has already been loaded
		if (span.weeks.length == numWeeksInSpan) {
			span.loaded = true;
		}
		return span;
	});
});

export const hasNotFullyLoaded = createSelector(getTimeSpans, (spans) => {
	const spansNotLoaded = spans.filter((span) => {
		return span.loaded == false;
	});
	return spansNotLoaded.length > 0;
});

export const calculateWeeklyAverages = createSelector(getTimeSpans, (spans) => {
	return spans.map((span) => {
		return {
			...span,
			weeklyAverage: calculateWeeklyAverage(span.weeks)
		};
	});
});

const calculateWeeklyAverage = (weeks) => {
	return (
		weeks.reduce((subtotal, week) => {
			return subtotal + calculateWeeklyTotal(week);
		}, 0) / weeks.length
	);
};

const calculateWeeklyTotal = (week) => {
	return week.transactions
		.filter((txn) => !txn.carriedOver)
		.reduce((subtotal, transaction) => {
			return subtotal + transaction.amount;
		}, 0);
};
