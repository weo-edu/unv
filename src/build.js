/**
 * Imports
 */

import stream from '@f/promise-stream'
import toPromise from '@f/to-promise'
import rimraf from 'rimraf'
import mkdirp from 'mkdirp'
import map from '@f/map'
import path from 'path'
import fs from 'mz/fs'
import co from 'co'

import bundleClient from './bundleClient'
import bundleServer from './bundleServer'

/**
 * Build
 */

function build ({client, server, name, base, dir = './assets', handler = './serve.js' }) {
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

    const server = yield stream.wait(serverBundle)
    yield fs.writeFile(handler, server)
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

/**
 * Exports
 */

export default build
