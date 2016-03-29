/**
 * Imports
 */

import through from 'through2'
import urify from './urify'

const defaultExts = ['png', 'gif', 'ico', 'svg', 'gif', 'jpg']

/**
 * Assetify
 */

function assetify (onAsset, exts = defaultExts) {
  const extRe = new RegExp('\\.(?:' + exts.join('|') + ')$')

  return file => extRe.test(file)
    ? transform(file)
    : through()

  function transform (file) {
    const buffers = []
    return through(
      (buf, enc, cb) => {
        buffers.push(buf)
        cb()
      },
      function (cb) {
        let url = onAsset(file, Buffer.concat(buffers))
        this.push(`module.exports = "${url}"`)
        cb()
      }
    )
  }


}

/**
 * Exports
 */

export default assetify
