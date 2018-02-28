import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const BasicOptions = ({title, day, time, details, errors, onChange, onChangeDatePicker, onBlurTime}) => (
  <div>
    <div className={errors.title ? 'error' : null}>
      <span>{errors.title}</span>
      <input
        name="title"
        value={title}
        onChange={onChange}
        placeholder="Title"
        autoFocus
      />
    </div>
    <DatePicker
      name="day"
      selected={day}
      dateFormat="MMM DD, YYYY"
      onChange={onChangeDatePicker}
      placeholderText="Day"
    />
    <input
      name="time" 
      value={time}
      onChange={onChange}
      placeholder="Time"
      onBlur={onBlurTime}
    />
    <input 
      name="details"
      value={details}
      onChange={onChange}
      placeholder="Details"
    />
  </div>
)

BasicOptions.propTypes = {
  title: PropTypes.string,
  day: PropTypes.object,
  time: PropTypes.string,
  details: PropTypes.string,
  onChange: PropTypes.func,
  onChangeDatePicker: PropTypes.func,
  onBlurTime: PropTypes.func
}

export default BasicOptions