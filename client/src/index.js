import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducers from './reducers'
import storage from './storage'
import registerServiceWorker from './registerServiceWorker'
import './css/reset.css'
import './css/index.css'
import App from './components/App'

const persistedState = storage.loadState('calendarState')
const store = createStore(reducers, persistedState)

store.subscribe(() => {
  storage.saveState('calendarState', {
    events: store.getState().events
  })
}) 

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root')
)

registerServiceWorker()