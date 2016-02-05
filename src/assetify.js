/**
 * Imports
 */

import through from 'through2'
import path from 'path'
import sha from 'sha1'
import fs from 'fs'

/**
 * Assetify
 */

function assetify ({assets, exts, base = '/assets/'}) {
  const extRe = new RegExp('\\.(?:' + exts.join('|') + ')$')

  return {
    browser () {
      return file => extRe.test(file)
        ? transform(file)
        : through()
    },
    node () {
      // hook require
      exts.forEach(ext => require.extensions['.' + ext] = handleExt(ext))
    }
  }

  function handleExt (ext) {
    return (module, file) => {
      return urify(fs.readFileSync(file), file)
    }
  }

  function transform (file) {
    const buffers = []
    return through(
      (buf, enc, cb) => {
        buffers.push(buf)
        cb()
      },
      function (cb) {
        this.push(urify(Buffer.concat(buffers), file))
        cb()
      }
    )
  }

  function urify (contents, file) {
    const hashed = sha(contents) + path.extname(file)
    const url = path.join(base, hashed)
    assets[url] = file

    return `module.exports = "${url}"`
  }
}

/**
 * Exports
 */

export default assetify
