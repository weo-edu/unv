/**
 * Imports
 */

const fs = require('mz/fs')
const {join} = require('path')
const nodemon = require('nodemon')
const http = require('http')
const httpProxy = require('http-proxy')
const stream = require('@f/promise-stream')
const logError = require('@f/log-error')
const waitForPort = require('wait-for-port')


const serveAssets = require('./serveAssets')
const servePage = require('./servePage')
const bundle = require('./bundleClient')

const BUILD_PATH = process.env.BUILD_PATH || join(process.cwd(), 'build.js')

/**
 * Exports
 */

module.exports = dev


function dev ({client, server, name, assets = '/assets', port=3000}) {
  const assetPort = port + 1
  const pagePort = port + 2
  const aServer = serveAssets({port: assetPort, quiet: true})
  const builds = bundle(client, name, true)
  const proxy = httpProxy.createProxyServer({})

  let first = true
  const pServer = stream.map(content => {
    return fs.writeFile(BUILD_PATH, content).then(_ => {
      return (new Promise((resolve, reject) => {
        if (first) {
          nodemon(`-i ** ../../bin/cli.js serve --squelch --port ${pagePort}`)
          first = false
        } else {
          nodemon.restart()
        }
        // process restarted
        nodemon.once('start', _ => {
          // server up
          waitForPort('localhost', pagePort, _ => {
            resolve(true)
          })
        })
      }))
    })
  }, builds)

  http.createServer(function (req, res) {
    if (req.url.startsWith(assets)) {
      proxy.web(req, res, {target: `http://localhost:${assetPort}`}, logError)
    } else {
      stream.wait(pServer).then(_ => {
        proxy.web(req, res, {target: `http://localhost:${pagePort}`}, logError)
      })
    }
  }).listen(port, _ => console.log(`Dev listening on ${port}`))

}
