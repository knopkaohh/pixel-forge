#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE_URL="${SITE_URL:-https://mary-jute.ru}"
OUT_DIR="${1:-/opt/cursor/artifacts}"
STAGE="$(mktemp -d /tmp/mary-jute-pack.XXXXXX)"
NAME="mary-jute.ru"
DEST="$STAGE/$NAME"

cleanup() { rm -rf "$STAGE"; }
trap cleanup EXIT

cd "$ROOT"
export SITE_URL
npm run build

mkdir -p "$DEST"
cp -a .next/standalone/. "$DEST/"
mkdir -p "$DEST/.next" "$DEST/public" "$DEST/data"
cp -a public/. "$DEST/public/"
cp -a .next/static "$DEST/.next/static"
SECRET="$(openssl rand -hex 24)"
cat > "$DEST/.env" <<EOF
SITE_URL=$SITE_URL
HOSTNAME=0.0.0.0
PORT=3000
ADMIN_LOGIN=admin
ADMIN_PASSWORD=admin
ADMIN_NAME=Елена Варакина
ADMIN_SECRET=$SECRET
EOF
cat > "$DEST/data/admin-store.json" <<'EOF'
{
  "inbox": [],
  "payUrls": {},
  "sessions": [],
  "visitors": {},
  "geoCache": {},
  "subscribers": []
}
EOF
cat > "$DEST/ЗАПУСК.txt" <<EOF
Мэри Джут — выгрузка на хостинг
Домен: $SITE_URL

Это Node.js-сайт (не PHP). Обычная папка public_html на Apache/PHP не подойдёт.
Нужен тариф с Node.js 20+ (Timeweb, Beget, Selectel, VPS).

1. Распакуйте архив на сервере.
2. В панели хостинга укажите команду запуска:
     node server.js
   Рабочая папка — корень распакованного архива.
3. Порт возьмите из панели (часто переменная PORT). Хостинг сам подставит.
4. Привяжите домен mary-jute.ru (и www, если есть) к этому приложению.
5. Папка data/ должна быть доступна на запись — в ней хранятся заявки, рассылки и статистика.

Админка: $SITE_URL/admin
Логин: admin
Пароль: admin
После показа клиенту смените пароль в файле .env (ADMIN_PASSWORD и ADMIN_SECRET).

Почта на сайте: hello@mary-jute.ru
Все фото лежат в public/images и открываются как /images/...
Страницы, корзина и API относительные — работают на этом домене без правок кода.
EOF
chmod +x "$DEST/server.js" 2>/dev/null || true

mkdir -p "$OUT_DIR"
ZIP="$OUT_DIR/mary-jute.ru.zip"
rm -f "$ZIP"
(cd "$STAGE" && zip -qr "$ZIP" "$NAME")
echo "ZIP $ZIP ($(du -h "$ZIP" | awk '{print $1}'))"
echo "images $(find "$DEST/public/images" -type f | wc -l)"
