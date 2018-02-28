import {CHANGE_DAY} from '../actions'
import moment from 'moment'

const defaultState = {
  selectedDay: moment().startOf('day')
}

const calendar = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_DAY:
      return {
        selectedDay: action.day.startOf('day')
      }
    default:
      return state
  }
}

export default calendar