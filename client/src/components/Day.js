import React from 'react'
import moment from 'moment'
import '../css/Day.css'
import Event from './Event'

const Day = ({day, events, onEventClick, onEventToggle, onHeaderClick}) => {
  const today = moment().startOf('day').valueOf()
  // set class names
  const classes = ['day']
  if (day < today) classes.push('past')
  else if (day === today) classes.push('today')
  const className = classes.join(' ').trim()
  // set header
  let header
  if (day === today) header = 'Today'
  else if (day === moment().add(1, 'd').startOf('day').valueOf()) header = 'Tomorrow'
  else header = moment(day).format('dddd, MMMM DD, YYYY')
  return (
    <div 
      id={day}
      className={className}
    >
      <h2 onClick={e => onHeaderClick(day)}>
        {header}
      </h2>
      <ul>
      {events.map(event => (
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
  )
}

export default Day