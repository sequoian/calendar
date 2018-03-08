import React from 'react'
import moment from 'moment'
import '../css/Day.css'
import Event from './Event'

const Day = ({day, events, onEventClick, onEventToggle, onHeaderClick}) => {
  const today = moment().startOf('day').valueOf()
  const classes = ['day']
  if (day < today) classes.push('past')
  else if (day === today) classes.push('today')
  const className = classes.join(' ').trim()
  return (
    <div 
      id={day}
      className={className}
    >
      <h2 onClick={e => onHeaderClick(day)}>
        {day === today ? 'Today' : moment(day).format('dddd, MMMM DD, YYYY')}
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