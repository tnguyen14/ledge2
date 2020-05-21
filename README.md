# ledge

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m783022626-59e5f02bc4047cc0d49d005e.svg?style=flat-square)

## Client

React app, with redux.

## Server

See <https://api.tridnguyen.com/ledge/docs/>

### Merchant count

Each account contains a property that keep track of the merchants used in that account and the number of times each merchant is used.

```json
// account
{
  "name": "foo",
  "merchants_count": {
    "slugified-merchant-name": {
      "count": 5,
      "values": ["Slugified merchant name", "slugified Merchant Name"]
    }
  }
}
```

The `values` array contains variations of the same name after slugified.

#### Fix duplicate/ similar merchants

```bash
:; node scripts/get-merchants.js [<merchant-slug>]
:; node scripts/query-transaction.js --merchant <merchant-name>
:; node scripts/update-transaction.js --id <transaction-id> --merchant <new-merchant-name>
```

## Local Development

To sync data from production to dev:

- Sign into the site, copy the auth token from `localStorage.getItem('id_token')`
- Set environment variables (could be done in `.env`): - `SYNC_FROM_SERVER_URL`: Production server, such as `https://api.tridnguyen.com/ledge` - `SERVER_URL`: Dev server, such as `https://api.home.tridnguyen.com/ledge` - `AUTH0_USER`: User ID - `FIREBASE_PROJECT_ID` - `SERVICE_ACCOUNT_JSON`
- Run `npm run db:migrate:firestore`
