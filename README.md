# ledge

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

### Local development

```sh
npm start
```

#### Using Github Codespaces

```sh
gh cs ports forward 13050:13050 4003:4003
gh cs ssh
```

### Transaction lookup

To find a transaction locally by merchant

```sh
export env=dev # or env=prod
./bin/find_transactions.js -m "merchant name"
```

To fix duplicate transactions

- Verify what the slug for the merchant should be at <https://npm.runkit.com/%40tridnguyen%2Fslugify>.
- Go to the Firestore console, find the merchant with duplicate values under `merchants_counts`.
- Add the count of the old (duplicated) merchant to the correct one, then remove the old merchant.
- If the merchant pretty name needs to be updated on transactions, find the transaction (on Firestore console?) and update it accordingly.
