
import request from 'supertest'
import test from 'tape'
import cheerio from 'cheerio'
import unv from '../src'
import bundleClient from '../src/bundleClient'

var a = require('./assets.json')

test('should render index', function (t) {
  t.plan(2)
  let app = unv.serve({
    client: './test/app/client.js',
    server: './test/app/server.js',
    name: 'weo.js'
  })

  request(app).get('/test').end(function (err, res) {
    let $ = cheerio.load(res.text)
    t.equal($('title').text(), 'Weo')
    t.equal($('#url').text(), '/test')
    app.close()
  })

})

test('should throw error', function (t) {
  t.plan(2)
  let app = unv.serve({
    client: './test/app/client.js',
    server: './test/app/server.js',
    name: 'weo.js'
  })

  request(app).get('/throw').end(function (err, res) {
    let $ = cheerio.load(res.text)
    t.equal($('title').text(), 'Error - 500')
    t.ok($('code').text().indexOf('Error: woot') >= 0)
    app.close()
  })

})

test('should render entry asset', function (t) {
  t.plan(2)
  let app = unv.serve({
    client: './test/app/client.js',
    server: './test/app/server.js',
    name: 'weo.js'
  })

  let assets = bundleClient('./test/app/client.js', a.client.path)

  assets.wait().then(function ({assets, files}) {
    const clientUrl = getClientUrl(assets)
    request(app).get(clientUrl).end(function (err, res) {
      t.ok(res.headers['content-type'].indexOf('application/javascript') >= 0)
      t.ok(res.text.indexOf('vdux/dom') >= 0)
      app.close()
    })
  })

  const reg = /\/assets\/weo-\d+.js/

  function getClientUrl (obj) {
    return Object.keys(obj).find(function (url) {
      return reg.test(url)
    })
  }


})

test('should render elliot asset', function (t) {
  t.plan(1)
  let app = unv.serve({
    client: './test/app/client.js',
    server: './test/app/server.js',
    name: 'weo.js'
  })

  request(app).get(a.elliot.url).end(function (err, res) {
    t.ok(res.headers['content-type'].indexOf('image/jpeg') >= 0)

    app.close()
  })

})
