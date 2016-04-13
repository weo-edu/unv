/**
 * Imports
 */

import toPromise from '@f/thunk-to-promise'
import escapeRegex from 'escape-regexp'
import stream from '@f/promise-stream'
import 'cached-path-relative/shim'

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


  // XXX: This firstUrl thing is kind of a hack. Since envify doesn't
  // invalidate watchify's cache when an environment variable changes,
  // we just do a string replace on the path, which is a hash so it
  // ought to be unique.
  //
  // Note: `firstUrl` is not the most recently built URL, it is the first
  // one ever built, because envify never updates.
  let firstUrl = null
  return stream.map(({files}) => {
    if (files[name]) {
      process.env['CLIENT_JS_BUILD'] = files[name].url

      console.time('bundled server')
      return toPromise(b.bundle.bind(b)).then(content => {
        content = content.toString('utf8')

        if (firstUrl) {
          const re = new RegExp(escapeRegex(firstUrl), 'g')
          content = content.replace(re, files[name].url)
        } else {
          firstUrl = files[name].url
        }

        console.timeEnd('bundled server')
        return content
      })
    }
  }, assets)
}

/**
 * Exports
 */

export default bundle
