/**
 * Imports
 */

const fs = require('mz/fs')
const {join, dirname, resolve, relative} = require('path')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const koa = require('koa')
const compose = require('koa-compose')
const stream = require('@f/promise-stream')
const decache = require('@joshrtay/decache')

const bundle = require('./bundleClient')

/**
 * Exports
 */

module.exports = dev


function dev ({client, server, outFile, assetsDir, transforms, watch = true}) {
  const builds = bundle(client, {watch, transforms}, onBundle)

  let serve

  const buildWriteStream = stream.map(content => {
    return fs.writeFile(outFile, content).then(() => {
      decache('./server')
      serve = compose(require('./server')({server, assetsDir}).middleware)
      return true
    })
  }, builds)


  const devServer = koa()

  devServer.use(function * (next) {
    yield stream.wait(buildWriteStream)
    yield serve.call(this, next)
  })

  return devServer

  function onBundle () {
    rimraf.sync(assetsDir)
    mkdirp.sync(assetsDir)
    mkdirp.sync(dirname(outFile))
  }
}
