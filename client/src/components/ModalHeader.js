import React from 'react'

const ModalHeader = ({eventId, onClose, onDelete}) => (
  <div>
    {eventId ? 
      <button onClick={onDelete}>
        Delete
      </button>
      : null
    }
    <span>{eventId ? 'Edit' : 'New'}</span>
    <button onClick={onClose}>
      Close
    </button>
  </div>
)

export default ModalHeader