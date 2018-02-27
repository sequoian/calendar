import {combineReducers} from 'redux'
import events from './events'
import editor from './editor'

const calendarApp = combineReducers({
  events,
  editor
})

export default calendarApp