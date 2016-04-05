import stream from '@f/promise-stream'
import vm from 'vm'
import requireContent from '@f/require-content'
import sourceMap from 'source-map-stack'

function renderer (serverStream) {
  return stream.map(function (server) {
    var render =  requireContent(server)
    var map = sourceMap.get(server)
    return {render, map}
  }, serverStream)
}

export default renderer
