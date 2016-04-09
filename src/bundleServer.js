/**
 * Imports
 */

import stream from '@f/promise-stream'
import toPromise from '@f/thunk-to-promise'

import browserify from 'browserify'
import babelify from 'babelify'
import envify from 'envify/custom'
import brfs from 'brfs'
import watchify from 'watchify'

import assetify from './assetify'
import urify from './urify'

function bundle (assets, server, name = 'build.js', base = '/assets', watch = false) {
  const b = browserify({
    packageCache: {},
    cache: {},
    debug: true,
    transform: [babelify, assetify(getUrl), envify(), brfs],
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
    standalone: 'render',
    plugin: watch ? [watchify] : []
  })

  const rebuild = stream(true)

  b.on('update', function () {
    rebuild(true)
  })

  function getUrl(file, content) {
    return urify(base, file, content)
  }

  return stream.combine(({files}, rebuild) => {
    if (files[name]) {
      console.log('building server...')
      process.env['CLIENT_JS_BUILD'] = files[name].url
      return toPromise(b.bundle.bind(b))
    }
  }, [assets, rebuild])

}

export default bundle
