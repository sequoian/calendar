import React from 'react'
import {connect} from 'react-redux'
import {openEditor} from '../actions'
import Event from './Event'

const EventList = ({events, onEventClick}) => (
  <ul>
    {events.map(event => (
      <li key={event.id}>
        <Event
          value={event}
          onClick={e => onEventClick(event)}
        />
      </li>
    ))}
  </ul>
)

const sortByDay = (a, b) => {
  if (a.day > b.day) return 1
  if (a.day < b.day) return -1
  return sortByTime(a, b)
}

const sortByTime = (a, b) => {
  const timeA = parseInt(a.time, 10)
  const timeB = parseInt(b.time, 10)
  if (isNaN(timeA) && !isNaN(timeB)) return -1
  if (!isNaN(timeA) && isNaN(timeB)) return 1
  // then sort if both events have time prop
  if (a.time > b.time) return 1
  if (a.time < b.time) return -1
  return 0
}

const mapStateToProps = state => {
  return {
    events: state.events.sort(sortByDay)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onEventClick: event => dispatch(openEditor(event))
  }
}

const EventListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventList)

export default EventListContainer