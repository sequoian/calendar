import React, {Component} from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import {addEvent, editEvent, closeEditor} from '../actions'
import validate from '../validate'
import BasicOptions from './BasicOptions'
// import {
//   Repeats,
//   ShowMore,
//   Frequency,
//   DaysOfWeek,
//   EndNever,
//   EndOn,
//   EndAfter,
//   EndOptions
// } from './RepeatOptions'

class EventForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.id || null,
      title: props.title || '',
      day: props.day ? moment(props.day) : moment(props.selectedDay),
      time: props.time ? moment(props.time).format('h:mma') : '',
      details: props.details || '',
      repeats: props.repeats || 'no',
      frequency: props.frequency || 1,
      daysOfWeek: props.daysOfWeek || [0, 0, 0, 0, 0, 0, 0],
      endOption: props.endOption || 'never',
      endOn: props.endOn ? moment(props.endOn) : moment().add(1, 'M'),
      endAfter: props.endAfter || 10,
      showMore: false,
      errors: {}
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

  submit(e) {
    e.preventDefault()
    const event = this.state

    // validate
    const errors = validate(event)
    if (Object.keys(errors).length > 0) {
      return this.setState({
        errors
      })
    }

    // update store
    const {dispatch} = this.props
    if (event.id) {
      dispatch(editEvent(event))
    }
    else {
      dispatch(addEvent(event))
    }
    dispatch(closeEditor())
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
          errors={state.errors}
          onChange={this.handleChange}
          onChangeDatePicker={value => {
            this.setDatePicker('day', value)
          }}
          onBlurTime={this.formatTime}
        />
        
        {/* <Repeats
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
        : null} */}

        <button>Save</button>
      </form>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state.editor.event,
    selectedDay: state.calendar.selectedDay
  }
}

const EventFormContainer = connect(
  mapStateToProps
)(EventForm)

export default EventFormContainer