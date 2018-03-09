import React, {Component} from 'react'
import {connect} from 'react-redux'
import {changeDay} from '../actions'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '../css/Header.css'
import NewEventBtn from './NewEventBtn'
import {scrollToDay} from '../scroll'

const Header = ({selectedDay, onDayChange}) => (
  <div id="header">
    <h1>Calendar</h1>
    <DatePicker
      dateFormat="MMM DD, YYYY"
      customInput={<DatePickerInput />}
      selected={selectedDay}
      onChange={onDayChange}
      todayButton={"Today"}
      onSelect={value => {
        value = value.startOf('day').valueOf()
        if (value === selectedDay.valueOf()) scrollToDay(value)
      }}
    />
    <NewEventBtn />
  </div>
)

class DatePickerInput extends Component {
  render() {
    return (
      <button 
        id="calendar"
        onClick={this.props.onClick}
      >
        {this.props.value}<span className="select" />
      </button>
    )
  }
}

const mapStateToProps = state => {
  return {
    selectedDay: state.calendar.selectedDay
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDayChange: value => {
      dispatch(changeDay(value))
    }
  }
}

const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)

export default HeaderContainer