#!/usr/bin/env node

// Enable babel by default when used from the command line
require('babel-register')
require('envitro')()

/**
 * Imports
 */

var Switch = require('@f/switch')
var fs = require('fs')
var minimist = require('minimist')
var optStack = require('opt-stack')
var path = require('path')

var unv = require('..').default

/**
 * CLI
 */

var cmd = process.argv[2]
var opts = optStack('unv', {
  client: defaultClientPath(),
  server: defaultServerPath(),
  name: defaultName(),
  port: 3000,
  base: '/assets'
})

if (opts.modules) {
  opts.modules = configurePaths(path.resolve(process.cwd(), opts.modules))
}

Switch({
  dev: dev,
  build: build,
  serve: serve,
  default: usage
})(cmd, opts)

// commands
function dev (opts) {
  opts.watch = true
  unv.dev(opts)
}

function build(opts) {
  unv.build(opts)
}

function serve(opts) {
  unv.serve(opts)
}

function usage (cmd) {
  if (cmd) {
    console.error(`Error: unknown command "${cmd}" for "unv"`)
  }
  const usage = `
  Usage:
    unv [cmd]

  Commands:

    build     Build assets and lambda server handler
    dev       Start up dev server

  Flags:

    --client   Client entry point
    --server   Server entry point
    --modules  Local modules dirctory
    --name     Name of client build
    --port     Port to run dev server on
    --base     Base url for assets
    --dir      Director to put assets on build
    --handler  Path to put lambda handler on build
  `
  console.log(usage)
}

/**
 * Helpers
 */

function defaultClientPath () {
  return tryDefaults('client.js') || tryDefaults('client/')
}

function defaultServerPath () {
  return tryDefaults('server.js')
    || tryDefaults('server/')
    || path.resolve(__dirname + '/../src/defaultIndex.js')
}

function defaultName () {
  var name = optStack.packJson('name')
  return (name || 'build') + '.js'
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
