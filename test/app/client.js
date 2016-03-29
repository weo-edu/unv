import ready from '@f/domready'

import vdux from 'vdux/dom'
import element from 'vdux/element'

import reducer from './reducer'
import App from './app'

const initialState = {
  counter: 0
}

const {subscribe, render} = vdux({reducer, initialState})

ready(() => {
  subscribe(state => {
    render(<App value={state.counter} />)
  })
})
