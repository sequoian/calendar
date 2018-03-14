import React, {Component} from 'react'
import {connect} from 'react-redux'
import {openEditor, toggleEvent} from '../actions'
import '../css/EventList.css'
import Day from './Day'
import moment from 'moment'
import {scrollToDay} from '../scroll'

class EventList extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.selectedDay !== this.props.selectedDay) {
      scrollToDay(this.props.selectedDay) 
    }
  }

  render() {
    const {events, selectedDay, onEventClick, onEventToggle, onDayClick} = this.props
    const today = moment().startOf('day').valueOf()
    const tomorrow = moment().add(1, 'd').startOf('day').valueOf()
    // always show today, tomorrow, and selected day
    if (selectedDay <= today) {
      if (!events[today]) events[today] = []
      if (!events[tomorrow]) events[tomorrow] = []
    }
    if (!events[selectedDay]) events[selectedDay] = []
  
    const days = Object.keys(events).sort().map(key => {
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

const olderThan = day => event => event.day >= day

const mapStateToProps = state => {
  const selectedDay = state.calendar.selectedDay.valueOf()
  const events = state.events.slice()
  const filtered = state.calendar.showOlder ? events : events.filter(olderThan(selectedDay))
  const sorted = filtered.sort(sortByDay)
  const divided = divideByDay(sorted)
  return {
    events: divided,
    selectedDay
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