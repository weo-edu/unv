/**
 * Imports
 */

const stream = require('@f/promise-stream')
const toPromise = require('@f/to-promise')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const {join, resolve, dirname} = require('path')
const fs = require('mz/fs')
const co = require('co')

const bundleClient = require('./bundleClient')

/**
 * Exports
 */

module.exports = build

/**
 * Build
 */

function build ({client, server, outFile, assetsDir, transforms}) {
  // Setup directories and clean
  server = resolve(join(process.cwd(), server))
  require('babel-register')

  rimraf.sync(assetsDir)
  mkdirp.sync(assetsDir)
  mkdirp.sync(dirname(outFile))

  // Start the bundle streams
  const buildStream = bundleClient(client, {transforms})

  return co(function * () {
    const content = yield stream.wait(buildStream)

    yield fs.writeFile(outFile, content)
    require(server)
  }).catch(err => {
    console.error('Build error:')
    console.error(err.stack)
  })
}
