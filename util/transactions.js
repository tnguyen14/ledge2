export function findPositionToInsert (transactions, date) {
	let earlierIndex = 0;
	let found = false;
	while (earlierIndex < transactions.length && !found) {
		let tx = transactions[earlierIndex];
		if (tx.date < date) {
			found = true;
		} else {
			earlierIndex += 1;
		}
	}
	return earlierIndex;
}

export function findIndexByID (transactions, id) {
	let IDs = transactions.map((t) => {
		return t.id;
	});
	return IDs.indexOf(id);
}
