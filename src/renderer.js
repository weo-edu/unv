/**
 * Imports
 */

import requireContent from '@f/require-content'
import stream from '@f/promise-stream'
import {get} from 'source-map-stack'
import vm from 'vm'

/**
 * Renderer
 */

function renderer (serverStream) {
  return stream.map(server => ({
    render: getExport(requireContent(server)),
    sourceMap: lazySm(server)
  }), serverStream)
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
  return exp.default
    ? exp.default
    : exp
}

/**
 * Exports
 */

export default renderer
