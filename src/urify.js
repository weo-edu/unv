/**
 * Imports
 */

import sha from 'sha1'
import path from 'path'
import isPromise from '@f/is-promise'
import isUndefined from '@f/is-undefined'

function urify (base, file, contents) {
  if (!isPromise(contents)) {
    if (isUndefined(contents)) {
      throw new Error('content buffer required')
    }
    const ext = path.extname(file)
    return path.join(base, path.basename(file).slice(0, -ext.length) + '-' + sha(contents) + ext)
  } else {
    return contents.then(function (c) {
      return urify(base, file, c)
    })
  }

}

export default urify
