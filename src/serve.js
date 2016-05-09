/**
 * Imports
 */

import koa from 'koa'
import koaError from 'koa-error'

import stream from '@f/promise-stream'
import toPromise from '@f/to-promise'
import logError from '@f/log-error'
import {stack} from 'source-map-stack'
import {extname, basename, resolve, dirname} from 'path'

import bundleClient from './bundleClient'
import bundleServer from './bundleServer'
import renderer from './renderer'

/**
 * Serve
 */

function serve ({client, server, name, base='/assets', port = 3000, watch = false}) {
  /**
   * Constants
   */

  const app = koa()
  const assetStream = bundleClient(client, name, base, watch)
  const rendererStream = renderer(bundleServer(assetStream, server, name, base, watch))

  app.onerror = logError

  app.use(koaError())

  /**
   * Server
   */

  app.use(function * (next) {
    const {render, sourceMap} = yield stream.wait(rendererStream)
    const {assets} = yield stream.wait(assetStream)

    this.assets = assets
    this.render = render
    this.sourceMap = sourceMap

    yield next
  })

  app.use(function * (next) {
    const {url, assets} = this
    if (url.startsWith(base)) {
      const asset = assets[url]

      if (asset) {
        send(this, asset.content, asset.file, asset.stat)
      } else {
        notFound(this)
      }
    } else {
      yield next
    }
  })

  let sourceMap
  app.use(function * () {
    const {url, headers, render} = this
    sourceMap = this.sourceMap

    try {
      this.body = yield toPromise(render({url, headers}))
    } catch(e) {
      handleError(e)
      throw e
    }
  })

  process.on('uncaughtException', handleError)
  process.on('unhandledRejection', handleError)

  function handleError (e) {
    if (e.stack.toString().indexOf('evalmachine') !== -1) {
      e.stack = stack(sourceMap(), e, process.cwd())
    }

    logError(e)
  }

  /**
   * Listen
   */

  return app.listen(port, () => console.log('Listening on port:', port))
}

/**
 * Helpers
 */

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
