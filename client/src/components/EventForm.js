import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const EventForm = ({title, day, time, description}) => (
  <form className="event-form">
    <input 
      value={title}
      placeholder="Title"
    />
    <DatePicker
      selected={day}
      dateFormat="MMM DD, YYYY"
      readOnly
    />
    <input 
      value={time}
      placeholder="Time"
    />
    <input 
      value={description}
      placeholder="Description"
    />
  </form>
)

EventForm.propTypes = {
  title: PropTypes.string,
  //day: PropTypes.string,
  time: PropTypes.string,
  description: PropTypes.string
}

export default EventForm