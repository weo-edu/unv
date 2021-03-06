/**
 * Imports
 */

const element = require('vdux/element').default
const vdux = require('vdux/string').default


const App = require('./app').default
const reducer = require('./reducer').default

const fs = require('fs')
const style = fs.readFileSync(__dirname + '/global.css', 'utf8')

const cloudFS = require('cloud-fs')

/**
 * Render
 */

module.exports = handler

/**
 * InitialState
 */

const initialState = {counter: 0}

/**
 * Render to html string
 */

const {render} = vdux({reducer, initialState})


/**
 * Handle requests
 */

function handler ({url}) {
  if (url === '/throw') {
    throw new Error('woot')
  }
  var state = {counter: 0}
  return Promise.resolve(page(render(<App value={state.counter} url={url}/>), state))
}

/**
 * Page
 */

function page (body, state) {
  return `
    <html>
      <head>
        <title>Weo</title>
        <style>
          ${style}
        </style>
        <script type='text/javascript' src='${cloudFS.url('./scripts/build.js')}'></script>
        <script type='text/javascript'>
          window.__initialState__ = ${JSON.stringify(state)}
        </script>
      </head>
      <body>${body}</body>
    </html>
  `
}
