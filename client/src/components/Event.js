import React from 'react'
import moment from 'moment'

const Event = ({value, onClick}) => (
  <div onClick={onClick}>
    <span>{moment(value.day).format('MMMM DD, YYYY')} </span>
    <span>{value.time}</span>
    <span> - </span>
    <span>{value.title}</span>
  </div>
)

export default Event