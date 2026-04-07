#!/usr/bin/env bash

set -euo pipefail

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "pg_dump is required but not installed." >&2
  exit 1
fi

if ! command -v pg_restore >/dev/null 2>&1; then
  echo "pg_restore is required but not installed." >&2
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "psql is required but not installed." >&2
  exit 1
fi

SOURCE_DATABASE_URL="${SOURCE_DATABASE_URL:-}"
TARGET_DATABASE_URL="${NEON_DIRECT_URL:-${DIRECT_URL:-}}"

if [[ -z "$SOURCE_DATABASE_URL" ]]; then
  echo "Set SOURCE_DATABASE_URL to the current database connection string." >&2
  exit 1
fi

if [[ -z "$TARGET_DATABASE_URL" ]]; then
  echo "Set NEON_DIRECT_URL or DIRECT_URL to the Neon direct connection string." >&2
  exit 1
fi

if [[ "$SOURCE_DATABASE_URL" == "$TARGET_DATABASE_URL" ]]; then
  echo "Source and target database URLs are identical. Refusing to continue." >&2
  exit 1
fi

describe_url() {
  node -e 'const raw = process.argv[1]; try { const url = new URL(raw); console.log(`${url.hostname}${url.pathname}`); } catch { console.log("invalid-url"); process.exit(1); }' "$1"
}

SOURCE_DESC="$(describe_url "$SOURCE_DATABASE_URL")"
TARGET_DESC="$(describe_url "$TARGET_DATABASE_URL")"

TMP_DIR="$(mktemp -d /tmp/neon-migrate.XXXXXX)"
DUMP_FILE="$TMP_DIR/source.dump"

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT

echo "Dumping public schema from $SOURCE_DESC"
pg_dump \
  -Fc \
  -v \
  -d "$SOURCE_DATABASE_URL" \
  --schema=public \
  -f "$DUMP_FILE"

if [[ "${NEON_RESET_TARGET:-0}" == "1" ]]; then
  echo "Resetting target public schema on $TARGET_DESC"
  psql "$TARGET_DATABASE_URL" -v ON_ERROR_STOP=1 -c 'DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;'
fi

echo "Restoring dump into Neon on $TARGET_DESC"
pg_restore \
  -v \
  --no-owner \
  --no-acl \
  -d "$TARGET_DATABASE_URL" \
  "$DUMP_FILE"

echo "Migration finished."
echo "Next steps:"
echo "  1. Point DATABASE_URL at the Neon pooled connection string."
echo "  2. Keep DIRECT_URL pointed at the Neon direct connection string."
echo "  3. Run npx prisma generate if needed, then start the app."
