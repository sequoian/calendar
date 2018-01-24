// uses closures to enforce DRY code
const fullEventActionCreator = type => (
  id, title, completed, day, time, details,
  repeats, frequency, daysOfWeek, endOption, endOn, endAfter
) => {
  return {
    type,
    event: {
      id,
      title,
      completed,
      day,
      time,
      details,
      repeatOptions: {
        repeats,
        frequency,
        daysOfWeek,
        endOption,
        endOn,
        endAfter
      }
    }
  } 
}

export const ADD_EVENT = 'ADD_EVENT'
export const addEvent = fullEventActionCreator(ADD_EVENT)

export const EDIT_EVENT = 'EDIT_EVENT'
export const editEvent = fullEventActionCreator(EDIT_EVENT)

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