import {
  ADD_EVENT,
  TOGGLE_EVENT,
  EDIT_EVENT,
  DELETE_EVENT,
} from '../actions'

const eventsByDate = (state = {}, action) => {
  switch (action.type) {
    case ADD_EVENT:
    case TOGGLE_EVENT:
    case EDIT_EVENT:
    case DELETE_EVENT:
      const day = action.event.day
      return Object.assign({}, state, {
        [day]: eventsBySchedule(state[day], action)
      })
    default:
      return state
  }
}

const eventsBySchedule = (state = {}, action) => {
  switch (action.type) {
    case ADD_EVENT:
    case TOGGLE_EVENT:
    case EDIT_EVENT:
    case DELETE_EVENT:
      const category = action.event.time ? 'scheduled' : 'unscheduled'
      return Object.assign({}, state, {
        [category]: events(state[category], action)
      })
    default:
      return state
  }
}

const sortByTitle = (a, b) => {
  if (a.title < b.title) return -1
  if (a.title > b.title) return 1
  return 0
}

const events = (state = [], action) => {
  switch (action.type) {
    case ADD_EVENT: 
      const events = [...state, action.event]
      return events.sort(sortByTitle)
    case TOGGLE_EVENT:
      return state.map(event => {
        if (event.id === action.id) {
          return Object.assign({}, event, {
            completed: !event.completed
          })
        }
        return event
      })
    case EDIT_EVENT:
      const events = state.map(event => {
        if (event.id === action.event.id) {
          return action.event
        }
        return event
      })
      return events.sort(sortByTitle)
    case DELETE_EVENT:
      return state.filter(event =>
        event.id !== action.id
      )
    default:
      return state
  }
}

export default eventsByDate