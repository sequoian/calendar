import React, {Component} from 'react'
import {connect} from 'react-redux'
import {changeDay} from '../actions'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import '../css/Header.css'
import NewEventBtn from './NewEventBtn'

const Header = ({selectedDay, onDayChange}) => (
  <div className="header">
    <DatePicker
      dateFormat="MMM DD, YYYY"
      customInput={<DatePickerInput />}
      selected={selectedDay}
      onChange={onDayChange}
      todayButton={"Today"}
      highlightDates={[moment()]}
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
    onDayChange: value => dispatch(changeDay(value))
  }
}

const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)

export default HeaderContainer