/**
 * Imports
 */

const stream = require('@f/promise-stream')
const toPromise = require('@f/to-promise')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const map = require('@f/map')
const path = require('path')
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

function build ({client, name, base, dir = './assets', handler = './serve.js' }) {
  // Setup directories and clean
  prepare(dir, path.dirname(handler))

  // Start the bundle streams
  const assetStream = bundleClient(client, name, base)
  const serverBundle = bundleServer(assetStream, server, name, base)

  return co(function * () {
    const {assets} = yield stream.wait(assetStream)
    yield map(co.wrap(function * (asset, url) {
      const assetPath = path.join(dir, path.basename(url))
      yield fs.writeFile(assetPath, asset.content)
      if (asset.stat.mtime) {
        yield fs.utimes(assetPath, asset.stat.atime, asset.stat.mtime)
      }
    }), assets)
  }).catch(err => {
    console.error('Build error:')
    console.error(err.stack)
  })
}

function prepare (assetDir, handlerDir) {
  // Make directories
  mkdirp.sync(assetDir)
  mkdirp.sync(handlerDir)

  // Clean
  rimraf.sync(path.join(assetDir, '*'))
}
