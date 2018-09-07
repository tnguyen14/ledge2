/*
 * ledge
 * https://github.com/tnguyen14/ledge
 *
 * Copyright (c) 2014 Tri Nguyen
 * Licensed under the MIT license.
 */

'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(
	jwt({
		secret: jwksRsa.expressJwtSecret({
			cache: true,
			rateLimit: true,
			jwksRequestPerMinute: 5,
			jwksUri: `${process.env.AUTH0_SERVER}.well-known/jwks.json`
		}),
		audience: process.env.AUTH0_CLIENT_ID,
		issuer: process.env.AUTH0_SERVER,
		algorithms: ['RS256']
	}).unless({
		path: [/\/docs*/]
	})
);

app.use(bodyParser.json());

// docs
app.use('/docs', express.static('doc'));

require('./router')(app);

var server = app.listen(process.env.PORT || 3000, function() {
	console.log('Server listening on port %s', server.address().port);
});
