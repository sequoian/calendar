import moment from 'moment'

const formatTime = time => {
  return moment(time, [
    'h:mma',
    'hmma',
    'H:mm',
    'Hmm'
  ]).valueOf()
}

export const ADD_EVENT = 'ADD_EVENT'
export const addEvent = event => {
  return {
    type: ADD_EVENT,
    event: {
      ...event,
      id: Date.now(),
      completed: false,
      day: event.day.startOf('day').valueOf(),
      endOn: event.endOn.valueOf(),
      time: formatTime(event.time) || ''
    }
  }
}

export const EDIT_EVENT = 'EDIT_EVENT'
export const editEvent = event => {
  return {
    type: EDIT_EVENT,
    event: {
      ...event,
      day: event.day.startOf('day').valueOf(),
      endOn: event.endOn.valueOf(),
      time: formatTime(event.time) || ''
    }
  }
}

export const TOGGLE_EVENT = 'TOGGLE_EVENT'
export const toggleEvent = id => {
  return {
    type: TOGGLE_EVENT,
    id
  }
}

export const DELETE_EVENT = 'DELETE_EVENT'
export const deleteEvent = id => {
  return {
    type: DELETE_EVENT,
    id
  }
}

export const OPEN_EDITOR = 'OPEN_EDITOR'
export const openEditor = (event = null) => {
  return {
    type: OPEN_EDITOR,
    event
  }
}

export const CLOSE_EDITOR = 'CLOSE_EDITOR'
export const closeEditor = () => {
  return {
    type: CLOSE_EDITOR
  }
}

export const CHANGE_DAY = 'CHANGE_DAY'
export const changeDay = day => {
  return {
    type: CHANGE_DAY,
    day
  }
}