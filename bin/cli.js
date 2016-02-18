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

var modules = args.modules
if (modules) configurePaths(path.resolve(process.cwd(), modules))

// Enable babel by default when used from the command line
require('babel-register')

if (cmd === 'dev') {
  var client = args.client
  var server = args.server
  var port = args.port || 3000

  if (!client) client = tryDefaults('client.js')
  if (!client) client = tryDefaults('client/')
  if (!server) server = tryDefaults('server.js')
  if (!server) server = tryDefaults('server/')

  unv.serve({
    client,
    server,
    port
  })
} else {
  console.log('Unrecognized command')
}

/**
 * Helpers
 */

/**
 * Setup requires from your project's root
 * source folder. So you can e.g., `require('components/modal')`
 */

function configurePaths (path) {
  process.env.NODE_PATH = [process.env.NODE_PATH, path].filter(Boolean).join(':')
  // XXX How bad of a hack is this?
  require('module')._initPaths()
}

function tryDefaults (file) {
  if (fs.existsSync(path.join('src', file))) return path.join('src', file)
  if (fs.existsSync(path.join('lib', file))) return path.join('lib', file)
}
