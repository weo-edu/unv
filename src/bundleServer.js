/**
 * Imports
 */

import stream from '@f/promise-stream'
import toPromise from '@f/thunk-to-promise'

import browserify from 'browserify'
import babelify from 'babelify'
import envify from 'envify/custom'
import brfs from 'brfs'

import assetify from './assetify'
import urify from './urify'

require('source-map-support').install()

function bundle (assets, server, entry, base = '/assets') {
  const b = browserify({
    packageCache: {},
    cache: {},
    debug: true,
    transform: [babelify, assetify(getUrl), envify(), brfs],
    node: true,
    entries: server,
    standalone: 'render'
  })

  function getUrl(file, content) {
    return urify(base, file, content)
  }

  return stream.map(function ({files}) {
    if (files[entry]) {
      process.env['JS_ENTRY'] = files[entry].url
      return toPromise(b.bundle.bind(b))
    }
  }, assets)

}

export default bundle
