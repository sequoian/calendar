class Storage {

  static loadState(key) {
    try {
      const serializedState = localStorage.getItem(key)
      if (serializedState === null) throw new Error()
      return JSON.parse(serializedState)
    } catch (e) {
      return
    }
  }

  static saveState(key, state) {
    try {
      const serializedState = JSON.stringify(state)
      localStorage.setItem(key, serializedState)
    } catch (e) {
      return
    }
  }
}

export default Storage