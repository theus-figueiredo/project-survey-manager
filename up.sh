#!/usr/bin/env bash

set -euo pipefail

DB_SERVICE='eyf-db'
API_SERVICE='eyf-api'
MAX_ATTEMPTS=30
SLEEP_SECONDS=2

echo "Starting database container..."
docker compose up -d "$DB_SERVICE"

echo "Waiting for database healthcheck..."

attempt=1
while [ "$attempt" -le "$MAX_ATTEMPTS" ]; do
  status="$(docker compose ps --format json "$DB_SERVICE" | sed -n 's/.*"Health":"\([^"]*\)".*/\1/p')"

  if [ "$status" = 'healthy' ]; then
    echo 'Database is healthy.'
    break
  fi

  if [ "$attempt" -eq "$MAX_ATTEMPTS" ]; then
    echo 'Database did not become healthy in time.'
    exit 1
  fi

  echo "Database status: ${status:-starting}. Waiting..."
  sleep "$SLEEP_SECONDS"
  attempt=$((attempt + 1))
done

echo "Starting API container..."
docker compose up "$API_SERVICE"

echo 'Services started.'
