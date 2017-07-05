export const LOAD_WEEK = 'LOAD_WEEK';

export function loadWeek(offset) {
	return {
		type: LOAD_WEEK,
		data: offset
	};
}
