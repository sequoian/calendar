import React from 'react'
import {connect} from 'react-redux'

const EventList = ({events, edit}) => (
  <ul>
    {events.map(event => (
      <li key={event.id}>
        <div
          onClick={e => edit(event)}
        >
          {event.title}
        </div>
      </li>
    ))}
  </ul>
)

const mapStateToProps = state => {
  return {
    events: state.events,
  }
}

const EventListContainer = connect(
  mapStateToProps
)(EventList)

export default EventListContainer