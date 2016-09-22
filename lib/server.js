/**
 * Imports
 */

const koa = require('koa')
const mount = require('koa-mount')
const koaError = require('koa-error')
const statics = require('koa-static')
const compress = require('koa-compress')
const {join, resolve, relative} = require('path')

module.exports = serve

function serve ({server, assetsDir}) {
  const serverPath = resolve(join(process.cwd(), server))
  const assetsUrl = `/${relative(process.cwd(), assetsDir)}`

  let render = require(serverPath)
  render = render.default ? render.default : render

  const app = koa()

  app.use(koaError())
  app.use(compress())

  app.use(mount(assetsUrl, statics(assetsDir, {
    // Max expiration, since we're using hashes to serve the files,
    // we can cache really hard
    maxage: 60*60*24*365*1000
  })))

  app.use(function * () {
    const {url, headers} = this
    this.body = yield render({url, headers})
  })

  return app
}
