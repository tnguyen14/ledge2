# ledge

![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/tridnguyen/ledge.svg?style=flat-square)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

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

## Local Development

To sync data from production to dev:

- Sign into the site, copy the auth token from `localStorage.getItem('id_token')`
- Set environment variables (could be done in `.env`):
	- `SYNC_FROM_SERVER_URL`: Production server, such as `https://api.tridnguyen.com/ledge`
	- `SERVER_URL`: Dev server, such as `https://api.home.tridnguyen.com/ledge`
	- `AUTH0_USER`: User ID
	- `FIREBASE_PROJECT_ID`
	- `SERVICE_ACCOUNT_JSON`
- Run `npm run db:migrate:firestore`
