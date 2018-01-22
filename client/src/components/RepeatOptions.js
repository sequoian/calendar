import React, {Component} from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

class RepeatOptions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      repeats: this.props.repeats || 'no',
      frequency: this.props.frequency || 1,
      daysOfWeek: this.props.daysOfWeek || [0, 0, 0, 0, 0, 0, 0],
      endOption: this.props.endOption || 'never',
      endOn: this.props.endOn || moment(),
      endAfter: this.props.endAfter || 10,
      showMore: false
    }
    this.update = this.update.bind(this)
    this.setRepeatOption = this.setRepeatOption.bind(this)
    this.setEndDate = this.setEndDate.bind(this)
    this.setDaysOfWeek = this.setDaysOfWeek.bind(this)
    this.showMore = this.showMore.bind(this)
  }

  update(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  setRepeatOption(event) {
    this.setState({
      repeats: event.target.value
    })
  }

  setEndDate(value) {
    this.setState({
      endOn: value
    })
  }

  setDaysOfWeek(event) {
    const idx = event.target.value
    this.setState((prevState) => {
      const values = prevState.daysOfWeek.slice()
      values[idx] = values[idx] === 0 ? 1 : 0
      return {
        daysOfWeek: values
      }
    })
  }

  showMore(event) {
    this.setState((prevState) => {
      return {
        showMore: !prevState.showMore
      }
    })
  }

  render() {
    const {repeats, frequency, endOption, endOn, endAfter, daysOfWeek, showMore} = this.state
    return (
      <div className="repeat-options">
        <Select 
          selected={repeats}
          update={this.setRepeatOption}
        />
        <MoreButton 
          repeats={repeats}
          onClick={this.showMore}
          more={showMore}
        />
        {repeats !== 'no' && showMore 
          ?
          <div>
          <RepeatsEvery 
            value={frequency}
            interval={repeats}
            update={this.update}
          />
          <DayOfWeek 
            repeats={repeats}
            selected={daysOfWeek}
            onChange={this.setDaysOfWeek}
          />
          <Ends 
            selected={endOption}
            endOn={endOn}
            endAfter={endAfter}
            update={this.update}
            updateEndDate={this.setEndDate}
            onOptionChange={this.update}
          />
          </div>
          : 
          undefined 
        }
      </div>
    )
  }
}

const Select = ({selected, update}) => (
  <select value={selected} onChange={update}>
    <option value="no">Does not repeat</option>
    <option value="day">Daily</option>
    <option value="week">Weekly</option>
    <option value="month">Monthly</option>
    <option value="year">Annually</option>
  </select>
)

const MoreButton = ({repeats, onClick, more}) => {
  if (repeats === 'no') return null
  return (
    <button
      type="button"
      onClick={onClick}
    >
      {more ? 'Hide Options' : 'More Options'}
    </button>
  )
}

const RepeatsEvery = ({value, interval, update}) => (
  <div>
    Repeats every
    <input
      name="frequency"
      type="number"
      min="1"
      value={value}
      onChange={update}
    />
    {interval}{value > 1 && 's'}.
  </div>
)

const DayOfWeek = ({repeats, selected, onChange}) => {
  if (repeats !== 'week') return null
  return (
    <div>
    Repeats on
    <input 
      type="checkbox" 
      id="sun" value="0" 
      checked={selected[0]} 
      onChange={onChange}
    />
    <label htmlFor="sun">S</label>
    <input 
      type="checkbox" 
      id="mon" 
      value="1" 
      checked={selected[1]} 
      onChange={onChange}
    />
    <label htmlFor="mon">M</label>
    <input 
      type="checkbox" 
      id="tue" 
      value="2" 
      checked={selected[2]}
      onChange={onChange} 
    />
    <label htmlFor="tue">T</label>
    <input 
      type="checkbox" 
      id="wed" 
      value="3" 
      checked={selected[3]} 
      onChange={onChange}
    />
    <label htmlFor="wed">W</label>
    <input 
      type="checkbox" 
      id="thu" 
      value="4" 
      checked={selected[4]}
      onChange={onChange} 
    />
    <label htmlFor="thu">T</label>
    <input 
      type="checkbox" 
      id="fri" 
      value="5" 
      checked={selected[5]} 
      onChange={onChange}
    />
    <label htmlFor="fri">F</label>
    <input 
      type="checkbox" 
      id="sat" 
      value="6" 
      checked={selected[6]} 
      onChange={onChange}
    />
    <label htmlFor="sat">S</label>
  </div>
  )
}

const Ends = ({selected, endOn, endAfter, updateEndDate, update, onOptionChange}) => (
  <div>
    Ends
    <br />
    <input 
      id="never" 
      type="radio" 
      name="endOption" 
      value="never" 
      checked={selected === 'never'}
      onChange={onOptionChange}
    />
    <label htmlFor="never">Never</label>
    <br />
    <input 
      id="on" 
      type="radio" 
      name="endOption" 
      value="on" 
      checked={selected === 'on'}
      onChange={onOptionChange} 
    />
    <label htmlFor="on">On</label>
    <DatePicker
      name="end-date"
      selected={endOn}
      dateFormat="MMM DD, YYYY"
      onChange={updateEndDate}
      placeholderText="End date"
      disabled={selected !== 'on'}
    />
    <br />
    <input 
      id="after" 
      type="radio" 
      name="endOption" 
      value="after" 
      checked={selected === 'after'}
      onChange={onOptionChange}
    />
    <label htmlFor="after">After</label>
    <input 
      type="number" 
      name="endAfter"
      min="1" 
      onChange={update}
      value={endAfter}
      disabled={selected !== 'after'}
    /> occurance{endAfter > 1 && 's'}
  </div>
)

export default RepeatOptions