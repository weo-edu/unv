/**
 * Imports
 */

const stream = require('@f/promise-stream')
const toPromise = require('@f/to-promise')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const map = require('@f/map')
const path = require('path')
const fs = require('mz/fs')
const co = require('co')

const bundleClient = require('./bundleClient')

const BUILD_PATH = process.env.BUILD_PATH || join(process.cwd(), 'build.js')

/**
 * Exports
 */

module.exports = build


/**
 * Build
 */

function build ({client, server, name, base, dir = './assets'}) {
  // Setup directories and clean
  prepare(dir)
  server = path.resolve(path.join(process.cwd(), server))
  require('babel-register')
  
  // Start the bundle streams
  const buildStream = bundleClient(client, name)

  return co(function * () {
    const content = yield stream.wait(buildStream)
    yield fs.writeFile(BUILD_PATH, content)
    require(server)
  }).catch(err => {
    console.error('Build error:')
    console.error(err.stack)
  })
}

function prepare (assetDir) {
  // Make directories
  mkdirp.sync(assetDir)

  // Clean
  rimraf.sync(path.join(assetDir, '*'))
}
