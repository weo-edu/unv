
import request from 'supertest'
import test from 'tape'
import cheerio from 'cheerio'
import unv from '../src'

var assets = require('./assets.json')

test('should render index', function (t) {
  t.plan(2)
  let app = unv.serve({
    client: './test/app/client.js',
    server: './test/app/server.js',
    entry: 'weo.js'
  })

  request(app).get('/test').end(function (err, res) {
    let $ = cheerio.load(res.text)
    t.equal($('title').text(), 'Weo')
    t.equal($('#url').text(), '/test')
    app.close()
  })

})

test('should render entry asset', function (t) {
  t.plan(2)
  let app = unv.serve({
    client: './test/app/client.js',
    server: './test/app/server.js',
    entry: 'weo.js'
  })

  request(app).get(assets.entry.url).end(function (err, res) {
    t.ok(res.headers['content-type'].indexOf('application/javascript') >= 0)
    t.ok(res.text.indexOf('vdux/dom') >= 0)
    app.close()
  })

})

test('should render elliot asset', function (t) {
  t.plan(1)
  let app = unv.serve({
    client: './test/app/client.js',
    server: './test/app/server.js',
    entry: 'weo.js'
  })

  request(app).get(assets.elliot.url).end(function (err, res) {
    t.ok(res.headers['content-type'].indexOf('image/jpeg') >= 0)

    app.close()
  })

})
