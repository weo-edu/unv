/**
 * Imports
 */

import test from 'tape'
import unv from '../src'
import mkdirp from 'mkdirp'
import co from 'co'
import fs from 'mz/fs'
import cheerio from 'cheerio'
import rimraf from 'rimraf'
import path from 'path'

/**
 * Tests
 */

var assets = require('./assets.json')

test('should build assets', co.wrap(function * (t) {
  mkdirp.sync('test/assets')
  yield unv.build({
    client: './test/app/client.js',
    server: './test/app/server.js',
    entry: 'weo.js',
    assetsPath: './test/assets',
    handlerPath: './test/assets/index.js'
  })

  t.ok(yield fs.exists(path.join('./test', assets.elliot.url)))
  t.ok(yield fs.exists(path.join('./test', assets.entry.url)))

  let render = require('./assets/index')
  let $ = cheerio.load(render({}))
  t.equal($('title').text(), 'Weo')
  rimraf.sync('test/assets')
  t.end()


}))
