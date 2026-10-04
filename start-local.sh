#!/bin/sh
set -eu
cd "$(dirname "$0")/public"
printf 'Open http://localhost:8000 in your browser.\n'
python3 -m http.server 8000
