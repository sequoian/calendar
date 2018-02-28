import {OPEN_EDITOR, CLOSE_EDITOR} from '../actions'

const defaultState = {
  isOpen: false,
  event: null,
  day: null
}

const editor = (state = defaultState, action) => {
  switch (action.type) {
    case OPEN_EDITOR:
      return {
        isOpen: true,
        event: action.event,
        day: action.day
      }
    case CLOSE_EDITOR:
      return {
        isOpen: false,
        event: null,
        day: null
      }
    default:
      return state
  }
}

export default editor