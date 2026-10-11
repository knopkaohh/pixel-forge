#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE_URL="${SITE_URL:-https://mary-jute.ru}"
OUT_DIR="${1:-/opt/cursor/artifacts}"
STAGE="$(mktemp -d /tmp/mary-jute-php.XXXXXX)"
DEST="$STAGE/site"
API_BACKUP=""

cleanup() {
  if [[ -n "$API_BACKUP" && -d "$API_BACKUP" && ! -d "$ROOT/src/app/api" ]]; then
    mv "$API_BACKUP" "$ROOT/src/app/api"
  fi
  rm -rf "$STAGE"
}
trap cleanup EXIT

cd "$ROOT"
export SITE_URL
export NEXT_OUTPUT=export

API_BACKUP="$(mktemp -d /tmp/mary-jute-api.XXXXXX)/api"
mv "$ROOT/src/app/api" "$API_BACKUP"
set +e
npm run build
BUILD_STATUS=$?
set -e
mv "$API_BACKUP" "$ROOT/src/app/api"
API_BACKUP=""
if [[ "$BUILD_STATUS" -ne 0 ]]; then
  exit "$BUILD_STATUS"
fi

mkdir -p "$DEST"
cp -a "$ROOT/out/." "$DEST/"
cp -a "$ROOT/hosting-php/api" "$DEST/api"
cp -a "$ROOT/hosting-php/data" "$DEST/data"
cp "$ROOT/hosting-php/config.php" "$DEST/config.php"
cp "$ROOT/hosting-php/.htaccess" "$DEST/.htaccess"
cp "$ROOT/hosting-php/router.php" "$DEST/router.php"
cp "$ROOT/hosting-php/КАК-ЗАПУСТИТЬ.txt" "$DEST/КАК-ЗАПУСТИТЬ.txt"
chmod 775 "$DEST/data"
chmod 664 "$DEST/data/admin-store.json" "$DEST/data/catalog.json"

ZIP_TMP="/tmp/mary-jute.ru.zip"
rm -f "$ZIP_TMP" "$ROOT/mary-jute.ru.zip"
(cd "$DEST" && zip -qr "$ZIP_TMP" .)
cp -f "$ZIP_TMP" "$ROOT/mary-jute.ru.zip"
mkdir -p "$OUT_DIR"
cp -f "$ZIP_TMP" "$OUT_DIR/mary-jute.ru.zip" || true
echo "ZIP $ROOT/mary-jute.ru.zip ($(du -h "$ROOT/mary-jute.ru.zip" | awk '{print $1}'))"
echo "index $(test -f "$DEST/index.html" && echo yes || echo NO)"
echo "images $(find "$DEST/images" -type f | wc -l)"
echo "api $(test -f "$DEST/api/index.php" && echo yes || echo NO)"
