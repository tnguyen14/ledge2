#!/usr/bin/env node

import 'dotenv/config';
import { program } from 'commander';
import simpleFetch from 'simple-fetch';
import { stringify } from 'qs';
import { getToken } from '@tridnguyen/auth/server.js';

program.option('-m, --merchant <merchant>').option('-d, --debug');
program.parse();

const options = program.opts();

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

// TODO: It's ok to search for transactions without merchant
if (!options.merchant) {
  throw new Error("Missing option for 'merchant'");
}

console.log(`Searching for transactions with merchant ${options.merchant}`);

const query = stringify({
  where: [
    {
      field: 'merchant',
      op: '==',
      value: options.merchant
    }
  ]
});

if (options.debug) {
  console.log(`Query: ${query}`);
}

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
