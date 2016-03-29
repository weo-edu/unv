/**
 * Default index
 */

function render ({url}) {
  return `
    <html>
      <head>
        <script type='text/javascript' src='${process.env.JS_ENTRY}'></script>
      </head>
      <body>
      </body>
    </html>
  `
}
