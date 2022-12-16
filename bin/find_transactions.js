#!/usr/bin/env node

import simpleFetch from 'simple-fetch';
import { stringify } from 'qs';

const { getJson } = simpleFetch;

const LISTS_URLS = {
  dev: 'http://localhost:13050',
  prod: 'https://lists.cloud.tridnguyen.com'
};

const env = process.env.env;
const token = process.env.JWT_TOKEN;
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
