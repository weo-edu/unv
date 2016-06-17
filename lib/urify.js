/**
 * Imports
 */

const path = require('path')
const farmhash = require('farmhash')
const isPromise = require('@f/is-promise')
const isUndefined = require('@f/is-undefined')

/**
 * Exports
 */

module.exports = urify

/**
 * Urify
 *
 * Convert a file and to a URL based
 * on the hash of its contents
 */

function urify (base, file, contents) {
  if (base[base.length - 1] !== '/')
    base = base + '/'
  if (!isPromise(contents)) {
    if (isUndefined(contents)) {
      throw new Error('content buffer required')
    }

    const ext = path.extname(file)
    return base
      + path.basename(file).slice(0, -ext.length)
      + '-'
      + farmhash.hash64(contents) + ext
  } else {
    return contents.then(c => urify(base, file, c))
  }
}
