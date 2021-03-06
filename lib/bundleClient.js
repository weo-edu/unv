/**
 * Imports
 */

const toPromise = require('@f/thunk-to-promise')
const debounce = require('@f/debounce')
require('cached-path-relative/shim')

const collapser = require('bundle-collapser/plugin')
const browserify = require('browserify')
const envify = require('envify/custom')
const uglifyify = require('uglifyify')
const hmr = require('browserify-hmr')
const babelify = require('babelify')
const watchify = require('watchify')

const stream = require('@f/promise-stream')
const cwd = process.cwd()

/**
 * Exports
 */

module.exports = bundle

/**
 * Client bundler
 */

function bundle (client, {watch = false, transforms = [], production}, onBundle) {
  const plugin = []
  const buildStream = stream()
  const transform = [
    babelify,
    [envify(), {global: true}]
  ].concat(transforms)

  if (watch) {
    // Use our own debounce for watchify
    plugin.push([watchify, {delay: 0}])
    plugin.push(hmr)
  }

  if (production) {
    plugin.push(collapser)
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
    debug: !production,
    transform,
    plugin
  })

  const debouncedBundle = debounce(bundle, 300)

  let updating = false
  b.on('update', rows => {
    shouldDebounce(rows)
      ? debouncedBundle()
      : bundle()
  })

  bundle()

  return buildStream

  function bundle () {
    if (updating) return debouncedBundle()
    onBundle && onBundle()
    updating = true
    console.time('bundled client')
    const clientBuild = toPromise(b.bundle.bind(b)).then(content => {
      console.timeEnd('bundled client')
      setTimeout(() => updating = false, 500)
      return content
    }, err => {
      updating = false
      throw err
    })
    buildStream(clientBuild)
  }

  function shouldDebounce (rows) {
    // We want to debounce rebundles if we are receiving
    // an update from a node_module, because if that happens
    // we are likely to get a batch of spread out file writes
    // and we don't want to accidentally bundle twice
    return rows.some(row =>
      row.indexOf(cwd) === -1
        || row.indexOf('node_modules') !== -1)
  }
}
