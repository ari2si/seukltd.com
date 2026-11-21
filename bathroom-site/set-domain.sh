#!/usr/bin/env bash
# Replace the placeholder domain with your real domain across the whole site.
# Usage:  ./set-domain.sh yourdomain.com    (or www.yourdomain.com)
set -e
NEW="$1"
if [ -z "$NEW" ]; then echo "Usage: ./set-domain.sh your-domain.com"; exit 1; fi
OLD="www.smartenvironmentbathrooms.co.uk"
echo "Replacing $OLD  ->  $NEW"
grep -rl "$OLD" . --include='*.html' --include='*.xml' --include='*.txt' 2>/dev/null | while read -r f; do
  sed -i.bak "s#$OLD#$NEW#g" "$f" && rm -f "$f.bak"
done
echo "Done. Your site now uses https://$NEW"
