const validateEvent = (event) => {
  const errors = {}
  if (event.title.trim() === '') {
    errors.title = 'Required'
  }
  return errors
}

export default validateEvent