CREATE TABLE events (
  id            SERIAL PRIMARY KEY,
  title         text NOT NULL,
  day           date,
  time          text,
  location      text,
  description   text,
  owner         integer REFERENCES users ON DELETE CASCADE NOT NULL,
  date_created  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);