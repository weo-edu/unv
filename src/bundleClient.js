/**
 * Imports
 */

import toPromise from '@f/thunk-to-promise'
import 'cached-path-relative/shim'

import browserify from 'browserify'
import envify from 'envify/custom'
import rollupify from 'rollupify'
import uglifyify from 'uglifyify'
import hmr from 'browserify-hmr'
import babelify from 'babelify'
import watchify from 'watchify'

import assetStream from './assets'
import assetify from './assetify'

const PRODUCTION = process.env.NODE_ENV === 'production'

/**
 * Client bundler
 */

function bundle (client, name = 'build.js', base = '/assets', watch = false) {
  const {addFile, assets} = assetStream(base)
  const plugin = []
  const transform = [
    babelify,
    assetify(addFile),
    [envify(), {global: true}]
  ]

  if (watch) {
    plugin.push([watchify, {delay: 0}])
    plugin.push(hmr)
  }

  if (PRODUCTION) {
    transform.push([uglifyify, {
      sourcemap: false,
      global: true,
      mangle: {
        toplevel: true,
        screw_ie8: true
      }
    }])
  }


  const b = browserify({
    entries: client,
    packageCache: {},
    cache: {},
    debug: !PRODUCTION,
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
