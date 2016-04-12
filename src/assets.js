/**
 * Imports
 */

import objToPromise from '@f/object-to-promise'
import stream from '@f/promise-stream'
import urify from './urify'
import fs from 'mz/fs'

/**
 * Asset stream
 */

function assetStream (base) {
  const assetStream = stream()
  const assets = stream.map(assetsReduce(), assetStream)
  return {addFile, assets}

  function addFile (file, content, getStat = true) {
    const url = urify(base, file, content)

    assetStream(objToPromise({
      file,
      content,
      url,
      stat: getStat ? fs.stat(file) : {mtime: new Date(), atime: new Date()}
    }))
    return url
  }
}

function assetsReduce () {
  const files = {}
  const assets = {}
  return asset => {
    if (files[asset.file]) {
      delete assets[files[asset.file].url]
    }

    files[asset.file] = asset
    assets[asset.url] = asset

    return {files, assets}
  }
}

/**
 * Exports
 */

export default assetStream
