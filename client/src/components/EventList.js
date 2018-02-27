import React from 'react'
import {connect} from 'react-redux'
import {openEditor} from '../actions'
import Event from './Event'

const EventList = ({events, onEventClick}) => (
  <ul>
    {events.map(event => (
      <li key={event.id}>
        <Event
          value={event}
          onClick={e => onEventClick(event)}
        />
      </li>
    ))}
  </ul>
)

const mapStateToProps = state => {
  return {
    events: state.events,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onEventClick: event => dispatch(openEditor(event))
  }
}

const EventListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventList)

export default EventListContainer