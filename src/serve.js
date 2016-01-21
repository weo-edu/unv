/**
 * Imports
 */

import Assetify from './assetify'
import bundle from './bundle'
import route from 'koa-route'
import send from 'koa-send'
import path from 'path'
import koa from 'koa'

/**
 * Constants
 */

const defaultExts = ['png', 'gif', 'ico', 'svg', 'gif', 'jpg']

/**
 * Serve
 */

function serve ({exts = defaultExts, client, server}) {
  server = server ? path.resolve(process.cwd(), server) : './defaultIndex'

  /**
   * Constants
   */

  const app = koa()
  const urls = {
    js: '/bundle.js',
    assets: {}
  }
  const assetify = Assetify({exts, assets: urls.assets})
  const {js} = bundle({client, assetify, update: () => require(server).replace && require(server).replace()})
  assetify.node()

  /**
   * Server
   */

  app.use(function *(next) {
    if (this.url === urls.js) {
      this.type = 'text/javascript'
      this.body = yield js.value()
    } else {
      yield next
    }
  })

  app.use(function *(next) {
    if (this.url.startsWith('/assets/')) {
      if (urls.assets[this.url] || this.url) {
        const file = path.relative(process.cwd(), urls.assets[this.url])
        yield send(this, file, {root: process.cwd()})
      } else {
        this.status = 404
      }
    } else {
      yield next
    }
  })

  app.use(function *() {
    let render = require(server)
    render = 'function' === typeof render.default ? render.default : render
    this.body = yield render(this.req, urls)
  })

  /**
   * Listen
   */

  app.listen(3000, function () {
    console.log('Listening on port', 3000)
  })
}

/**
 * Exports
 */

export default serve
