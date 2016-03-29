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
var opts = parseOpts()

// Enable babel by default when used from the command line
require('babel-register')

switch(cmd) {
  case 'dev': return dev(opts)
  case 'build': return build(opts)
  case default: return unknown()
}


// commands
function dev ({client, server, port}) {
  unv.serve({
    client,
    server,
    port,
    watch: true
  })
}

function build({client, server}) {
  unv.build({client, server})
}

function unknown () {
  console.log('Unrecognized command')
}

/**
 * Helpers
 */

function parseOpts () {
  var modules = args.modules
  if (modules) configurePaths(path.resolve(process.cwd(), modules))

  var client = args.client
  if (!client) client = tryDefaults('client.js')
  if (!client) client = tryDefaults('client/')

  var server = args.server
  if (!server) server = tryDefaults('server.js')
  if (!server) server = tryDefaults('server/')
  if (!server) resolve(__dirname + '/../src/defaultIndex.js')

  var port = args.port || 3000

  return {modules, client, server, port}
}

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
