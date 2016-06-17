module.exports = render

/**
 * Default index
 */

function render ({url}) {
  return `
    <html>
      <head>
        <script type='text/javascript' src='${process.env.CLIENT_JS_BUILD}'></script>
      </head>
      <body>
      </body>
    </html>
  `
}
