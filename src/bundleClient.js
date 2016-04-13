/**
 * Imports
 */

import toPromise from '@f/thunk-to-promise'

import browserify from 'browserify'
import envify from 'envify/custom'
import rollupify from 'rollupify'
import uglifyify from 'uglifyify'
import hmr from 'browserify-hmr'
import babelify from 'babelify'
import watchify from 'watchify'

import assetStream from './assets'
import assetify from './assetify'

/**
 * Client bundler
 */

function bundle (client, name = 'build.js', base = '/assets', watch = false) {
  const {addFile, assets} = assetStream(base)
  const plugin = []
  const transform = [
    babelify,
    assetify(addFile),
    envify()
  ]

  if (!watch) {
    // transform.unshift(rollupify)
    transform.push([uglifyify, {
      sourcemap: false,
      global: true,
      mangle: {
        toplevel: true,
        screw_ie8: true
      }
    }])
  } else {
    plugin.push([watchify, {delay: 0}])
    plugin.push(hmr)
  }

  const b = browserify({
    entries: client,
    packageCache: {},
    cache: {},
    debug: watch,
    transform,
    plugin
  })

  b.on('update', bundle)
  bundle()

  return assets

  function bundle () {
    console.time('bundled client')
    const clientBuild = toPromise(b.bundle.bind(b)).then(content => {
      console.timeEnd('bundled client')
      return content
    })
    addFile(name, clientBuild, false)
  }
}

/**
 * Exports
 */

export default bundle
