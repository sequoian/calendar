import React from 'react'
import {connect} from 'react-redux'
import {openEditor, toggleEvent} from '../actions'
import '../css/EventList.css'
import Event from './Event'
import moment from 'moment'

const EventList = ({events, onEventClick, onEventToggle, onDayClick}) => {
  if (events.length < 1) return (
    <div>Nothing scheduled</div>
  )
  return (
    <div className="event-list">
      {events.map(byDay => (
        <div 
          className="day"
          key={byDay[0].day}
        >
          <h2 onClick={e => onDayClick(byDay[0].day)}>
            {moment(byDay[0].day).format('dddd, MMMM DD, YYYY')}
          </h2>
          <ul>
          {byDay.map(event => (
            <li key={event.id}>
              <Event
                value={event}
                onClick={e => onEventClick(event)}
                onToggle={e => onEventToggle(event.id)}
              />
            </li>
          ))}
          </ul>
        </div>
      ))}
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

const thisDayAndLater = day => event => {
  if (event.day >= day) return event
}

const divideByDay = events => {
  let currentDay = null
  let daysEvents = []
  const days = []
  events.forEach(event => {
    if (currentDay === null) {
      currentDay = event.day
      daysEvents = [event]
    }
    else if (event.day !== currentDay) {
      days.push(daysEvents)
      currentDay = event.day
      daysEvents = [event]
    }
    else {
      daysEvents.push(event)
    }
  })
  days.push(daysEvents)
  return days
}

const mapStateToProps = state => {
  const events = state.events.slice()
  const sorted = events.sort(sortByDay)
  const filtered = sorted.filter(thisDayAndLater(state.calendar.selectedDay.valueOf()))
  const divided = divideByDay(filtered)
  return {
    events: filtered.length > 0 ? divided : filtered
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