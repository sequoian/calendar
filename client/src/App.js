import React, { Component } from 'react'
import EventForm from './components/EventForm'
import moment from 'moment'

class App extends Component {
  render() {
    const now = moment('2018-01-10')
    return (
      <div className="App">
        <EventForm 
          day={now}
        />
      </div>
    )
  }
}

export default App