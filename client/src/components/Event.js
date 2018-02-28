import React from 'react'
import moment from 'moment'

const Event = ({value, onClick}) => (
  <div onClick={onClick}>
    <span>{value.time ? moment(value.time).format('h:mma') + ' - ' : ''}</span>
    <span>{value.title}</span>
  </div>
)

export default Event