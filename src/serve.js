/**
 * Imports
 */

import koa from 'koa'

import stream from '@f/promise-stream'
import toPromise from '@f/to-promise'
import vm from 'vm'
import {extname, basename, resolve} from 'path'

import bundleClient from './bundleClient'
import bundleServer from './bundleServer'
import renderer from './renderer'

/**
 * Constants
 */

const ASSETS_BASE = '/assets/'
const ENTRY = 'weo.js'

/**
 * Serve
 */

function serve ({client, server, port = 3000, watch = false}) {
  /**
   * Constants
   */

  const app = koa()
  const assetStream = bundleClient(client, ENTRY, ASSETS_BASE, watch)
  const rendererStream = renderer(bundleServer(assetStream, server, ENTRY, ASSETS_BASE))

  /**
   * Server
   */

  app.use(function * (next) {
    let url = this.url
    if (url.startsWith(ASSETS_BASE)) {
      let {assets} = yield stream.wait(assetStream)
      let asset = assets[url]
      if (asset) {
        send(this, asset.content, asset.file, asset.stat)
      } else {
        notFound(this)
      }
    } else {
      yield next
    }
  })

  app.use(function * () {
    let {url, headers} = this
    let render = yield stream.wait(rendererStream)
    this.body = yield toPromise(render({url, headers}))
  })

  /**
   * Listen
   */

  return app.listen(port, function () {
    console.log('Listening on port', port)
  })
}

function send (ctx, content, path, stats) {
  if (!ctx.response.get('Last-Modified')) ctx.set('Last-Modified', stats.mtime.toUTCString())
  ctx.type = type(path);
  ctx.body = content
}

function notFound (ctx) {
  ctx.status = 404
}

function type(file) {
  return extname(basename(file, '.gz'))
}

/**
 * Exports
 */

export default serve
