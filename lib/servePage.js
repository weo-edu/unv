/**
 * Imports
 */

const koa = require('koa')

const {join, resolve} = require('path')

module.exports = serve

function serve ({server, port = 3000, quiet = false}) {
  server = resolve(join(process.cwd(), server))
  require('babel-register')
  const render = require(server)

  const app = koa()

  app.use(function * () {
    const {path, headers} = this
    this.body = yield render({url: path, headers})
  })

  return app.listen(port, () => !quiet && console.log(`Page server istening on port: ${port}`))
}
