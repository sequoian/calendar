import React from 'react'
import '../css/ModalHeader.css'

const ModalHeader = ({eventId, onClose, onDelete}) => (
  <div className="modal-header">
    {eventId ? 
      <button 
        className="delete-btn"
        onClick={onDelete}
      >
        Delete
      </button>
      : <span />
    }
    <span>{eventId ? 'Edit' : 'New'}</span>
    <button 
      className="close-btn"
      onClick={onClose}
    >
      ×
    </button>
  </div>
)

export default ModalHeader