# ledge

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

### Local development

To find a transaction locally by merchant

```sh
export JWT_TOKEN=<token>
export env=dev # or env=prod
# update bin/find_transactions.sh value of "merchant"
./bin/find_transactions.sh
```
