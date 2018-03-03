const validateEvent = (event) => {
  const errors = {}
  if (event.title.trim() === '') {
    errors.title = 'Required'
  }

  if (!event.day) {
    errors.day = 'Valid day required'
  }
  
  return errors
}

export default validateEvent