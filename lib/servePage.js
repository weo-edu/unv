/**
 * Imports
 */

const koa = require('koa')

const {join, resolve} = require('path')
const fs = require('fs')

module.exports = serve

function serve ({server, port = 3000}) {
  server = resolve(join(process.cwd(), server))
  require('babel-register')
  const render = require(server)

  const app = koa()

  app.use(function * () {
    const {path, headers} = this
    this.body = yield render({url: path, headers})
  })

  return app.listen(port, () => console.log('Listening on port:', port))
}
