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
    name: 'weo.js',
    dir: './test/assets',
    handler: './test/assets/index.js'
  })

  t.ok(yield fs.exists(path.join('./test', assets.elliot.url)))

  t.ok(clientFileExists(yield fs.readdir(path.join('./test'))))


  let render = require('./assets/index.js')
  let $ = cheerio.load(render({}))
  t.equal($('title').text(), 'Weo')
  rimraf.sync('test/assets')
  t.end()

}))

const reg = /.*\/assets\/weo-\d{20}.js/

function clientFileExists (files) {
  return files.filter(function (url) {
    return reg.test(url)
  })
}
