class EventRepository {
  constructor(db) {
    this.db = db
  }

  add(data) {
    return this.db.one(`
      INSERT INTO events (title, day, time, location, description, owner)
      VALUES ($[title], $[day], $[time], $[location], $[description], $[owner])
      RETURNING *
    `, data)
  }

  update(data) {
    return this.db.oneOrNone(`
      UPDATE events SET
        title = $[title],
        day = $[day],
        time = $[time],
        location = $[location],
        description = $[description],
        owner = $[owner]
      WHERE id = $[id] RETURNING *
    `, data)
  }

  remove(id) {
    return this.db.result(`
      DELETE FROM events WHERE id = $1
    `, id, result => result.rowCount)
  }

  findById(id) {
    return this.db.oneOrNone(`
      SELECT * FROM events WHERE id = $1
    `, id)
  }

  findAllByUser(userId) {
    return this.db.any(`
      SELECT * FROM events WHERE owner = $1
    `, userId)
  }

  clearTable() {
    return this.db.none('TRUNCATE TABLE events CASCADE')
  }
}

module.exports = EventRepository