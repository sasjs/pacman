#!/usr/bin/env node
/**
 * Check what a release of this repository would publish.
 *
 * The release job uploads three files and tags whatever the commits say, so the
 * failure worth catching before main is not "the build crashed" - it is a build
 * that succeeded and produced the wrong thing: a pack with no app manifest, a
 * mock site with no deployment on its drive, a release asset naming a file
 * nothing wrote. Secrets are not needed for any of it, which is why a pull
 * request can run this.
 *
 * Run after `sasjs cb -t sas9`, `-t viya` and `-t server`, with the artefacts
 * copied out of sasjsbuild (each build clears the folder it writes).
 *
 * Usage: node scripts/check-artefacts.mjs   (or npm run check:artefacts)
 */
import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const failures = []
const notes = []

const fail = (message) => failures.push(message)
const note = (message) => notes.push(message)

const readJson = (relative) => {
  const full = path.join(root, relative)

  if (!existsSync(full)) {
    fail(`${relative} does not exist`)
    return undefined
  }

  try {
    return JSON.parse(readFileSync(full, 'utf8'))
  } catch (error) {
    fail(`${relative} is not valid JSON: ${error.message}`)
    return undefined
  }
}

const config = readJson('sasjs/sasjsconfig.json')

// 1. The release publishes what it says it publishes, and every path resolves.
const assets = config?.release?.assets ?? []

if (!assets.length) fail('sasjsconfig.json has no release.assets, so a release would attach nothing')

for (const asset of assets) {
  if (!asset.path) {
    fail('a release asset has no path')
    continue
  }

  const full = path.join(root, asset.path)

  if (!existsSync(full)) fail(`release asset ${asset.path} was not written`)
  else if (statSync(full).size === 0) fail(`release asset ${asset.path} is empty`)
  else note(`${asset.path} (${statSync(full).size} bytes)`)
}

// 2. The streamed app: where it lands, and that the deploy would index it.
const target = (config?.targets ?? []).find((t) => t.name === 'server')
const streamConfig = { ...(config?.streamConfig ?? {}), ...(target?.streamConfig ?? {}) }

const pack = readJson('sasjsbuild/server.json')

if (pack) {
  if (!pack.appLoc) fail('the server pack has no appLoc, so nothing says where it lands')
  if (!pack.streamWebFolder)
    fail('the server pack has no streamWebFolder, so the deploy would not publish an app')
  if (!pack.streamServiceName)
    fail('the server pack has no streamServiceName, so the app would have no label')

  if (target?.appLoc && pack.appLoc !== target.appLoc)
    fail(`the pack lands at ${pack.appLoc}, not the target's ${target.appLoc}`)

  if (streamConfig.streamServiceName && pack.streamServiceName !== streamConfig.streamServiceName)
    fail(
      `the pack labels the app "${pack.streamServiceName}", not "${streamConfig.streamServiceName}"`
    )

  const folder = (members, name) =>
    (members ?? []).find((m) => m.name === name && m.type === 'folder')

  const services = folder(pack.fileTree?.members, 'services')

  if (!services) fail('the pack has no services folder')
  else if (pack.streamWebFolder && !folder(services.members, pack.streamWebFolder))
    fail(
      `the pack has no services/${pack.streamWebFolder}, so a publish naming that folder would be refused`
    )
  else note(`pack: ${pack.appLoc}/services/${pack.streamWebFolder} on ${pack.streamServiceName}`)

  // The manifest is what makes one upload both the deployment and the publish.
  const manifest = (pack.fileTree?.members ?? []).find((m) => m.name === 'sasjs.app.json')

  if (!manifest) fail('the pack carries no sasjs.app.json, so a deploy would not publish the app')
  else {
    let stated
    try {
      stated = JSON.parse(manifest.code)
    } catch (error) {
      fail(`sasjs.app.json is not valid JSON: ${error.message}`)
    }

    if (stated && stated.streamWebFolder !== pack.streamWebFolder)
      fail(
        `sasjs.app.json names folder "${stated.streamWebFolder}" but the payload names "${pack.streamWebFolder}"`
      )
    if (stated && pack.streamServiceName && stated.name !== pack.streamServiceName)
      fail(`sasjs.app.json is labelled "${stated.name}", not "${pack.streamServiceName}"`)
  }
}

// 3. The mock site: the frontend at the root, the deployment on its drive.
const mockRoot = path.join(root, 'sasjsbuild/mock')

if (!existsSync(path.join(mockRoot, 'index.html')))
  fail('sasjsbuild/mock/index.html does not exist, so the site has no entry page')

const mockConfig = readJson('sasjsbuild/mock/host/mock-config.json')
const seed = readJson('sasjsbuild/mock/host/vfs-seed.json')

if (mockConfig && pack?.appLoc && mockConfig.appLoc !== pack.appLoc)
  fail(`the mock site seeds ${mockConfig.appLoc}, not the pack's ${pack.appLoc}`)

if (seed) {
  const prefix = `/sasjs/drive/files${pack?.appLoc ?? ''}/services/${pack?.streamWebFolder ?? ''}/`

  if (!Object.keys(seed.files ?? {}).some((key) => key.startsWith(prefix)))
    fail(`the mock drive holds nothing under ${prefix}, so its _FILE= reads would 404`)
  else
    note(
      `mock drive: ${Object.keys(seed.files).filter((k) => k.startsWith(prefix)).length} files under ${prefix}`
    )
}

for (const message of notes) console.log(`ok   ${message}`)

if (failures.length) {
  for (const message of failures) console.error(`FAIL ${message}`)
  console.error(`\n${failures.length} problem(s): a release from this commit would publish something broken.`)
  process.exit(1)
}

console.log('\nThe release would publish what it says it publishes.')
