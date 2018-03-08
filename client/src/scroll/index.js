export default function scrollToDay(day) {
  const elem = document.getElementById(day)
  console.log(elem)
  if (!elem) return
  const headerHeight = document.getElementById('header').offsetHeight
  elem.scrollIntoView(true)
  window.scrollBy(0, -headerHeight)
}