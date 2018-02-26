import React, {Component} from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import {addEvent, editEvent} from '../actions'
import BasicOptions from './BasicOptions'
import {
  Repeats,
  ShowMore,
  Frequency,
  DaysOfWeek,
  EndNever,
  EndOn,
  EndAfter,
  EndOptions
} from './RepeatOptions'

class EventForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.id || null,
      title: props.title || '',
      day: moment(props.day) || moment(),
      time: props.time || '',
      details: props.details || '',
      repeats: props.repeats || 'no',
      frequency: props.frequency || 1,
      daysOfWeek: props.daysOfWeek || [0, 0, 0, 0, 0, 0, 0],
      endOption: props.endOption || 'never',
      endOn: props.endOn || moment(),
      endAfter: props.endAfter || 10,
      showMore: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.setDatePicker = this.setDatePicker.bind(this)
    this.setDaysOfWeek = this.setDaysOfWeek.bind(this)
    this.toggleShowMore = this.toggleShowMore.bind(this)
    this.formatTime = this.formatTime.bind(this)
    this.submit = this.submit.bind(this)
  }

  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  setDatePicker(name, value) {
    this.setState({
      [name]: value
    })
  }

  setDaysOfWeek(event) {
    const idx = event.target.value
    this.setState((prevState) => {
      const values = prevState.daysOfWeek.slice()
      values[idx] = values[idx] ? 0 : 1  // 0 if 1, and 1 if 0
      return {
        daysOfWeek: values
      }
    })
  }

  toggleShowMore() {
    this.setState(prevState => {
      return {
        showMore: !prevState.showMore
      }
    })
  }

  formatTime(event) {
    const {name, value} = event.target
    const time = moment(value, [
      'h:mma',
      'hmma',
      'H:mm',
      'Hmm'
    ])
    this.setState({
      [name]: time.isValid() ? time.format('h:mma') : ''
    })
  }

  formatInt() {
    // placeholder
  }

  submit(e) {
    e.preventDefault()
    const {dispatch} = this.props
    const event = this.state
    if (event.id) {
      dispatch(editEvent(event))
    }
    else {
      dispatch(addEvent(event))
    }
  }

  render() {
    const state = this.state
    return (
      <form onSubmit={this.submit}>
        <BasicOptions
          title={state.title}
          day={state.day}
          time={state.time}
          details={state.details}
          onChange={this.handleChange}
          onChangeDatePicker={value => {
            this.setDatePicker('day', value)
          }}
          onBlurTime={this.formatTime}
        />
        <Repeats
          repeats={state.repeats}
          onChange={this.handleChange}
        />
        {state.repeats !== 'no' ?
        // conditional show more button
        <ShowMore
          isShowing={state.showMore}
          onClick={this.toggleShowMore}
        /> 
        : null}
        {state.showMore && state.repeats !== 'no' ?
        // conditional advanced options
        <div>
          <Frequency
            frequency={state.frequency}
            repeats={state.repeats}
            onChange={this.handleChange}
          />
          {state.repeats === 'week' ?
          // only show on weekly repeat
          <DaysOfWeek
            days={state.daysOfWeek}
            onChange={this.setDaysOfWeek}
          />
          : null}
          <EndOptions>
            <EndNever
              checked={state.endOption === 'never'}
              onChange={this.handleChange}
            />
            <EndOn
              checked={state.endOption === 'on'}
              onChange={this.handleChange}
              date={state.endOn}
              onDateChange={value => {
                this.setDatePicker('endOn', value)
              }}
            />
            <EndAfter
              checked={state.endOption === 'after'}
              number={state.endAfter}
              onChange={this.handleChange}
            />  
          </EndOptions>
        </div>
        : null}
        <button>Submit</button>
      </form>
    )
  }
}

const EventFormContainer = connect()(EventForm)

export default EventFormContainer