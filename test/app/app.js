import element from 'vdux/element'

const cloudFS = require('cloud-fs')
const elliot = cloudFS.url('./elliot.jpg')

function render ({props}) {
  return (<div onClick={increment}>
    <div>Value: {props.value}</div>
    <div id='url'>{props.url}</div>
    <h1>Elliot Woot</h1>
    <img src={elliot}/>
  </div>)
}

function increment () {
  return {
    type: 'INCREMENT'
  }
}

export default {
  render
}
