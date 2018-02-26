import {
  ADD_EVENT,
  TOGGLE_EVENT,
  EDIT_EVENT,
  DELETE_EVENT,
} from '../actions'

const events = (state = [], action) => {
  switch (action.type) {
    case ADD_EVENT:
      return [
        ...state,
        action.event
      ]
    case TOGGLE_EVENT:
      return state.map(event =>
        (event.id === action.id)
        ? {...event, completed: !event.completed}
        : event
      )
    case EDIT_EVENT:
      return state.map(event => 
        (event.id === action.event.id)
        ? action.event
        : event
      )
    case DELETE_EVENT:
      return state.filter(event => 
        event.id !== action.id
      )
    default:
      return state
  }
}

export default events