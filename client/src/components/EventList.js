import React from 'react'
import {connect} from 'react-redux'
import {openEditor, toggleEvent} from '../actions'
import '../css/EventList.css'
import Day from './Day'
import moment from 'moment'

const EventList = ({events, onEventClick, onEventToggle, onDayClick}) => {
  for (let i = 0; i < 7; i++) {
    const day = moment().add(i, 'd').startOf('day').valueOf()
    if (!events[day]) events[day] = []
  }

  const days = Object.keys(events).map(key => {
    const day = events[key]
    return (
      <Day
        key={key}
        day={parseInt(key, 10)}
        events={day}
        onEventClick={onEventClick}
        onEventToggle={onEventToggle}
        onHeaderClick={onDayClick}
      />
    )
  })

  return (
    <div className="event-list">
      {days}
    </div>
  )
}

const sortByDay = (a, b) => {
  if (a.day > b.day) return 1
  if (a.day < b.day) return -1
  return sortByTime(a, b)
}

const sortByTime = (a, b) => {
  const timeA = parseInt(a.time, 10)
  const timeB = parseInt(b.time, 10)
  // no times go to front of list
  if (isNaN(timeA) && !isNaN(timeB)) return -1
  if (!isNaN(timeA) && isNaN(timeB)) return 1
  // then sort if both events have time prop
  if (a.time > b.time) return 1
  if (a.time < b.time) return -1
  return 0
}

const divideByDay = events => {
  const divided = {}
  events.forEach(event => {
    divided[event.day] ? divided[event.day].push(event) : divided[event.day] = [event]
  })
  return divided
}

const mapStateToProps = state => {
  const events = state.events.slice()
  const sorted = events.sort(sortByDay)
  const divided = divideByDay(sorted)
  return {
    events: sorted.length > 0 ? divided : sorted
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onEventClick: event => dispatch(openEditor(event)),
    onEventToggle: id => dispatch(toggleEvent(id)),
    onDayClick: day => dispatch(openEditor(null, day))
  }
}

const EventListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventList)

export default EventListContainer