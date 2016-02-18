/**
 * Imports
 */

import pendingValue from '@f/pending-value'
import browserify from 'browserify'
import hmr from 'browserify-hmr'
import babelify from 'babelify'
import watchify from 'watchify'

/**
 * Bundler
 */

function bundle ({client, assetify, update}) {
  const js = pendingValue()
  const b = browserify({
    entries: client,
    packageCache: {},
    cache: {},
    debug: true,
    transform: [babelify, assetify.browser()],
    plugin: [[watchify, {delay: 0}], hmr]
  })

  b.on('update', bundle)
  setTimeout(bundle)
  js.pending()

  function bundle () {
    update()
    js.pending()
    b.bundle((err, str) => err ? console.log('browserify error:', err) : js.ready(str))
  }

  return {
    js
  }
}

/**
 * Exports
 */

export default bundle
