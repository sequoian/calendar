class Storage {

  static loadState() {
    try {
      const serializedState = localStorage.getItem('state')
      if (serializedState === null) throw new Error()
      return JSON.parse(serializedState)
    } catch (e) {
      return
    }
  }

  static saveState(state) {
    try {
      const serializedState = JSON.stringify(state)
      localStorage.setItem('state', serializedState)
    } catch (e) {
      return
    }
  }
}

export default Storage