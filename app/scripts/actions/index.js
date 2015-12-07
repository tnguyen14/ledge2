'use strict';

require('es6-promise').polyfill();
var fetch = require('isomorphic-fetch');
var config = require('config');

var ACCOUNT_NAME = 'daily';

// action types
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
					payload: json
				});
			});
	};
}

module.exports = {
	RECEIVE_ACCOUNT: RECEIVE_ACCOUNT,
	getAccount: getAccount
};
