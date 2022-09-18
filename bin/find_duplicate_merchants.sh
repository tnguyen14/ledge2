#!/usr/bin/env bash

declare -A LISTS_URLS=(
  [dev]="http://localhost:13050"
  [prod]="https://lists.cloud.tridnguyen.com"
)

meta=$(curl -H "Authorization: Bearer ${JWT_TOKEN}" \
  "${LISTS_URLS[$env]}/ledge/tri/meta" 2>/dev/null)

# convert merchants_count object to array
# to_entries return "key" and "value", get the "value" and add the "key" to the object item
# Find all items that have the values array with length greater than 2
echo "$meta" | jq '.merchants_count | to_entries | map_values(.value + {slug: .key}) | map(select((.values | length) > 1 ))'
