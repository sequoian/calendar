import React from 'react'
import moment from 'moment'
import '../css/Event.css'

const Event = ({value, onClick, onToggle}) => (
  <div className={value.completed ? 'event complete' : 'event'}>
    <div className="event-toggle">
      <button onClick={onToggle} />
    </div>
    <div 
      className="event-info"
      onClick={onClick}
    >
      
      <div className="title">{value.title}</div>
      <div className="time">
        {value.time ? moment(value.time).format('h:mma') : ''}
      </div>
      <div className="details">{value.details}</div>
    </div>
  </div>
)

export default Event