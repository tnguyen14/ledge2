#!/usr/bin/env node

import 'dotenv/config';
import simpleFetch from 'simple-fetch';
import { stringify } from 'qs';
import { getToken } from '@tridnguyen/auth/server.js';

const token = await getToken({
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  audience: 'https://lists.cloud.tridnguyen.com'
});

const { getJson } = simpleFetch;

const LISTS_URLS = {
  dev: 'http://localhost:13050',
  prod: 'https://lists.cloud.tridnguyen.com'
};

const env = process.env.env;
const merchant = process.argv[2];

if (!merchant) {
  throw new Error('Missing merchant - please pass merchant in as first arg');
}

const query = stringify({
  where: [
    {
      field: 'merchant',
      op: '==',
      value: merchant
    }
  ]
});

getJson(`${LISTS_URLS[env]}/ledge/tri/items?${query}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
}).then(
  (data) => {
    console.log(`Found ${data.length} transactions`);
    console.log(data);
  },
  (err) => {
    console.error('Something went wrong');
    console.error(err);
  }
);
