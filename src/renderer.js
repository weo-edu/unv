/**
 * Imports
 */

import requireContent from '@f/require-content'
import {get, stack} from 'source-map-stack'
import stream from '@f/promise-stream'
import vm from 'vm'
import toPromise from '@f/to-promise'

/**
 * Renderer
 */

function renderer (serverStream) {
  return stream.map(server => ({
    render: importRenderer(server),
    sourceMap: lazySm(server)
  }), serverStream)
}

/**
 * importRenderer
 *
 * Import the server renderer and wrap it in a
 * source mapped error handler to make sure
 * we log correctly for any errors on startup
 */

function importRenderer (server, sm) {
  try {
    return getExport(requireContent(server))
  } catch (e) {
    e.stack = stack(sm || get(server), e, process.cwd())
    throw e
  }
}

/**
 * Run render
 *
 * Run the render function
 */

function wrappedRequire (content) {
  let sm = get(content)
  let render = importRenderer(content, sm)
  return (evt) => {
    return toPromise(render(evt)).catch(e => {
      e.stack = stack(sm, e, process.cwd())
      throw e
    })
  }
}


/**
 * lazySm
 *
 * Avoid computing the source maps before we really
 * have to (saves on rebuild time)
 */

function lazySm (server) {
  let cache = null
  return () => cache = (cache ? cache : get(server))
}

/**
 * getExport
 *
 * Handle ES6 exports
 */

function getExport (exp) {
  return exp && exp.default
    ? exp.default
    : exp
}

/**
 * Exports
 */

export default renderer
export {
  wrappedRequire
}
