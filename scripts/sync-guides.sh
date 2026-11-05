#!/usr/bin/env bash
# Copy the guides that live on this site from the tracko repo's docs/ (the source of truth) and turn links to
# docs that are not published here into plain text, so the public site has no dead links.
#   ./scripts/sync-guides.sh [path-to-tracko-repo]      (default ../tracko)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:-$ROOT/../tracko}/docs"
cd "$ROOT"
GUIDES=(INTEGRATIONS MOBILE_RELEASE PILOT VENDOR_UAT WHATSAPP WORLD_CLASS)
for g in "${GUIDES[@]}"; do cp "$SRC/$g.md" "./$g.md"; done
python3 - "${GUIDES[@]}" <<'PY'
import os, re, sys
published = {f for f in os.listdir('.') if f.endswith('.md')}
for f in (g + '.md' for g in sys.argv[1:]):
    s = open(f).read()
    def fix(m):
        text, target = m.group(1), m.group(2)
        base = target.split('#')[0]
        if base == '' or base.startswith(('http://', 'https://', '#', 'mailto:')):
            return m.group(0)
        if base.startswith('./') and base[2:] in published:
            return m.group(0)
        return text
    open(f, 'w').write(re.sub(r'\[([^\]]+)\]\(([^)]+)\)', fix, s))
PY
echo "synced: ${GUIDES[*]}"
