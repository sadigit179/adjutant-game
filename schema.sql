-- The game creates these tables by itself on first use; this file is only for reference.
CREATE TABLE IF NOT EXISTS diary (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  n      TEXT NOT NULL,          -- player's name
  c      TEXT NOT NULL,          -- college id
  txt    TEXT NOT NULL,          -- the memory
  t      INTEGER NOT NULL,       -- time written (ms)
  hidden INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS diary_t ON diary (t DESC);
CREATE TABLE IF NOT EXISTS counter (k TEXT PRIMARY KEY, n INTEGER NOT NULL);
