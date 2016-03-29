import test from 'tape'
import bundleClient from '../src/bundleClient'
import fs from 'mz/fs'
import path from 'path'

var a = require('./assets.json')
var ELLIOT = path.join(__dirname, a.elliot.path)


test('should bundle client entry', (t) => {
  t.plan(6)

  let assets = bundleClient('./test/app/client.js', a.entry.path)

  assets.wait().then(function ({assets, files}) {
    t.ok(files[a.entry.path], 'entry in files')
    t.ok(files[ELLIOT], 'elliot in files')
    t.ok(assets[a.entry.url], 'entry in assets')
    t.ok(assets[a.elliot.url], 'elliot in assets')
    t.ok(files[a.entry.path].stat.mtime, 'entry has stat')
    t.ok(files[ELLIOT].stat.mtime, 'elliot has stat')
  })
})
