/**
 * Imports
 */

import path from 'path'
import farmhash from 'farmhash'
import isPromise from '@f/is-promise'
import isUndefined from '@f/is-undefined'

/**
 * Urify
 *
 * Convert a file and to a URL based
 * on the hash of its contents
 */

function urify (base, file, contents) {
  if (!isPromise(contents)) {
    if (isUndefined(contents)) {
      throw new Error('content buffer required')
    }

    console.log('file', file)
    const ext = path.extname(file)
    return path.join(base,
      path.basename(file).slice(0, -ext.length)
        + '-'
        + farmhash.hash64(contents) + ext)
  } else {
    return contents.then(c => urify(base, file, c))
  }
}

export default urify
