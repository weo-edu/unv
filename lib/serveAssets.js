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

function serve ({port = 3001, quiet = false}) {
  var app = koa()
  app.use(static('./'))
  return app.listen(port, () => !quiet && console.log(`Assets server listening on port: ${port}`))
}
