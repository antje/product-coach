-- The ledger. One table, because there is one thing worth recording: a call
-- the coach made, and whether it turned out to be right.
--
-- Run once against your database:
--   psql "$DATABASE_URL" -f lib/ledger/schema.sql
--
-- No ORM and no migration tool. At one table those cost more than they save.
-- Revisit that at two or three.

CREATE TABLE IF NOT EXISTS calls (
  id                TEXT PRIMARY KEY,

  -- Scoped to the pc_session cookie, so one visitor cannot see another's calls
  -- or pollute a shared record.
  session_id        TEXT NOT NULL,

  -- 'draft'  a live brief. Cannot be scored yet; the outcome does not exist.
  -- 'replay' a past experiment reviewed blind. Scored immediately on reveal.
  kind              TEXT NOT NULL CHECK (kind IN ('draft', 'replay')),
  experiment_id     TEXT,

  -- What the coach was shown, and what it said. Stored whole so a call can be
  -- re-read exactly as it was made, even after the prompt or corpus changes.
  subject_json      JSONB NOT NULL,
  objection_json    JSONB,

  -- Attribution. A hit rate belongs to a specific prompt and model, or it is
  -- a number about nothing.
  prompt_version    TEXT NOT NULL,
  model             TEXT NOT NULL,
  cost_usd          NUMERIC(10, 6) NOT NULL DEFAULT 0,

  -- The correction-loop signal.
  team_response     TEXT CHECK (team_response IN ('accepted', 'shipped-anyway', 'dismissed')),
  responded_at      TIMESTAMPTZ,

  -- Resolution.
  actual_lift_pp    NUMERIC(6, 2),
  call_outcome      TEXT NOT NULL DEFAULT 'untested'
                    CHECK (call_outcome IN ('right', 'wrong', 'untested', 'not-scored')),
  resolved_at       TIMESTAMPTZ,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS calls_session_created_idx
  ON calls (session_id, created_at DESC);
