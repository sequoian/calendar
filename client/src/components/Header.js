import React, {Component} from 'react'
import {connect} from 'react-redux'
import {changeDay} from '../actions'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const Header = ({selectedDay, onDayChange}) => (
  <div>
    <DatePicker
      dateFormat="MMM DD, YYYY"
      customInput={<DatePickerInput />}
      selected={selectedDay}
      onChange={onDayChange}
      todayButton={"Today"}
    />
  </div>
)

class DatePickerInput extends Component {
  render() {
    return (
      <button onClick={this.props.onClick}>
        {this.props.value}
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