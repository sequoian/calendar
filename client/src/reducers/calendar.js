import {CHANGE_DAY} from '../actions'
import moment from 'moment'

const defaultState = {
  selectedDay: moment()
}

const calendar = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_DAY:
      return {
        selectedDay: action.day
      }
    default:
      return state
  }
}

export default calendar