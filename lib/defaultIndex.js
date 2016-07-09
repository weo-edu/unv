module.exports = render

/**
 * Default index
 */

function render ({url}) {
  return `
    <html>
      <head>
        <script type='text/javascript' src='${process.env.BUILD_PATH}'></script>
      </head>
      <body>
      </body>
    </html>
  `
}
