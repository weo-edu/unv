import stream from '@f/promise-stream'
import isPromise from '@f/is-promise'
import zip from '@f/zip-obj'
import thunkToPromise from '@f/thunk-to-promise'
import objToPromise from '@f/object-to-promise'
import fs from 'mz/fs'
import path from 'path'
import urify from './urify'

function assetStream (base) {
  const assetStream = stream()
  const assets = stream.map(assetsReduce(), assetStream)
  return {addFile, assets}

  function addFile (file, content, getStat = true) {
    let url = urify(base, file, content)
    assetStream(objToPromise({
      file,
      content,
      url,
      stat: getStat ? fs.stat(file) : {mtime: new Date(), atime: new Date()}
    }))
    return url
  }
}

var assetsReduce = _ => {
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



export default assetStream
