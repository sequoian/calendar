import React from 'react'
import {connect} from 'react-redux'
import {nextDay, prevDay} from '../actions'
import '../css/Nav.css'

const Nav = ({next, prev}) => (
  <div className="nav">
    <button onClick={prev}><i className="arrow left" /></button>
    <button onClick={next}><i className="arrow right" /></button>
  </div>
)

const mapDispatchToProps = dispatch => {
  return {
    next: e => dispatch(nextDay()),
    prev: e => dispatch(prevDay())
  }
}

const NavContainer = connect(
  null,
  mapDispatchToProps
)(Nav)

export default NavContainer