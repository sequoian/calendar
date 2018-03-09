import {CHANGE_DAY, NEXT_DAY, PREV_DAY} from '../actions'
import moment from 'moment'

const defaultState = {
  selectedDay: moment().startOf('day'),
  showOlder: false
}

const calendar = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_DAY:
      return {
        selectedDay: action.day
      }
    case NEXT_DAY:
      return {
        selectedDay: state.selectedDay.add(1, 'day').startOf('day')
      }
    case PREV_DAY:
    return {
      selectedDay: state.selectedDay.subtract(1, 'day').startOf('day')
    }
    default:
      return state
  }
}

export default calendar