import React from 'react'
import {connect} from 'react-redux'
import ReactModal from 'react-modal'
import {closeEditor} from '../actions'

const Modal = ({isOpen, onClose, children}) => (
  <ReactModal
    isOpen={isOpen}
    onRequestClose={onClose}
    appElement={document.getElementById('root')}
  >
    {children}
  </ReactModal>
)

const mapStateToProps = state => {
  return {
    isOpen: state.editor.isOpen
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onClose: () => dispatch(closeEditor())
  }
}

const ModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal)


export default ModalContainer