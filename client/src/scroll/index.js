export default function scrollToDay(day) {
  const elem = document.getElementById(day)
  if (!elem) return
  elem.scrollIntoView(true)
  // align top of element as close to bottom of header as possible
  const headerHeight = document.getElementById('header').offsetHeight
  const distanceFromTop = elem.getBoundingClientRect().top
  if (distanceFromTop < headerHeight) {
    window.scrollBy(0, -(headerHeight - distanceFromTop))
  }
}