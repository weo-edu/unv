/**
 * Default index
 */

function render (req, urls) {
  return `
    <html>
      <head>
        <script type='text/javascript' src='${urls.js}'></script>
      </head>
      <body>
      </body>
    </html>
  `
}
