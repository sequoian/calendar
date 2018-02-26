import React from 'react'
import ReactModal from 'react-modal'

const Modal = ({isOpen, onClose, children}) => (
  <ReactModal
    isOpen={isOpen}
    onRequestClose={onClose}
    appElement={document.getElementById('root')}
  >
    {children}
  </ReactModal>
)

export default Modal