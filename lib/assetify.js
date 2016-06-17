/**
 * Imports
 */

const through = require('through2')
const urify = require('./urify')
const fs = require('fs')

/**
 * Exports
 */

module.exports = assetify

/**
 * Constants
 */

const defaultExts = ['png', 'gif', 'ico', 'svg', 'gif', 'jpg', 'woff', 'woff2', 'jpeg', 'jpeg2', 'eot', 'ttf']

/**
 * Assetify
 */

function assetify (onAsset, exts = defaultExts) {
  const extRe = new RegExp('\\.(?:' + exts.join('|') + ')$')

  return file => extRe.test(file)
    ? transform(file)
    : through()

  function transform (file) {
    return through(
      (buf, enc, cb) => {
        cb()
      },
      function (cb) {
        fs.readFile(file, (err, content) => {
          if (err) return cb(err)

          const url = onAsset(file, content)
          this.push(`module.exports = "${url}"`)
          cb()
        })
      }
    )
  }
}
