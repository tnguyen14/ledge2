import moment from 'moment-timezone';
import config from 'config';

export function date (format, date) {
	return moment(date).format(format);
}

const retrieveFromArray = function (array, value) {
	const results = array.filter(function (element) {
		return element.slug === value;
	});
	if (results.length > 0) {
		return results[0].value;
	}
};

export function getCategory (cat) {
	return retrieveFromArray(config.categories, cat);
}

export function getSource (source) {
	return retrieveFromArray(config.sources, source);
}

// simple money formatter
export function money (amount) {
	if (!amount) {
		return '$0.00';
	} else {
		return '$' + (amount / 100).toFixed(2);
	}
}
