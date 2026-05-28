#!/bin/sh
set -eu

api_base_url="${API_BASE_URL:-/api}"
escaped_api_base_url="$(printf '%s' "$api_base_url" | sed 's/\\/\\\\/g; s/"/\\"/g')"

cat > /usr/share/nginx/html/assets/runtime-config.js <<EOF
globalThis.__flipshopConfig = {
  apiBaseUrl: "$escaped_api_base_url"
};
EOF
