/**
 * Imports
 */

const serveAssets = require('./serveAssets')
const servePage = require('./servePage')

/**
 * Exports
 */

module.exports = dev


function dev ({client, server, name, port, watch}) {
  return servePage({server, port})
}
