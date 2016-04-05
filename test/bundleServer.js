import test from 'tape'

import fs from 'mz/fs'
import path from 'path'
import cheerio from 'cheerio'
import bundleClient from '../src/bundleClient'
import bundleServer from '../src/bundleServer'
import renderer from '../src/renderer'

var a = require('./assets.json')

test('should bundle server', (t) => {
  t.plan(2)
  let assets = bundleClient('./test/app/client.js', a.entry.path)
  let server = bundleServer(assets, './test/app/server.js', a.entry.path)

  let renderStream = renderer(server)
  renderStream.wait().then(function ({render, map}) {
    let html = render({})
    let $ = cheerio.load(html)
    t.equal($('title').text(), 'Weo')
    t.equal($('img').attr('src'), a.elliot.url)
  })
})
