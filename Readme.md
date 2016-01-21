
# unv

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Universal, javascript-only application dev server and build tool.

## Installation

    $ npm install unv

## Overview

unv is *not* trying to be everything for everyone. It's designed to work very well with the way we bootstrap projects at Weo. If your projects are like ours, it'll be great. If not, look into something like [budo](https://github.com/mattdesl/budo) which is less opinionated.

## CLI

If you have a `src/client.js` or a `lib/client.js` (in that order), then you can just run:

`unv dev`

In your project's root. You can also specify a `server.js` in the same folder, which you can use to render your `index.html`. If you want to specify differently named files, you can do so like this:

`unv dev --client dist/client.js --server dist/server.js`

## client.js

Just your standard clientside entry-point. Nothing special here.

## server.js

Your server.js file should export a single function of the form `render(request, urls)`. `urls.js` is the path to your javascript bundle, and `request` is a node request object. Your render function may return any yieldable value (e.g. promise, string, thunk, generator, etc.) that resolves to the HTML of the page you want to render.

Example:

```javascript
export default function *(req, urls) {
  const {state, html} = yield main(req)
  
  return `
    <html>
      <head>
        <script type='text/javascript'>
          window.__initialState__ = ${JSON.stringify(state)}
        </script>
        <script type='text/javascript' src='${urls.js}'></script>
      </head>
      <body>
        ${html}
      </body>
     </html>
     `
}
```

## Hot reloading

Hot reloading is turned on by default in the dev server, and since everything is javascript, it's the only type of reloading you'll need (i.e. no livereload). To support server-side hot reloading, your `server.js` may export a `replace` method.

Here's an example `replace` function:

```javascript
function replace () {
  invalidate(new RegExp('^' + path.resolve('./src')))
  main = require('./main').default
}

function invalidate (re) {
  forEach(remove, require.cache)

  function remove (val, key) {
    if (re.test(key)) {
      delete require.cache[key]
    }
  }
}
```

Client-side hot reloading works using the [browserify-hmr](https://github.com/AgentME/browserify-hmr) plugin.

## Assets (e.g. images)

In both your server-side and client-side code, you can just require/import any assets you may have and it will resolve to the url it's going to be served from. E.g.

```javascript
import weo from './weo.png'
import element from 'vdux/element'

function render () {
  return <img src={weo} />
}

export default render
```

## CSS

There is currently not a particular solution for css. Which means you're mostly limited to css-in-js solutions at the moment. At Weo, we use [jss-simple](https://github.com/ashaffer/jss-simple).

## Building for production

unv will also support building all of your assets and an asset map (similar to webpack's) for production, but that is still TBD.

## ES6

All of your code (server and client) will be babel'd from the start. So no need for any `server.babel.js` or anything like that.

## License

MIT
