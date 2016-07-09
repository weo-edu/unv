/**
 * Imports
 */

const fs = require('fs')
const {join} = require('path')
const nodemon = require('nodemon')


const serveAssets = require('./serveAssets')
const servePage = require('./servePage')
const bundle = require('./bundleClient')

const BUILD_PATH = process.env.BUILD_PATH || join(process.cwd(), 'build.js')

/**
 * Exports
 */

module.exports = dev


function dev ({client, server, name, assetPort, pagePort, assets, watch}) {
  const aServer = serveAssets({dir: assets, assetPort})
  const builds = bundle(client, name, watch)
  let first = true
  builds.subscribe(content => {
    fs.writeFileSync(BUILD_PATH, content)
    if (first) {
      nodemon(`-i ** ../../bin/cli.js serve`)
      first = false
    } else {
      nodemon.restart()
    }

  })
}
