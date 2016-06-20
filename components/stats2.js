import template from '../templates/stats.hbs';

function transformData (data) {
	data.stats.sort((a, b) => {
		return b.amount - a.amount;
	});
	return {...data, stats: data.stats.concat({
		amount: data.total,
		label: 'Total',
		slug: 'total'
	})};
}
const stats = {
	render () {
		if (!this.rootEl) {
			this.rootEl = document.createElement('div');
			this.rootEl.classList.add('stats');
			if (this.className) {
				this.rootEl.classList.add(this.className);
			}
		}
		this.rootEl.innerHTML = template(this);
		return this.rootEl;
	},
	updateWithData (data) {
		Object.assign(this, transformData(data));
	}
};

export default stats;

export function create (data) {
	return Object.assign(Object.create(stats), transformData(data));
}
