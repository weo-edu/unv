/**
 * Imports
 */

const koa = require('koa')
const koaError = require('koa-error')
const mount = require('koa-mount')
const statics = require('koa-static')
const {join, resolve, relative} = require('path')


module.exports = serve

function serve (server, assetsDir) {
  require('babel-register')

  const serverPath = resolve(join(process.cwd(), server))
  const assetsUrl = `/${relative(process.cwd(), assetsDir)}`

  const render = require(serverPath)

  const app = koa()

  app.use(koaError())

  app.use(mount(assetsUrl, statics(assetsDir)))

  app.use(function * () {
    const {url, headers} = this
    this.body = yield render({url, headers})
  })

  return app
}
