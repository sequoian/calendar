import React from 'react'
import {connect} from 'react-redux'
import {openEditor} from '../actions'

const NewEventBtn = ({onClick}) => (
  <button
    className="new-event"
    onClick={onClick}
  >
    New Event
  </button>
)

const mapDispatchToProps = dispatch => {
  return {
    onClick: () => dispatch(openEditor())
  }
}

const NewEventBtnContainer = connect(
  null,
  mapDispatchToProps
)(NewEventBtn)

export default NewEventBtnContainer