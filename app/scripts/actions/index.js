'use strict';

require('es6-promise').polyfill();
require('isomorphic-fetch');
var config = require('config');

var ACCOUNT_NAME = 'daily';
var RECEIVE_ACCOUNT = 'RECEIVE_ACCOUNT';

function getAccount () {
	return function (dispatch) {
		return fetch(config.server_url + '/accounts/' + ACCOUNT_NAME)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				return dispatch({
					type: RECEIVE_ACCOUNT,
					payload: {
						account: json
					}
				});
			});
	};
}

module.exports = {
	RECEIVE_ACCOUNT: RECEIVE_ACCOUNT,
	getAccount: getAccount
};
