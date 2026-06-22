ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'pro')),
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT,
  ADD COLUMN IF NOT EXISTS usage_reset_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS quiz_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS flashcard_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS enhance_count INT NOT NULL DEFAULT 0;
