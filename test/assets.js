import test from 'tape'
import assetsStream from '../src/assets'
import stream from '@f/promise-stream'
import fs from 'mz/fs'
import path from 'path'

test('should create assets stream', (t) => {
  t.plan(5)
  const file = './test/app/global.css'
  const base = '/assets'
  let {addFile, assets} = assetsStream(base)
  let url

  assets.wait().then(function ({assets, files}) {
    t.equal(files[file].url, url)
    t.equal(files[file], assets[url])
    t.end()
  })

  addFile(file, fs.readFile(file)).then(function (u) {
    url = u
    t.ok(u.indexOf('/assets/global') === 0, 'prefix')
    t.ok(u.indexOf('global.css') === -1, 'no ext in prefix')
    t.ok(path.extname(u) === '.css', 'correct ext')
  })

})
