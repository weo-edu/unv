/**
 * Imports
 */

const koa = require('koa')
const koaError = require('koa-error')

const stream = require('@f/promise-stream')
const toPromise = require('@f/to-promise')
const logError = require('@f/log-error')
const {stack} = require('source-map-stack')
const {extname, basename, resolve, dirname, join} = require('path')

const bundleClient = require('./bundleClient')

/**
 * Exports
 */

module.exports = serve


/**
 * Serve
 */

function serve ({client, name, port = 3001, watch = false}) {
  const base = `localhost:${port}`
  const assetStream = bundleClient(client, name, base, watch)

  /**
   * Constants
   */

  const app = koa()

  app.use(koaError())

  /**
   * Server
   */

  app.use(function * (next) {
    const {assets} = yield stream.wait(assetStream)
    const {path} = this
    const asset = assets[join(base, path)]

    if (asset) {
      send(this, asset.content, asset.file, asset.stat)
    } else {
      notFound(this)
    }
  })

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
  ctx.set('Cache-Control', 'max-age=2592000')
  ctx.type = type(path)
  ctx.body = content
}

function notFound (ctx) {
  ctx.status = 404
}

function type(file) {
  return extname(basename(file, '.gz'))
}
