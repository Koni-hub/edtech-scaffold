-- Migration: Switch from OpenAI (1536d) to Gemini (768d) embeddings
-- Run this in Supabase SQL editor

ALTER TABLE module_chunks ALTER COLUMN embedding TYPE vector(768);

DROP INDEX IF EXISTS idx_module_chunks_embedding;

CREATE INDEX idx_module_chunks_embedding
  ON module_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
