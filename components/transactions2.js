import {create as createWeek} from './week2';

let rootEl;

const weekOffsets = [0, -1, -2, -3];

export function render () {
	if (!rootEl) {
		rootEl = document.createElement('div');
		rootEl.className = 'transactions';
		weekOffsets.forEach((offset) => {
			rootEl.appendChild(createWeek(offset).render());
		});
	}
	return rootEl;
}
