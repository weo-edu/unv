/**
 * Imports
 */

import stream from '@f/promise-stream'
import map from '@f/map'
import toPromise from '@f/to-promise'
import fs from 'mz/fs'
import path from 'path'
import co from 'co'

import bundleClient from './bundleClient'
import bundleServer from './bundleServer'

function build ({client, server, name, base, dir = './assets', handler = './functions/index/index.js' }) {
  const assetStream = bundleClient(client, name, base)
  const serverBundle = bundleServer(assetStream, server, name, base)

  return co(function * () {
    let {assets} = yield stream.wait(assetStream)
    yield map(co.wrap(function * (asset, url) {
      let assetPath = path.join(dir, path.basename(url))
      yield fs.writeFile(assetPath, asset.content)
      if (asset.stat.mtime) {
        yield fs.utimes(assetPath, asset.stat.atime, asset.stat.mtime)
      }
    }), assets)

    const server = yield stream.wait(serverBundle)
    yield fs.writeFile(handler, server)
  }).catch(function (err) {
    console.error('Build error:')
    console.error(err.stack)
  })
}

export default build
