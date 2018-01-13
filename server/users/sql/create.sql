CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         text NOT NULL UNIQUE,
  password      text NOT NULL,
  name          text,
  date_joined   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_reset (
  id              SERIAL PRIMARY KEY,
  user_id         integer REFERENCES users ON DELETE CASCADE NOT NULL,
  time_requested  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);