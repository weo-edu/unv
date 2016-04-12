/**
 * Imports
 */

import stream from '@f/promise-stream'
import toPromise from '@f/thunk-to-promise'
import elapsed from '@f/elapsed-time'

import browserify from 'browserify'
import envify from 'envify/custom'
import rollupify from 'rollupify'
import uglifyify from 'uglifyify'
import watchify from 'watchify'
import babelify from 'babelify'
import brfs from 'brfs'

import assetify from './assetify'
import urify from './urify'

/**
 * Server bundler
 */

function bundle (assets, server, name = 'build.js', base = '/assets', watch = false) {
  const plugin = []
  const transform = [babelify, assetify(getUrl), envify(), brfs]

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
    plugin.push(watchify)
  }

  const b = browserify({
    packageCache: {},
    cache: {},
    debug: watch,
    transform,
    plugin,
    bare: true,
    browserField: false,
    builtins: false,
    commondir: false,
    insertGlobalVars: {
      __filename: undefined,
      __dirname: undefined,
      process: function () {}
    },
    entries: server,
    standalone: 'render'
  })

  function getUrl (file, content) {
    return urify(base, file, content)
  }

  return stream.map(({files}) => {
    if (files[name]) {
      process.env['CLIENT_JS_BUILD'] = files[name].url
      const time = elapsed()
      return toPromise(b.bundle.bind(b)).then(content => {
        console.log(`bundled server (${time()}ms)`)
        return content
      })
    }
  }, assets)
}

/**
 * Exports
 */

export default bundle
