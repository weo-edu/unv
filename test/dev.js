
import request from 'supertest'
import test from 'tape'
import cheerio from 'cheerio'
import unv from '..'
import bundleClient from '../lib/bundleClient'
import cloudFS from 'cloud-fs'
import http from 'http'
import rimraf from 'rimraf'

test('should render index', function (t) {
  t.plan(2)
  const app = unv.dev({
    client: './test/app/client.js',
    server: './test/app/server.js',
    outFile: './test/app/scripts/build.js',
    assetsDir: './test/assets',
    watch: false
  }).listen()

  request(app).get('/test').end(function (err, res) {
    let $ = cheerio.load(res.text)
    t.equal($('title').text(), 'Weo')
    t.equal($('#url').text(), '/test')
    app.close()
  })

})

test('should throw error', function (t) {
  t.plan(2)
  const app = unv.dev({
    client: './test/app/client.js',
    server: './test/app/server.js',
    outFile: './test/app/scripts/build.js',
    assetsDir: './test/assets',
    watch: false
  }).listen()

  request(app).get('/throw').end(function (err, res) {
    let $ = cheerio.load(res.text)
    t.equal($('title').text(), 'Error - 500')
    t.ok($('code').text().indexOf('Error: woot') >= 0)
    app.close()
  })

})

test('should render entry asset', function (t) {
  t.plan(2)
  const app = unv.dev({
    client: './test/app/client.js',
    server: './test/app/server.js',
    outFile: './test/app/scripts/build.js',
    assetsDir: './test/assets',
    watch: false
  }).listen()

  const clientUrl = cloudFS.url('./app/scripts/build.js')
  request(app).get(`/test${clientUrl}`).end(function (err, res) {
    t.ok(res.headers['content-type'].indexOf('application/javascript') >= 0)
    t.ok(res.text.indexOf('vdux/dom') >= 0)
    app.close()
  })

})

test('should render elliot asset', function (t) {
  t.plan(1)
  const app = unv.dev({
    client: './test/app/client.js',
    server: './test/app/server.js',
    outFile: './test/app/scripts/build.js',
    assetsDir: './test/assets',
    watch: false
  }).listen()

  const elliotUrl = cloudFS.url('./app/elliot.jpg')
  request(app).get(`/test${elliotUrl}`).end(function (err, res) {
    t.ok(res.headers['content-type'].indexOf('image/jpeg') >= 0)
    rimraf.sync('test/assets')
    rimraf.sync('test/app/scripts')
    app.close()
  })

})
