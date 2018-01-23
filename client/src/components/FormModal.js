import React from 'react'
import ReactModal from 'react-modal'

const modalStyle = {
  content: {
    top: '50%', 
    left: '50%', 
    right: 'auto', 
    bottom: 'auto', 
    width: '300px',
    height: '500px',
    marginLeft: '-150px',
    marginTop: '-250px',
    padding: '10px'
  }
}

const headerStyle = {
  padding: '8px'
}

const footerStyle = {
  padding: '8px 8px 0 0'
}

const FormModal = ({isOpen, onRequestClose, onSubmit, children}) => (
  <ReactModal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    style={modalStyle}
    appElement={document.getElementById('root')}
  >
    <Header 
      onClose={onRequestClose}
    />
    {children}
    <Footer
      onSubmit={onSubmit}
    />

  </ReactModal>
)

const Header = ({onClose}) => (
  <div style={headerStyle}>
    <a href="#"
    className="close"
    onClick={e => {
      e.preventDefault()
      onClose(e)
    }} />
  </div>
)

const Footer = ({onSubmit}) => (
  <div style={footerStyle}>
    <button
      type="button"
      onClick={onSubmit}
    >
      Save
    </button>
  </div>

)

export default FormModal