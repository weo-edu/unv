/**
 * Imports
 */

const koa = require('koa')
const static = require('koa-static')

/**
 * Exports
 */

module.exports = serve

/**
 * Serve
 */

function serve ({dir='./assets', port = 3001}) {
  var app = koa()
  app.use(static(dir))
  return app.listen(port, () => console.log(`Assets server listening on port: ${port}`))
}
