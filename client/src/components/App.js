import React, {Component} from 'react'
import EventForm from './EventForm'
import Modal from './Modal'
import EventList from './EventList'
import Header from './Header'
import '../css/App.css'
import {scrollToDay} from '../scroll'
import moment from 'moment'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }

  componentDidMount() {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    scrollToDay(moment().startOf('day').valueOf())
  }

  render() {
    return (
      <div className="App">
        <Header />
        <EventList />
        <Modal>
          <EventForm />
        </Modal>
      </div>
    )
  }
}

export default App