// simple money formatter
export default function money(amount) {
	if (!amount) {
		return '$0.00';
	} else {
		return '$' + (amount / 100).toFixed(2);
	}
}
