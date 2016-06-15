import weekTemplate from '../templates/week.hbs';
import moment from 'moment-timezone';

function context (offset) {
	const start = moment().isoWeekday(1 + offset * 7).startOf('isoWeek');
	const end = moment().isoWeekday(7 + offset * 7).endOf('isoWeek');
	return {
		start,
		end
	};
}

const week = {
	render () {
		if (this.offset === undefined) {
			this.offset = 0;
		}
		if (!this.rootEl) {
			this.rootEl = document.createElement('div');
			this.rootEl.className = 'weekly';
			this.rootEl.innerHTML = weekTemplate(context(this.offset));
		}
		return this.rootEl;
	}
};

export function create (offset) {
	return Object.assign(Object.create(week), {
		offset: offset
	});
}
