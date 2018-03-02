import React from 'react'
import {connect} from 'react-redux'
import ReactModal from 'react-modal'
import {closeEditor, deleteEvent} from '../actions'
import '../css/Modal.css'
import ModalHeader from './ModalHeader'

const Modal = ({isOpen, eventId, onClose, onDelete, children}) => (
  <ReactModal
    className="modal"
    isOpen={isOpen}
    onRequestClose={onClose}
    appElement={document.getElementById('root')}
  >
    <ModalHeader
      eventId={eventId}
      onClose={onClose}
      onDelete={e => onDelete(eventId)}
    />
    {children}
  </ReactModal>
)

const mapStateToProps = state => {
  return {
    isOpen: state.editor.isOpen,
    eventId: state.editor.event ? state.editor.event.id : null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onClose: () => dispatch(closeEditor()),
    onDelete: id => {
      dispatch(deleteEvent(id))
      dispatch(closeEditor())
    }
  }
}

const ModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal)


export default ModalContainer