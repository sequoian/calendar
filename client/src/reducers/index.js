import {combineReducers} from 'redux'
import events from './events'
import editor from './editor'
import calendar from './calendar'

const calendarApp = combineReducers({
  events,
  editor,
  calendar
})

export default calendarApp