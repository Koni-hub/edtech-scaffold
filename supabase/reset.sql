-- ============================================================================
-- DATABASE RESET: Drops everything and re-runs the full migration.
-- Run this in the Supabase SQL editor to start fresh.
-- WARNING: This deletes ALL data in the public schema.
-- ============================================================================

-- ============================================================================
-- DROP EXISTING (reverse dependency order)
-- ============================================================================

-- Drop triggers first (before functions they reference)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS set_modules_updated_at ON modules;
DROP TRIGGER IF EXISTS set_topic_mastery_updated_at ON topic_mastery;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column CASCADE;

-- Drop tables (CASCADE handles dependent objects)
DROP TABLE IF EXISTS analytics_snapshots CASCADE;
DROP TABLE IF EXISTS topic_mastery CASCADE;
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS module_chunks CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================================================
-- FULL MIGRATION (re-created from 001_schema.sql)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- TABLES
-- ============================================================================

-- 1. profiles
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url   TEXT,
  role         TEXT NOT NULL DEFAULT 'student'
               CHECK (role IN ('student','educator','admin')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. modules
CREATE TABLE modules (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  content_type  TEXT NOT NULL DEFAULT 'text'
                CHECK (content_type IN ('pdf','text','markdown')),
  storage_path  TEXT,
  raw_text      TEXT,
  status        TEXT NOT NULL DEFAULT 'processing'
                CHECK (status IN ('processing','ready','failed')),
  topic_labels  TEXT[] NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. module_chunks
CREATE TABLE module_chunks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id    UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  chunk_index  INT NOT NULL,
  content      TEXT NOT NULL,
  token_count  INT NOT NULL DEFAULT 0,
  embedding    VECTOR(1536),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (module_id, chunk_index)
);

-- 4. quizzes
CREATE TABLE quizzes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id        UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  quiz_type        TEXT NOT NULL DEFAULT 'initial'
                   CHECK (quiz_type IN ('initial','review','spaced_retrieval')),
  difficulty       TEXT NOT NULL DEFAULT 'medium'
                   CHECK (difficulty IN ('easy','medium','hard')),
  topic_focus      TEXT[] NOT NULL DEFAULT '{}',
  question_ids     UUID[] NOT NULL DEFAULT '{}',
  time_limit_seconds INT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. questions
CREATE TABLE questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id         UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  topic           TEXT NOT NULL,
  question_text   TEXT NOT NULL,
  question_type   TEXT NOT NULL DEFAULT 'mcq'
                  CHECK (question_type IN ('mcq','true_false','short_answer')),
  options         JSONB,
  correct_answer  TEXT NOT NULL,
  explanation     TEXT,
  difficulty      TEXT NOT NULL DEFAULT 'medium'
                  CHECK (difficulty IN ('easy','medium','hard')),
  order_index     INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. quiz_attempts
CREATE TABLE quiz_attempts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id       UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id   UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  given_answer  TEXT NOT NULL,
  is_correct    BOOLEAN NOT NULL,
  time_spent_ms INT NOT NULL DEFAULT 0,
  attempted_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. topic_mastery
CREATE TABLE topic_mastery (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic                TEXT NOT NULL,
  total_attempts       INT NOT NULL DEFAULT 0,
  correct_attempts     INT NOT NULL DEFAULT 0,
  understanding_score  NUMERIC(5,2) NOT NULL DEFAULT 0,
  retention_score      NUMERIC(5,2) NOT NULL DEFAULT 0,
  last_assessed_at     TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, topic)
);

-- 8. analytics_snapshots
CREATE TABLE analytics_snapshots (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  snapshot_date            DATE NOT NULL,
  overall_understanding    NUMERIC(5,2) NOT NULL DEFAULT 0,
  overall_retention        NUMERIC(5,2) NOT NULL DEFAULT 0,
  topics_covered           INT NOT NULL DEFAULT 0,
  quizzes_taken            INT NOT NULL DEFAULT 0,
  total_questions_answered INT NOT NULL DEFAULT 0,
  streak_days              INT NOT NULL DEFAULT 0,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, snapshot_date)
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- profiles: user sees own row
CREATE POLICY "users_see_own_profile"
  ON profiles FOR ALL
  USING (id = auth.uid());

-- modules: user sees own modules
CREATE POLICY "users_see_own_modules"
  ON modules FOR ALL
  USING (user_id = auth.uid());

-- module_chunks: via module ownership
CREATE POLICY "users_see_own_chunks"
  ON module_chunks FOR ALL
  USING (module_id IN (SELECT id FROM modules WHERE user_id = auth.uid()));

-- quizzes: user sees own quizzes
CREATE POLICY "users_see_own_quizzes"
  ON quizzes FOR ALL
  USING (user_id = auth.uid());

-- questions: via quiz ownership
CREATE POLICY "users_see_own_questions"
  ON questions FOR ALL
  USING (quiz_id IN (SELECT id FROM quizzes WHERE user_id = auth.uid()));

-- quiz_attempts: user sees own attempts
CREATE POLICY "users_see_own_attempts"
  ON quiz_attempts FOR ALL
  USING (user_id = auth.uid());

-- topic_mastery: user sees own mastery
CREATE POLICY "users_see_own_mastery"
  ON topic_mastery FOR ALL
  USING (user_id = auth.uid());

-- analytics_snapshots: user sees own snapshots
CREATE POLICY "users_see_own_snapshots"
  ON analytics_snapshots FOR ALL
  USING (user_id = auth.uid());

-- ============================================================================
-- TRIGGERS (updated_at)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_modules_updated_at
  BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_topic_mastery_updated_at
  BEFORE UPDATE ON topic_mastery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_modules_user_id          ON modules(user_id);
CREATE INDEX idx_module_chunks_module_id  ON module_chunks(module_id);
CREATE INDEX idx_quizzes_module_id        ON quizzes(module_id);
CREATE INDEX idx_quizzes_user_id          ON quizzes(user_id);
CREATE INDEX idx_questions_quiz_id        ON questions(quiz_id);
CREATE INDEX idx_quiz_attempts_quiz_id    ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id    ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_question_id ON quiz_attempts(question_id);
CREATE INDEX idx_topic_mastery_user_id    ON topic_mastery(user_id);
CREATE INDEX idx_analytics_snapshots_user_id ON analytics_snapshots(user_id);

-- IVFFlat index on embedding column for vector similarity search
CREATE INDEX idx_module_chunks_embedding
  ON module_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ============================================================================
-- AUTO-PROFILE CREATION TRIGGER
-- ============================================================================
-- Creates a profile row automatically when a new user signs up via Supabase Auth.
-- The display_name is taken from raw_user_meta_data (set via signUp options).
-- This means the frontend registration page does NOT need to insert into profiles.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
