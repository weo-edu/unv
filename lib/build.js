/**
 * Imports
 */

const {join, resolve, dirname} = require('path')
const stream = require('@f/promise-stream')
const toPromise = require('@f/to-promise')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const fs = require('mz/fs')
const co = require('co')

const bundleClient = require('./bundleClient')

/**
 * Exports
 */

module.exports = build

/**
 * Build
 */

function build ({client, server, outFile, assetsDir, transforms, production}) {
  // Setup directories and clean
  server = resolve(join(process.cwd(), server))

  rimraf.sync(assetsDir)
  mkdirp.sync(assetsDir)
  mkdirp.sync(dirname(outFile))

  // Start the bundle streams
  const buildStream = bundleClient(client, {transforms, production})

  return co(function * () {
    const content = yield stream.wait(buildStream)

    yield fs.writeFile(outFile, content)
    let render = require(server)
    render = render.default ? render.default : render
    const html = yield render({url: '/', headers: {}})
    yield fs.writeFile('index.html', html, 'utf8')
  }).catch(err => {
    console.error('Build error:')
    console.error(err.stack)
  })
}
