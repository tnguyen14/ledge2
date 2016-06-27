import template from '../templates/deleteDialog.hbs';
import EventEmitter from 'eventemitter3';

let dialog = Object.create(EventEmitter.prototype);

export function render () {
	let rootEl = dialog.rootEl;
	if (!rootEl) {
		rootEl = document.createElement('dialog');
		rootEl.innerHTML = template();
		rootEl.className = 'modal-content';
	}
	let cancelEls = rootEl.querySelectorAll('.cancel');
	Array.prototype.forEach.call(cancelEls, (el) => {
		el.addEventListener('click', () => {
			rootEl.close();
		});
	});
	rootEl.querySelector('.confirm').addEventListener('click', () => {
		dialog.emit('confirm');
		rootEl.close();
	});
	rootEl.addEventListener('close', close);
	dialog.rootEl = rootEl;
	return dialog;
}

function close () {
	document.body.classList.remove('modal-open');
	dialog.rootEl.parentNode.removeChild(dialog.rootEl);
	delete dialog.rootEl;
}

export function show () {
	dialog.rootEl.showModal();
	document.body.classList.add('modal-open');
}
