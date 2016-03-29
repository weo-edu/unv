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

function build ({client, server, entry, base = '/assets', assetsPath = './assets', handlerPath = './functions/index/main.js' }) {
  const assetStream = bundleClient(client, entry, base)
  const serverBundle = bundleServer(assetStream, server, entry, base)

  return co(function * () {
    let {assets} = yield stream.wait(assetStream)
    yield map(co.wrap(function * (asset, url) {
      let assetPath = path.join(assetsPath, path.basename(url))
      yield fs.writeFile(assetPath, asset.content)
      if (asset.stat.mtime) {
        yield fs.utimes(assetPath, asset.stat.atime, asset.stat.mtime)
      }
    }), assets)

    let server = yield stream.wait(serverBundle)
    yield fs.writeFile(handlerPath, server)
  }).catch(function (err) {
    console.error('Build error:')
    console.error(err.stack)
  })
}

export default build
