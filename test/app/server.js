/**
 * Imports
 */

const element = require('vdux/element')
const vdux = require('vdux/string')


const App = require('./app')
const reducer = require('./reducer')

const fs = require('fs')
const style = fs.readFileSync(__dirname + '/global.css', 'utf8')

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

function handler (event) {
  if (event.url === '/throw') {
    throw new Error('woot')
  }
  var state = {counter: 0}
  return page(render(<App value={state.counter} url={event.url}/>), state)
}

/**
 * Page
 */

function page (html, state) {
  return `
    <html>
      <head>
        <title>Weo</title>
        <style>
          ${style}
        </style>
        <script type='text/javascript' src='${process.env.CLIENT_JS_BUILD}'></script>
        <script type='text/javascript'>
          window.__initialState__ = ${JSON.stringify(state)}
        </script>
      </head>
      <body>${html}</body>
    </html>
  `
}
