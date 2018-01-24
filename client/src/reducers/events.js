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
      const day = action.day
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
      const category = action.time ? 'scheduled' : 'unscheduled'
      return Object.assign({}, state, {
        [category]: events(state[category], action)
      })
    default:
      return state
  }
}

const createEvent = action => {
  return {
    id: action.id,
    title: action.title,
    completed: action.completed,
    day: action.day,
    time: action.time,
    details: action.details,
    repeatOptions: {
      repeats: action.repeats,
      frequency: action.frequency,
      daysOfWeek: action.daysOfWeek,
      endOption: action.endOption,
      endOn: action.endOn,
      endAfter: action.endAfter
    }
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
      const newEvent = createEvent(action)
      const events = [...state, newEvent]
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
        if (event.id === action.id) {
          return createEvent(action)
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