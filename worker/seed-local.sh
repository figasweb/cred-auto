#!/bin/bash
# Populate local KV for development
# Run: bash seed-local.sh

echo "Generating data..."
npx tsx src/seed.ts > data.json

echo "Seeding local KV..."
npx wrangler kv key put --local --binding DATA_KV "instituicoes" --path data.json

echo "Seeding metadata..."
echo '{"lastUpdate":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' | npx wrangler kv key put --local --binding DATA_KV "instituicoes:meta" --stdin

echo "Done! Run 'npx wrangler dev' to start the worker."
