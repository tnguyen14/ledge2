#!/usr/bin/env bash

LBR="%5B"  # left bracket
RBR="%5D"  # right bracket
SP="%20"   # space

declare -A LISTS_URLS=(
  [dev]="http://localhost:13050"
  [prod]="https://lists.cloud.tridnguyen.com"
)

merchant="${SP}Life${SP}Time"

response=$(curl -H "Authorization: Bearer ${JWT_TOKEN}" \
  "${LISTS_URLS[$env]}/ledge/tri/items?where${LBR}0${RBR}${LBR}field${RBR}=merchant&where${LBR}0${RBR}${LBR}op${RBR}===&where${LBR}0${RBR}${LBR}value${RBR}=${merchant}" 2>/dev/null)

echo "Found $(echo $response | jq '. | length') transactions"

echo "$response" | jq
