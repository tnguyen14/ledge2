import EventEmitter from 'eventemitter3';

let loadMore = Object.create(EventEmitter.prototype);

function startListening () {
	if (!loadMore.rootEl) {
		return;
	}
	loadMore.rootEl.addEventListener('click', function (e) {
		loadMore.emit('weeks:add');
	});
}

export function render () {
	if (!loadMore.rootEl) {
		loadMore.rootEl = document.createElement('button');
		loadMore.rootEl.innerHTML = 'Show more';
		loadMore.rootEl.setAttribute('type', 'button');
		loadMore.rootEl.classList.add('btn');
		loadMore.rootEl.classList.add('btn-success');
		startListening();
	}
	return loadMore;
}
