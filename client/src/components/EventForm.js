import React from 'react'
import {Component} from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import RepeatOptions from './RepeatOptions'

class EventFormContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.title || '',
      day: moment(this.props.day) || moment(),
      time: this.props.time || '',
      details: this.props.description || ''
    }
    this.update = this.update.bind(this)
    this.updateDay = this.updateDay.bind(this)
    this.formatTime = this.formatTime.bind(this)
  }

  update(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  updateDay(value) {
    this.setState({
      day: value
    })
  }

  formatTime(event) {
    const {value} = event.target
    const newTime = moment(value, [
      'h:mma',
      'hmma',
      'H:mm',
      'Hmm'
    ])
    if (newTime.isValid()) {
      this.setState({
        time: newTime.format('h:mma')
      })
    }
    else {
      this.setState({
        time: ''
      })
    }
  }

  render() {
    const {title, day, time, details} = this.state
    return (
      <EventForm
        title={title}
        day={day}
        time={time}
        details={details}
        update={this.update}
        updateDay={this.updateDay}
        formatTime={this.formatTime}
      />
    )
  }
}

const EventForm = ({title, day, time, details, update, updateDay, formatTime}) => (
  <form className="event-form">
    <input 
      name="title"
      value={title}
      onChange={update}
      placeholder="Title"
      autoFocus
    />
    <DatePicker
      name="day"
      selected={day}
      dateFormat="MMM DD, YYYY"
      onChange={updateDay}
      placeholderText="Day"
    />
    <input
      name="time" 
      value={time}
      onChange={update}
      placeholder="Time"
      onBlur={formatTime}
    />
    <input 
      name="details"
      value={details}
      onChange={update}
      placeholder="Details"
    />
    <RepeatOptions />
  </form>
)

EventForm.propTypes = {
  title: PropTypes.string,
  day: PropTypes.object,
  time: PropTypes.string,
  description: PropTypes.string
}

export default EventFormContainer