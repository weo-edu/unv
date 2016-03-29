import element from 'vdux/element'
import elliot from './elliot.jpg'

function render ({props}) {
  return (<div onClick={increment}>
    <div>Value: {props.value}</div>
    <div id='url'>{props.url}</div>
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
