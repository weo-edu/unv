/**
 * Imports
 */

import toPromise from '@f/thunk-to-promise'

import browserify from 'browserify'
import hmr from 'browserify-hmr'
import envify from 'envify/custom'
import babelify from 'babelify'
import watchify from 'watchify'
import path from 'path'

import assetStream from './assets'
import assetify from './assetify'


/**
 * Bundler
 */

function bundle (client, entry, base = '/assets', watch=false) {
  let {addFile, assets} = assetStream(base)
  const b = browserify({
    entries: client,
    packageCache: {},
    cache: {},
    debug: true,
    transform: [babelify, assetify(addFile), envify()],
    plugin: watch ? [[watchify, {delay: 0}], hmr] : []
  })

  b.on('update', bundle)

  bundle()

  return assets

  function bundle () {
    addFile(entry, toPromise(b.bundle.bind(b)), false)
  }
}

/**
 * Exports
 */

export default bundle
