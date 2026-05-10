#!/usr/bin/env bash

set -euo pipefail

docker compose exec eyf-api corepack yarn seed
