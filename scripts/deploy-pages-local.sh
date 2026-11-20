#!/usr/bin/env bash
# Build the install site tree locally and force-upload to the gh-pages branch.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STAGE="${TMPDIR:-/tmp}/tracko-pages-upload-$$"
REMOTE="${REMOTE:-git@github.com:zyvorai/tracko-install.git}"

rm -rf "$STAGE"
mkdir -p "$STAGE"
rsync -a \
  --exclude '.git/' \
  --exclude '.github/' \
  --exclude 'node_modules/' \
  --exclude '.DS_Store' \
  --exclude 'scripts/' \
  "$ROOT/" "$STAGE/"
touch "$STAGE/.nojekyll"

cd "$STAGE"
git init -b gh-pages
git add -A
git -c user.name='Tracko Pages' -c user.email='pages@tracko.local' commit -m "Deploy Tracko install site from local build."
git remote add origin "$REMOTE"
git push -f origin gh-pages

echo "Uploaded. Site: https://zyvorai.github.io/tracko-install/"
echo "Pages source must be branch gh-pages / (legacy)."
