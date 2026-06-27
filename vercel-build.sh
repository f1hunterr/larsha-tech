#!/bin/sh
set -e

echo "CWD: $(pwd)"

# Build from the package directory
cd artifacts/larsha-tech
pnpm run build
echo "Vite build done. dist/public contents:"
ls dist/public/

# Copy output to repo-root /public so Vercel can find it
cd ../..
rm -rf public
cp -r artifacts/larsha-tech/dist/public public
echo "Copied to public/. Contents:"
ls public/
