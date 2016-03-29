import stream from '@f/promise-stream'
import vm from 'vm'

function renderer (serverStream) {
  return stream.map(function (server) {
    var ctx = {}
    var res =  vm.runInContext(server, vm.createContext(ctx))
    return ctx.default
  }, serverStream)
}

export default renderer
