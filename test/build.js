/**
 * Imports
 */

import test from 'tape'
import unv from '..'
import co from 'co'
import fs from 'mz/fs'
import cheerio from 'cheerio'
import rimraf from 'rimraf'
import path from 'path'
import logError from '@f/log-error'
import cloudFS from 'cloud-fs'

/**
 * Tests
 */

test('should build assets', co.wrap(function * (t) {
  yield unv.build({
    client: './test/app/client.js',
    server: './test/app/server.js',
    outFile: './test/app/scripts/build.js',
    assetsDir: './test/assets'
  })

  t.ok(yield fs.exists(path.join('./test', 'app/scripts/build.js')))
  t.ok(yield fs.exists(path.join('./test', cloudFS.url('./app/scripts/build.js'))))
  t.ok(yield fs.exists(path.join('./test', cloudFS.url('./app/elliot.jpg'))))

  rimraf.sync('test/assets')
  rimraf.sync('test/app/scripts')
  t.end()

}))

process.on('unhandledRejection', logError)
