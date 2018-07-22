# ledge

[![Build Status](https://travis-ci.org/tnguyen14/ledge.svg?branch=master)](https://travis-ci.org/tnguyen14/ledge)
[![js-happiness-style](https://img.shields.io/badge/code%20style-happiness-brightgreen.svg?style=flat-square)](https://github.com/JedWatson/happiness)
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
