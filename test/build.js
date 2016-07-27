/**
 * Imports
 */

const test = require('tape')
const unv = require('..')
const co = require('co')
const fs = require('mz/fs')
const cheerio = require('cheerio')
const rimraf = require('rimraf')
const path = require('path')
const logError = require('@f/log-error')
const cloudFS = require('cloud-fs')
cloudFS.setAssetsDir(`${__dirname}/assets`)

/**
 * Tests
 */

test('should build assets', co.wrap(function * (t) {

  yield unv.build({
    client: './test/app/client.js',
    server: './test/app/server.js',
    outFile: './test/app/scripts/build.js',
    assetsDir: './test/assets',
    transforms: ['br-cloud-fs']
  })

  t.ok(yield fs.exists(path.join('./test', 'app/scripts/build.js')))
  t.ok(yield fs.exists(path.join('./test', cloudFS.url('./app/scripts/build.js'))))
  t.ok(yield fs.exists(path.join('./test', cloudFS.url('./app/elliot.jpg'))))

  //rimraf.sync('test/assets')
  //rimraf.sync('test/app/scripts')
  t.end()

}))

process.on('unhandledRejection', logError)
