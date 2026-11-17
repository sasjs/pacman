#!/usr/bin/env bash
# Build the three artefacts a release publishes.
#
# `sasjs cb` clears the folder it writes before it writes, so each file is
# copied out before the next target builds over it. The server target runs
# last: it also builds the mock site, and scripts/check-artefacts.mjs reads the
# pack it leaves in sasjsbuild/.
#
# Run by both the pull-request check and the release, so the bytes a release
# uploads are the bytes a pull request built.
set -euo pipefail

mkdir -p artefacts

for target in sas9 viya; do
  echo "::group::sasjs cb -t ${target}"
  npx sasjs cb -t "${target}"
  cp "./sasjsbuild/${target}.sas" "./artefacts/${target}.sas"
  test -s "./artefacts/${target}.sas"
  echo "::endgroup::"
done

echo "::group::sasjs cb -t server"
npx sasjs cb -t server
cp ./sasjsbuild/server.json.zip ./artefacts/server.json.zip
test -s ./artefacts/server.json.zip
echo "::endgroup::"

ls -l artefacts
