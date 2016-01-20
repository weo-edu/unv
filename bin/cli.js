#!/usr/bin/env node

/**
 * Imports
 */

var minimist = require('minimist')
var path = require('path')
var unv = require('..')
var fs = require('fs')

/**
 * CLI
 */

var args = minimist(process.argv.slice(2))
var cmd = args._[0]

if (cmd === 'dev') {
  var client = args.client
  var server = args.server

  if (!client) client = tryDefaults('client.js')
  if (!server) server = tryDefaults('server.js')

  unv.serve({
    client,
    server
  })
} else {
  console.log('Unrecognized command')
}

/**
 * Helpers
 */

function tryDefaults (file) {
  if (fs.existsSync(path.join('src', file))) return path.join('src', file)
  if (fs.existsSync(path.join('lib', file))) return path.join('lib', file)
}
