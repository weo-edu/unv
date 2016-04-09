/**
 * Imports
 */

import toPromise from '@f/thunk-to-promise'
import elapsed from '@f/elapsed-time'

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

function bundle (client, name = 'build.js', base = '/assets', watch = false) {
  const {addFile, assets} = assetStream(base)
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
    var time = elapsed()
    var clientBuild = toPromise(b.bundle.bind(b)).then(function (content) {
      console.log(`bundled client (${time()}ms)`)
      return content
    })
    addFile(name, clientBuild, false)
  }
}

/**
 * Exports
 */

export default bundle
