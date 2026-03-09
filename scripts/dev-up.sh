#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT_DIR/infra/compose"
docker compose --env-file "$ROOT_DIR/.env" up --build
