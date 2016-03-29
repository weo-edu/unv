/**
 * Imports
 */

import element from 'vdux/element'
import vdux from 'vdux/string'


import App from './app'
import reducer from './reducer'

var fs = require('fs')
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
        <script type='text/javascript' src='${process.env.JS_ENTRY}'></script>
        <script type='text/javascript'>
          window.__initialState__ = ${JSON.stringify(state)}
        </script>
      </head>
      <body>${html}</body>
    </html>
  `
}
