import React from 'react'
import moment from 'moment'

const Event = ({value, onClick}) => (
  <div onClick={onClick}>
    <div>
      <span>{value.time ? moment(value.time).format('h:mma') + ' - ' : ''}</span>
      <span>{value.title}</span>
    </div>
    <div>{value.details}</div>

  </div>
)

export default Event