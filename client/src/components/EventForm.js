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
  }

  update(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  updateDay(event) {
    this.setState({
      day: event.target.value
    })
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
      />
    )
  }
}

const EventForm = ({title, day, time, details, update, updateDay}) => (
  <form className="event-form">
    <input 
      name="title"
      value={title}
      onChange={update}
      placeholder="Title"
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
      onBlur={(e) => {
        const val = e.target.value
        const m = moment(val, [
          'h:mma',
          'hmma',
          'H:mm',
          'Hmm'
        ])
        console.log(m.format('h:mma'))
      }}
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