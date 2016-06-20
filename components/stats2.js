import template from '../templates/stats.hbs';

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
		Object.assign(this, data);
	}
};

export function create (data) {
	return Object.assign(Object.create(stats), data);
}
