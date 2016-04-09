import stream from '@f/promise-stream'
import vm from 'vm'
import requireContent from '@f/require-content'
import {get} from 'source-map-stack'

function renderer (serverStream) {
  return stream.map(server => ({
    render: requireContent(server),
    sourceMap: get(server)
  }), serverStream)
}

export default renderer
