/**
 * Imports
 */

import koa from 'koa'

import {join} from 'path'
import fs from 'fs'
import {wrappedRequire} from './renderer'

const DEFAULT_HANDLER = join(process.cwd(), 'serve.js')

function serve ({port = 8080, handler = DEFAULT_HANDLER}) {

  const serveFile = fs.readFileSync(handler)
  const render = wrappedRequire(serveFile)

  const app = koa()

  app.use(function * () {
    const {path, headers} = this
    this.body = yield render({url: path, headers})
  })

  return app.listen(port, () => console.log('Listening on port:', port))
}

export default serve
