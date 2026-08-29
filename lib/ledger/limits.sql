-- Durable rate limiting, replacing the in-memory counters.
--
-- The old caps were keyed to a cookie and held in a Map, so clearing cookies
-- reset them, every serverless instance had its own, and a deploy wiped them.
-- That was demonstrated, not theorised: three requests with no cookie all
-- succeeded.
--
-- Counting rows in the table the calls already land in makes both caps real:
-- shared across instances, surviving deploys, and keyed to something the caller
-- cannot discard.
--
--   node --env-file=.env scripts/apply-schema.mjs

-- Not the raw address. A salted hash is enough to count against and cannot be
-- read back into an IP, which is the right trade for a demo that only needs to
-- know "is this the same caller as a minute ago".
ALTER TABLE calls ADD COLUMN IF NOT EXISTS ip_hash TEXT;

CREATE INDEX IF NOT EXISTS calls_ip_recent_idx ON calls (ip_hash, created_at DESC);

CREATE INDEX IF NOT EXISTS calls_created_idx ON calls (created_at DESC);
