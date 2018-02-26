import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export const Repeats = ({repeats, onChange}) => (
  <select
    name="repeats"
    value={repeats} 
    onChange={onChange}
  >
    <option value="no">Does not repeat</option>
    <option value="day">Daily</option>
    <option value="week">Weekly</option>
    <option value="month">Monthly</option>
    <option value="year">Annually</option>
  </select>
)

export const ShowMore = ({isShowing, onClick}) => (
  <button
    type="button"
    onClick={onClick}
  >
    {isShowing ? 'Hide Options' : 'More Options'}
  </button>
)

export const Frequency = ({frequency, repeats, onChange}) => (
  <div>
    <span>Repeats every</span>
    <input
      name="frequency"
      type="number"
      min="1"
      value={frequency}
      onChange={onChange}
    />
    {repeats}{frequency > 1 && 's'}
  </div>
)

export const DaysOfWeek = ({days, onChange}) => {
  const dayList = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return (
    <div>
      <span>Repeats on</span>
      {dayList.map((item, idx) => (
        <div key={idx}>
          <input
            type="checkbox"
            id={item}
            value={idx}
            checked={days[idx]}
            onChange={onChange}
          />
          <label htmlFor={item}>{item[0].toUpperCase()}</label>
        </div>
      ))}
    </div>
  )
}

export const EndNever = ({checked, onChange}) => (
  <div>
    <input 
      id="never" 
      type="radio" 
      name="endOption" 
      value="never" 
      checked={checked}
      onChange={onChange}
    />
    <label htmlFor="never">Never</label>
  </div>
)

export const EndOn = ({checked, onChange, date, onDateChange}) => (
  <div>
    <input 
      id="on" 
      type="radio" 
      name="endOption" 
      value="on" 
      checked={checked}
      onChange={onChange} 
    />
    <label htmlFor="on">On</label>
    <DatePicker
      name="endOn"
      dateFormat="MMM DD, YYYY"
      placeholderText="End date"
      selected={date}
      onChange={onDateChange}
      disabled={!checked}
    />
  </div>
)

export const EndAfter = ({checked, number, onChange}) => (
  <div>
    <input 
      id="after" 
      type="radio" 
      name="endOption" 
      value="after" 
      checked={checked}
      onChange={onChange}
    />
    <label htmlFor="after">After</label>
    <input 
      type="number" 
      name="endAfter"
      min="1" 
      value={number}
      onChange={onChange}
      disabled={!checked}
    />
    <span>occurance{number > 1 && 's'}</span>
  </div>
)

export const EndOptions = ({children}) => (
  <div>
    <span>Ends</span>
    <fieldset>
      {children}
    </fieldset>
  </div>
)