/**
 * Imports
 */

import pendingValue from '@f/pending-value'
import concat from 'concat-stream'
import browserify from 'browserify'
import hmr from 'browserify-hmr'
import babelify from 'babelify'
import watchify from 'watchify'
import errorify from 'errorify'
import assetify from 'assetify'

/**
 * Bundler
 */

function bundle ({client, assetify}) {
  const js = pendingValue()
  const b = browserify({
    entries: client,
    packageCache: {},
    cache: {},
    debug: true,
    transform: [babelify, assetify.browser()],
    plugin: [[watchify, {delay: 0}], hmr, errorify]
  })

  b.on('update', bundle)
  setTimeout(bundle)
  js.pending()

  function bundle () {
    require(server).replace && require(server).replace()
    js.pending()
    b.bundle()
      .pipe(concat(function (str) { js.ready(str) }))
  }

  return {
    js
  }
}

/**
 * Exports
 */

export default bundle
