import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducers from './reducers'
import storage from './storage'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import App from './components/App'

const persistedState = storage.loadState()
const store = createStore(reducers, persistedState)

store.subscribe(() => {
  storage.saveState({
    events: store.getState().events
  })
  console.log(store.getState())
}) 

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root')
)

registerServiceWorker()